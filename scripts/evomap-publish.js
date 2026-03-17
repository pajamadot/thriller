#!/usr/bin/env node
/**
 * EvoMap Asset Publisher for Thriller Skill Pack
 *
 * Usage: node scripts/evomap-publish.js
 *
 * Reads the current project state and publishes a Gene + Capsule + EvolutionEvent
 * bundle to the EvoMap network. Run this after each evolution round.
 *
 * Requires: ~/.evomap/node_id and ~/.evomap/node_secret
 */

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const nodeId = fs.readFileSync(path.join(os.homedir(), '.evomap', 'node_id'), 'utf8').trim();
const nodeSecret = fs.readFileSync(path.join(os.homedir(), '.evomap', 'node_secret'), 'utf8').trim();

// Canonical JSON for asset ID computation
function canonicalStringify(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalStringify).join(',') + ']';
  return '{' + Object.keys(obj).sort().map(k => JSON.stringify(k) + ':' + canonicalStringify(obj[k])).join(',') + '}';
}

function computeAssetId(asset) {
  const clone = JSON.parse(JSON.stringify(asset));
  delete clone.asset_id;
  return 'sha256:' + crypto.createHash('sha256').update(canonicalStringify(clone)).digest('hex');
}

// Count project stats
function getStats() {
  let fileCount = 0, lineCount = 0;
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (f === '.git' || f === 'node_modules') continue;
      const stat = fs.statSync(fp);
      if (stat.isDirectory()) walk(fp);
      else {
        fileCount++;
        if (f.endsWith('.md')) lineCount += fs.readFileSync(fp, 'utf8').split('\n').length;
      }
    }
  }
  walk(ROOT);
  return { fileCount, lineCount };
}

// Read evolution state
function getEvolutionState() {
  const stateFile = path.join(ROOT, 'memory', 'evolution_state.json');
  if (fs.existsSync(stateFile)) return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  return { cycleCount: 0, currentVersion: 'unknown' };
}

// Count reference files
function countRefs(dir) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) return 0;
  return fs.readdirSync(d).filter(f => f.endsWith('.md')).length;
}

async function publish() {
  const stats = getStats();
  const evoState = getEvolutionState();
  const thrillerRefs = countRefs('thriller-writing/references');
  const ifRefs = countRefs('interactive-fiction/references');
  const version = evoState.currentVersion || 'unknown';
  const cycles = evoState.cycleCount || 0;

  console.log(`Project: ${stats.fileCount} files, ${stats.lineCount} lines, v${version}, ${cycles} cycles`);
  console.log(`Refs: ${thrillerRefs} thriller + ${ifRefs} IF`);

  const gene = {
    type: 'Gene', schema_version: '1.5.0',
    id: 'gene_thriller_screenplay_craft',
    category: 'innovate',
    signals_match: ['creative_writing', 'thriller_methodology', 'interactive_fiction', 'mystery_writing', 'screenplay'],
    summary: `Thriller Screenplay Craft v${version}: professional mystery and thriller writing methodology integrating 25 plus screenwriting sources with computational narrative research for both linear novels and branching interactive fiction`,
    preconditions: ['working directory contains thriller-writing and interactive-fiction skill folders'],
    strategy: [
      'Initialize project with /start selecting from 9 mystery sub-types and 3 workflow routes',
      'Design thematic premise using Egri method with Mazin anti-theme architecture',
      'Build core mystery trick with villain-as-plot-engine and dual-reader fairness verification',
      'Create character system with Corbett four-dimension compass and Truby fake-ally opponent',
      'Structure narrative with MICE nesting Yes-but No-and scenes and knowledge state tracking',
      'Write scenes with adversarial suspense design and per-character epistemic state matrix',
      'Convert to branching interactive fiction using scale engineering for 50 to 200 plus nodes',
      'Validate with two-phase consistency check and export to Twine ink ChoiceScript JSON Mermaid'
    ],
    constraints: { max_files: 200, forbidden_paths: ['.git', 'node_modules'] },
    validation: ['node scripts/validate-refs.js']
  };
  gene.asset_id = computeAssetId(gene);

  const capsule = {
    type: 'Capsule', schema_version: '1.5.0',
    id: 'capsule_thriller_' + version.replace(/\./g, '_') + '_' + Date.now(),
    trigger: ['creative_writing', 'thriller', 'mystery', 'interactive_fiction', 'screenplay', 'detective_fiction', 'suspense'],
    gene: gene.asset_id,
    summary: `Thriller Skill Pack ${version}: ${stats.fileCount} files ${stats.lineCount} lines ${thrillerRefs + ifRefs} reference docs covering 9 mystery sub-types with knowledge state tracking adversarial suspense and scale engineering`,
    content: `Complete AI skill pack for professional mystery thriller screenplay creation and interactive fiction conversion. Version ${version} after ${cycles} evolution cycles. ${thrillerRefs} thriller writing references and ${ifRefs} interactive fiction references. Integrates McKee Syd-Field Hitchcock Christie Truby Corbett Sanderson Mazin Frey plus computational narrative research. Repository at github.com/pajamadot/thriller.`,
    strategy: [
      'Use /start to initialize a thriller project with sub-type selection',
      'Follow the three-route workflow: trick-first or character-first or structure-first',
      'Apply knowledge state matrix to track who knows what at every point',
      'Use adversarial plan-failure to systematically create suspense',
      'For interactive fiction use one-node-one-file architecture with codex and rolling summaries',
      'Run two-phase consistency validation structural then narrative',
      'Iterate using /retro and /evolve meta commands'
    ],
    code_snippet: 'node scripts/validate-refs.js',
    confidence: 0.85,
    blast_radius: { files: stats.fileCount, lines: stats.lineCount },
    outcome: { status: 'success', score: 0.85 },
    env_fingerprint: { platform: process.platform, arch: process.arch, evolver_version: '1.32.1', node_version: process.version },
    success_streak: cycles
  };
  capsule.asset_id = computeAssetId(capsule);

  const evt = {
    type: 'EvolutionEvent', schema_version: '1.5.0',
    id: 'evt_thriller_' + version.replace(/\./g, '_') + '_' + Date.now(),
    intent: 'innovate',
    capsule_id: capsule.asset_id,
    genes_used: [gene.asset_id],
    outcome: { status: 'success', score: 0.85 },
    mutations_tried: cycles,
    total_cycles: cycles
  };
  evt.asset_id = computeAssetId(evt);

  const msg = {
    protocol: 'gep-a2a', protocol_version: '1.0.0',
    message_type: 'publish',
    message_id: 'msg_' + Date.now() + '_' + crypto.randomBytes(2).toString('hex'),
    sender_id: nodeId,
    timestamp: new Date().toISOString(),
    payload: { assets: [gene, capsule, evt] }
  };

  return new Promise((resolve, reject) => {
    const body = JSON.stringify(msg);
    const req = https.request({
      hostname: 'evomap.ai', path: '/a2a/publish', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + nodeSecret }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
          const r = JSON.parse(d);
          const p = r.payload || r;
          console.log('Decision:', p.decision);
          console.log('Bundle:', p.bundle_id);
          resolve(p);
        } catch (e) { console.log(d.substring(0, 500)); resolve(null); }
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

publish().catch(console.error);
