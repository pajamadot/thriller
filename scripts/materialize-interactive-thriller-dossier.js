#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { loadInteractiveThrillerPlan } = require('./lib/interactive-thriller-plan');
const { compileProject } = require('./compile-vn-project');
const { inspectStory } = require('./doctor-vn-project');
const { inspectInteractiveThriller } = require('./doctor-interactive-thriller');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_PROJECT_DIR = path.join(ROOT, 'interactive-fiction', 'templates', 'vn-project');
const DEFAULT_OUTPUT_DIR = path.join(ROOT, 'interactive-fiction', 'playbooks', 'interactive-thriller');

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function writeText(filePath, text) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf8');
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[index + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        index += 1;
      }
    } else {
      args._.push(token);
    }
  }
  return args;
}

function markdownList(items) {
  if (!items || items.length === 0) {
    return ['- none'];
  }
  return items.map((item) => `- ${item}`);
}

function buildBandIndex(plan) {
  const index = new Map();
  for (const round of plan.rounds) {
    if (!index.has(round.bandId)) {
      index.set(round.bandId, []);
    }
    index.get(round.bandId).push(round);
  }
  return index;
}

function readBaseline(projectDir) {
  const { story } = compileProject(projectDir);
  const general = inspectStory(story);
  const thriller = inspectInteractiveThriller(story);

  return {
    story,
    general,
    thriller,
  };
}

function bandMarkdown(band, rounds, baseline) {
  const lines = [
    `# ${band.title}`,
    '',
    `Rounds: ${band.roundStart}-${band.roundEnd}`,
    '',
    '## Objective',
    band.objective,
    '',
    '## Focus Planes',
    ...markdownList(band.focusPlanes),
    '',
    '## Story Questions',
    ...markdownList(band.storyQuestions),
    '',
    '## Default Target Files',
    ...markdownList(band.defaultTargetFiles),
    '',
    '## Acceptance Checks',
    ...markdownList(band.baseAcceptanceChecks),
    '',
    '## Baseline Snapshot',
    `- Reachable player nodes: ${baseline.thriller.stats.reachablePlayerNodes}`,
    `- Introduced clues: ${baseline.thriller.stats.introducedClues}`,
    `- Required clues: ${baseline.thriller.stats.requiredClues}`,
    `- Current general warnings: ${baseline.general.warnings.length}`,
    `- Current thriller warnings: ${baseline.thriller.warnings.length}`,
    '',
    '## Rounds',
    ...rounds.map((round) => `- ${round.id}: ${round.title}`),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function roundMarkdown(round, baseline) {
  const lines = [
    `# ${round.id.toUpperCase()} ${round.title}`,
    '',
    `Band: ${round.bandTitle}`,
    `Round Number: ${round.number}`,
    '',
    '## Hypothesis',
    round.hypothesis,
    '',
    '## Focus Planes',
    ...markdownList(round.focusPlanes),
    '',
    '## Story Questions',
    ...markdownList(round.storyQuestions),
    '',
    '## Target Files',
    ...markdownList(round.targetFiles),
    '',
    '## Mutation Moves',
    ...markdownList(round.mutationMoves),
    '',
    '## Acceptance Checks',
    ...markdownList(round.acceptanceChecks),
    '',
    '## Deliverables',
    ...markdownList(round.deliverables),
    '',
    '## Verification Commands',
    ...markdownList(round.verificationCommands),
    '',
    '## Baseline Snapshot',
    `- Reachable player nodes: ${baseline.thriller.stats.reachablePlayerNodes}`,
    `- Introduced clues: ${baseline.thriller.stats.introducedClues}`,
    `- Required clues: ${baseline.thriller.stats.requiredClues}`,
    `- General warnings: ${baseline.general.warnings.length}`,
    `- Thriller warnings: ${baseline.thriller.warnings.length}`,
    '',
    '## Current Warning Surface',
    ...markdownList([
      ...baseline.general.warnings,
      ...baseline.thriller.warnings,
    ]),
    '',
    '## Execution Log',
    '- Files touched:',
    '- Mutation actually made:',
    '- What improved:',
    '- What broke or resisted improvement:',
    '- Follow-up round to queue if needed:',
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function readmeMarkdown(plan, projectDir, baseline) {
  const lines = [
    '# Interactive Thriller Dossier',
    '',
    `Source project: ${path.relative(ROOT, projectDir).replace(/\\\\/g, '/')}`,
    `Total rounds: ${plan.totalRounds}`,
    `Bands: ${plan.bands.length}`,
    '',
    '## Baseline',
    `- Reachable player nodes: ${baseline.thriller.stats.reachablePlayerNodes}`,
    `- Introduced clues: ${baseline.thriller.stats.introducedClues}`,
    `- Required clues: ${baseline.thriller.stats.requiredClues}`,
    `- General warnings: ${baseline.general.warnings.length}`,
    `- Thriller warnings: ${baseline.thriller.warnings.length}`,
    '',
    '## Layout',
    '- `bands/`: one file per 10-round band',
    '- `rounds/`: one file per round',
    '',
    '## Use',
    '- Open the relevant band first.',
    '- Execute one round at a time against the source project files.',
    '- Re-run compile and doctor checks after each mutation batch.',
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function materialize(plan, projectDir, outputDir) {
  const baseline = readBaseline(projectDir);
  const bandIndex = buildBandIndex(plan);

  writeText(path.join(outputDir, 'README.md'), readmeMarkdown(plan, projectDir, baseline));

  for (const band of plan.bands) {
    const rounds = bandIndex.get(band.bandId) || [];
    const bandFile = path.join(outputDir, 'bands', `${String(band.roundStart).padStart(2, '0')}-${band.bandId}.md`);
    writeText(bandFile, bandMarkdown(band, rounds, baseline));
  }

  for (const round of plan.rounds) {
    writeText(path.join(outputDir, 'rounds', `${round.id}.md`), roundMarkdown(round, baseline));
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectDir = path.resolve(args['project-dir'] || DEFAULT_PROJECT_DIR);
  const outputDir = path.resolve(args['output-dir'] || DEFAULT_OUTPUT_DIR);
  const plan = loadInteractiveThrillerPlan();

  materialize(plan, projectDir, outputDir);
  console.log(`OK: materialized dossier in ${outputDir}`);
}

if (require.main === module) {
  main();
}

