#!/usr/bin/env node
/**
 * EvoMap Asset Publisher
 *
 * Usage:
 *   node scripts/evomap-publish.js
 *   node scripts/evomap-publish.js --dry-run
 *   node scripts/evomap-publish.js --event <event-id>
 *   node scripts/evomap-publish.js --all
 *
 * Default behavior publishes the latest local evolution bundle from assets/gep/.
 *
 * Requires: ~/.evomap/node_id and ~/.evomap/node_secret
 */

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GEP_DIR = path.join(ROOT, 'assets', 'gep');

function readSecret(name) {
  return fs.readFileSync(path.join(os.homedir(), '.evomap', name), 'utf8').trim();
}

function readJson(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    return fallbackValue;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function canonicalStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalStringify).join(',')}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalStringify(value[key])}`)
    .join(',')}}`;
}

function withAssetId(asset) {
  const clone = JSON.parse(JSON.stringify(asset));
  delete clone.asset_id;
  return {
    ...asset,
    asset_id: asset.asset_id || `sha256:${crypto.createHash('sha256').update(canonicalStringify(clone)).digest('hex')}`,
  };
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    eventId: null,
    publishAll: false,
    maxRetries: 3,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (token === '--all') {
      args.publishAll = true;
      continue;
    }
    if (token === '--event') {
      args.eventId = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (token === '--max-retries') {
      const nextValue = Number.parseInt(argv[index + 1] || '', 10);
      if (!Number.isNaN(nextValue) && nextValue >= 0) {
        args.maxRetries = nextValue;
      }
      index += 1;
    }
  }

  return args;
}

function byId(list) {
  return new Map(list.map((entry) => [entry.id, entry]));
}

function pickLatestEvent(events, explicitEventId) {
  if (explicitEventId) {
    const found = events.find((event) => event.id === explicitEventId);
    if (!found) {
      throw new Error(`Unknown event id: ${explicitEventId}`);
    }
    return found;
  }

  if (events.length === 0) {
    throw new Error('No local EvolutionEvent assets found in assets/gep/events.jsonl');
  }

  return events[events.length - 1];
}

function uniqueAssets(assets) {
  const seen = new Set();
  const result = [];

  for (const asset of assets) {
    if (!asset || !asset.id || seen.has(asset.id)) {
      continue;
    }
    seen.add(asset.id);
    result.push(withAssetId(asset));
  }

  return result;
}

function loadBundle(args) {
  const genes = readJson(path.join(GEP_DIR, 'genes.json'), []);
  const capsules = readJson(path.join(GEP_DIR, 'capsules.json'), []);
  const events = readJsonLines(path.join(GEP_DIR, 'events.jsonl'));

  if (args.publishAll) {
    return uniqueAssets([...genes, ...capsules, ...events]);
  }

  const geneMap = byId(genes);
  const capsuleMap = byId(capsules);
  const event = pickLatestEvent(events, args.eventId);
  const assets = [];

  assets.push(event);

  if (event.capsule_id) {
    const capsule = capsuleMap.get(event.capsule_id);
    if (!capsule) {
      throw new Error(`Event ${event.id} references missing capsule ${event.capsule_id}`);
    }
    assets.push(capsule);

    if (capsule.gene) {
      const capsuleGene = geneMap.get(capsule.gene);
      if (capsuleGene) {
        assets.push(capsuleGene);
      }
    }
  }

  for (const geneId of event.genes_used || []) {
    const gene = geneMap.get(geneId);
    if (!gene) {
      throw new Error(`Event ${event.id} references missing gene ${geneId}`);
    }
    assets.push(gene);
  }

  return uniqueAssets(assets);
}

function createMessage(nodeId, assets) {
  return {
    protocol: 'gep-a2a',
    protocol_version: '1.0.0',
    message_type: 'publish',
    message_id: `msg_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
    sender_id: nodeId,
    timestamp: new Date().toISOString(),
    payload: { assets },
  };
}

function publishMessage(nodeSecret, message) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(message);
    const request = https.request(
      {
        hostname: 'evomap.ai',
        path: '/a2a/publish',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          Authorization: `Bearer ${nodeSecret}`,
        },
      },
      (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            body: data,
          });
        });
      }
    );

    request.on('error', reject);
    request.write(body);
    request.end();
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function publishWithRetry(nodeSecret, message, maxRetries) {
  let attempt = 0;

  while (true) {
    attempt += 1;
    const result = await publishMessage(nodeSecret, message);
    let parsed = null;

    try {
      parsed = JSON.parse(result.body);
    } catch (error) {
      parsed = null;
    }

    const payload = parsed && (parsed.payload || parsed);
    const retryDelay =
      payload && typeof payload.retry_after_ms === 'number' ? payload.retry_after_ms : 3000;

    if (result.statusCode !== 503 || attempt > maxRetries) {
      return { result, parsed };
    }

    console.log(`Retrying after ${retryDelay}ms (attempt ${attempt}/${maxRetries})`);
    await sleep(retryDelay);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const nodeId = readSecret('node_id');
  const nodeSecret = readSecret('node_secret');
  const assets = loadBundle(args);
  const message = createMessage(nodeId, assets);

  console.log(`Assets: ${assets.map((asset) => asset.id).join(', ')}`);

  if (args.dryRun) {
    console.log(JSON.stringify(message, null, 2));
    return;
  }

  const { result, parsed } = await publishWithRetry(nodeSecret, message, args.maxRetries);
  console.log(`Status: ${result.statusCode}`);

  try {
    const payload = parsed.payload || parsed;
    if (payload.decision) {
      console.log(`Decision: ${payload.decision}`);
    }
    if (payload.bundle_id) {
      console.log(`Bundle: ${payload.bundle_id}`);
    }
    if (!payload.decision && !payload.bundle_id) {
      console.log(JSON.stringify(parsed, null, 2));
    }
  } catch (error) {
    console.log(result.body);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
