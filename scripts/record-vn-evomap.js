#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { compileProject } = require('./compile-vn-project');
const { inspectStory } = require('./doctor-vn-project');

const ROOT = path.resolve(__dirname, '..');
const GEP_DIR = path.join(ROOT, 'assets', 'gep');
const TEMPLATE_PROJECT = path.join(ROOT, 'interactive-fiction', 'templates', 'vn-project');

const REQUIRED_GENES = [
  {
    type: 'Gene',
    schema_version: '1.5.0',
    id: 'gene_if_vn_package_generalize',
    summary: 'Generalize visual novel content into an engine-neutral package with stable node taxonomy and import-friendly exchange format',
    category: 'innovate',
    signals_match: [
      'capability_gap:engine_neutral_package',
      'capability_gap:node_taxonomy',
      'import_signal:runtime_adapter_needs',
    ],
    preconditions: [
      'interactive-fiction project uses manifest plus nodes directory layout',
    ],
    strategy: [
      'Refine the node taxonomy around start scene ending and explicit logic nodes',
      'Keep prose presentation and logic separated in the compiled contract',
      'Preserve declarative conditions and effects instead of engine-specific scripting',
      'Validate the result as a single compiled exchange artifact',
    ],
    constraints: {
      max_files: 10,
      forbidden_paths: ['.git', 'node_modules', 'projects'],
    },
    validation: [
      'node thriller/scripts/validate-vn-json.js thriller/interactive-fiction/templates/vn-project/build/story.json',
    ],
  },
  {
    type: 'Gene',
    schema_version: '1.5.0',
    id: 'gene_if_compile_doctor_loop',
    summary: 'Strengthen the local authoring loop by compiling markdown-plus-yaml projects and running deterministic graph doctor checks',
    category: 'optimize',
    signals_match: [
      'capability_gap:authoring_compile_loop',
      'capability_gap:graph_doctor',
      'scale_signal:chapter_route_layout',
    ],
    preconditions: [
      'authoring layout uses one node file per runtime node',
    ],
    strategy: [
      'Compile project folders into one story.json artifact',
      'Track the source file for each compiled node',
      'Detect missing targets and unreachable runtime nodes',
      'Keep the workflow local and deterministic before any importer step',
    ],
    constraints: {
      max_files: 8,
      forbidden_paths: ['.git', 'node_modules'],
    },
    validation: [
      'node thriller/scripts/doctor-vn-project.js thriller/interactive-fiction/templates/vn-project',
    ],
  },
  {
    type: 'Gene',
    schema_version: '1.5.0',
    id: 'gene_if_scale_authoring_layout',
    summary: 'Scale the one-node-one-file visual novel layout with chapter route and tag metadata plus recursive node discovery',
    category: 'optimize',
    signals_match: [
      'scale_signal:chapter_route_layout',
      'capability_gap:large_project_authoring',
    ],
    preconditions: [
      'the package already has a stable compiled contract',
    ],
    strategy: [
      'Allow nested folders under nodes',
      'Add chapter route and tags to node metadata',
      'Keep source files small and semantically scoped',
      'Preserve the same compiled exchange contract regardless of folder depth',
    ],
    constraints: {
      max_files: 6,
      forbidden_paths: ['.git', 'node_modules'],
    },
    validation: [
      'node thriller/scripts/compile-vn-project.js thriller/interactive-fiction/templates/vn-project',
    ],
  },
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

function summarizeStats(story, report) {
  const entityCounts = {
    characters: (story.entities.characters || []).length,
    locations: (story.entities.locations || []).length,
    variables: (story.entities.variables || []).length,
    assets: (story.entities.assets || []).length,
  };

  return {
    nodeCount: (story.nodes || []).length,
    kindStats: report.stats,
    entityCounts,
    warningCount: report.warnings.length,
  };
}

function main() {
  fs.mkdirSync(GEP_DIR, { recursive: true });

  const genesPath = path.join(GEP_DIR, 'genes.json');
  const capsulesPath = path.join(GEP_DIR, 'capsules.json');
  const eventsPath = path.join(GEP_DIR, 'events.jsonl');

  const genes = ensureGenes(readJson(genesPath, []));
  const capsules = readJson(capsulesPath, []);

  const { story } = compileProject(TEMPLATE_PROJECT);
  const report = inspectStory(story);
  const stats = summarizeStats(story, report);
  const timestamp = new Date().toISOString();
  const token = timestamp.replace(/[-:.TZ]/g, '');

  const capsule = {
    type: 'Capsule',
    schema_version: '1.5.0',
    id: `capsule_if_vn_package_${token}`,
    trigger: [
      'capability_gap:engine_neutral_package',
      'capability_gap:authoring_compile_loop',
      'scale_signal:chapter_route_layout',
    ],
    gene: 'gene_if_vn_package_generalize',
    summary: 'Added a general visual novel package contract with local compile doctor validate workflow and scalable node-file authoring layout',
    content: `The system now defines a stable VN package, compiles markdown-plus-yaml projects into story.json, records node source files, and runs a deterministic doctor pass. Template stats: ${stats.nodeCount} nodes, ${stats.entityCounts.characters} characters, ${stats.entityCounts.locations} locations, ${stats.entityCounts.variables} variables.`,
    confidence: report.errors.length === 0 ? 0.9 : 0.6,
    blast_radius: {
      files: 9,
      lines: 350,
    },
    outcome: {
      status: report.errors.length === 0 ? 'success' : 'partial',
      score: report.errors.length === 0 ? 0.9 : 0.6,
    },
    env_fingerprint: {
      platform: process.platform,
      arch: process.arch,
      node_version: process.version,
      local_mode: 'evomap-ledger',
    },
    success_streak: report.errors.length === 0 ? 1 : 0,
  };

  const event = {
    type: 'EvolutionEvent',
    schema_version: '1.5.0',
    id: `evt_if_vn_package_${token}`,
    intent: 'innovate',
    signals: capsule.trigger,
    genes_used: [
      'gene_if_vn_package_generalize',
      'gene_if_compile_doctor_loop',
      'gene_if_scale_authoring_layout',
    ],
    capsule_id: capsule.id,
    outcome: capsule.outcome,
    mutations_tried: 1,
    total_cycles: 1,
    blast_radius: capsule.blast_radius,
    timestamp,
    note: 'General VN package with compiler doctor and scalable node layout recorded as local EvoMap assets.',
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
