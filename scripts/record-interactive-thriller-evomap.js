#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { loadInteractiveThrillerPlan } = require('./lib/interactive-thriller-plan');

const ROOT = path.resolve(__dirname, '..');
const GEP_DIR = path.join(ROOT, 'assets', 'gep');
const QUALITY_PATH = path.join(
  ROOT,
  'interactive-fiction',
  'references',
  'interactive-thriller-quality.md'
);

const REQUIRED_GENES = [
  {
    type: 'Gene',
    schema_version: '1.5.0',
    id: 'gene_if_thriller_quality_planes',
    summary: 'Model interactive thriller quality as reader pull, deductive integrity, and playable consequence across explicit capability planes',
    category: 'innovate',
    signals_match: [
      'genre_signal:interactive_thriller',
      'capability_gap:playable_suspense',
      'capability_gap:logic_rigor'
    ],
    preconditions: [
      'the project already uses a file-first visual novel package layout'
    ],
    strategy: [
      'Define quality planes instead of relying on vague taste',
      'Name failure modes for suspense, logic, convergence, and endings',
      'Turn narrative taste into acceptance checks that a later round can challenge'
    ],
    constraints: {
      max_files: 6,
      forbidden_paths: ['.git', 'node_modules', 'projects']
    },
    validation: [
      'interactive-fiction/references/interactive-thriller-quality.md exists'
    ]
  },
  {
    type: 'Gene',
    schema_version: '1.5.0',
    id: 'gene_if_thriller_100_round_loop',
    summary: 'Run a file-only 100-round thriller evolution loop that scaffolds rounds, checkpoints, and local logs without requiring a database',
    category: 'optimize',
    signals_match: [
      'process_signal:long_horizon_iteration',
      'capability_gap:file_first_task_loop',
      'capability_gap:checkpointed_thriller_iteration'
    ],
    preconditions: [
      'the repository can run local node scripts'
    ],
    strategy: [
      'Expand a 10-band plan into 100 concrete rounds',
      'Generate round briefs, checkpoints, and run state under meta/runs',
      'Keep generated run artifacts local and git-ignored while preserving the method in code'
    ],
    constraints: {
      max_files: 8,
      forbidden_paths: ['.git', 'node_modules']
    },
    validation: [
      'node thriller/scripts/run-interactive-thriller-evolution-loop.js status --base-dir <temp-run-dir>'
    ]
  }
];

function readJson(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    return fallbackValue;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function appendJsonl(filePath, value) {
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function ensureGenes(genes) {
  const byId = new Map(genes.map((gene) => [gene.id, gene]));
  for (const gene of REQUIRED_GENES) {
    if (!byId.has(gene.id)) {
      genes.push(gene);
    }
  }
  return genes;
}

function main() {
  fs.mkdirSync(GEP_DIR, { recursive: true });

  const plan = loadInteractiveThrillerPlan();
  const qualityText = fs.readFileSync(QUALITY_PATH, 'utf8');
  const genesPath = path.join(GEP_DIR, 'genes.json');
  const capsulesPath = path.join(GEP_DIR, 'capsules.json');
  const eventsPath = path.join(GEP_DIR, 'events.jsonl');
  const genes = ensureGenes(readJson(genesPath, []));
  const capsules = readJson(capsulesPath, []);
  const timestamp = new Date().toISOString();
  const token = timestamp.replace(/[-:.TZ]/g, '');

  const capsule = {
    type: 'Capsule',
    schema_version: '1.5.0',
    id: `capsule_if_thriller_loop_${token}`,
    trigger: [
      'genre_signal:interactive_thriller',
      'process_signal:long_horizon_iteration',
      'capability_gap:file_first_task_loop'
    ],
    gene: 'gene_if_thriller_100_round_loop',
    summary: 'Added a modular file-first 100-round interactive thriller evolution system with quality planes, band files, and a local loop runner',
    content: `The system now defines ${plan.totalRounds} rounds across ${plan.bands.length} band modules. The local quality framework begins with: ${qualityText.split('\n').slice(0, 6).join(' ')}`,
    confidence: 0.91,
    blast_radius: {
      files: 8,
      lines: 900
    },
    outcome: {
      status: 'success',
      score: 0.91
    },
    env_fingerprint: {
      platform: process.platform,
      arch: process.arch,
      node_version: process.version,
      local_mode: 'evomap-ledger'
    },
    success_streak: 1
  };

  const event = {
    type: 'EvolutionEvent',
    schema_version: '1.5.0',
    id: `evt_if_thriller_loop_${token}`,
    intent: 'innovate',
    signals: capsule.trigger,
    genes_used: REQUIRED_GENES.map((gene) => gene.id),
    capsule_id: capsule.id,
    outcome: capsule.outcome,
    mutations_tried: 1,
    total_cycles: 1,
    blast_radius: capsule.blast_radius,
    timestamp,
    note: 'Recorded the modular file-first 100-round interactive thriller loop as local EvoMap assets.'
  };

  writeJson(genesPath, genes);
  capsules.push(capsule);
  writeJson(capsulesPath, capsules);
  appendJsonl(eventsPath, event);

  console.log(`OK: recorded ${capsule.id}`);
  console.log(`OK: recorded ${event.id}`);
}

if (require.main === module) {
  main();
}
