#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const {
  DEFAULT_PLAN_DIR,
  loadInteractiveThrillerPlan,
} = require('./lib/interactive-thriller-plan');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_BASE_DIR = path.join(ROOT, 'meta', 'runs', 'interactive-thriller');

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

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function appendJsonl(filePath, value) {
  ensureDirectory(path.dirname(filePath));
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function now() {
  return new Date().toISOString();
}

function tokenFromNow() {
  return now().replace(/[-:.TZ]/g, '');
}

function resolveBaseDir(args) {
  return path.resolve(args['base-dir'] || DEFAULT_BASE_DIR);
}

function resolvePlanDir(args) {
  return path.resolve(args['plan-dir'] || DEFAULT_PLAN_DIR);
}

function activeRunPointer(baseDir) {
  return path.join(baseDir, 'active-run.txt');
}

function getActiveRun(baseDir) {
  const filePath = activeRunPointer(baseDir);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8').trim() || null;
}

function setActiveRun(baseDir, runId) {
  ensureDirectory(baseDir);
  fs.writeFileSync(activeRunPointer(baseDir), `${runId}\n`, 'utf8');
}

function resolveRunId(baseDir, args) {
  return args['run-id'] || getActiveRun(baseDir);
}

function runDir(baseDir, runId) {
  return path.join(baseDir, runId);
}

function statePath(baseDir, runId) {
  return path.join(runDir(baseDir, runId), 'state.json');
}

function snapshotPath(baseDir, runId) {
  return path.join(runDir(baseDir, runId), 'plan.snapshot.json');
}

function logPath(baseDir, runId) {
  return path.join(runDir(baseDir, runId), 'log.ndjson');
}

function loadState(baseDir, runId) {
  return readJson(statePath(baseDir, runId));
}

function saveState(baseDir, runId, state) {
  state.updatedAt = now();
  writeJson(statePath(baseDir, runId), state);
}

function createInitialState(runId, plan) {
  return {
    schemaVersion: '1.0.0',
    runId,
    planId: plan.id,
    planTitle: plan.title,
    createdAt: now(),
    updatedAt: now(),
    totalRounds: plan.rounds.length,
    completedCount: 0,
    activeRoundId: null,
    rounds: plan.rounds.map((round) => ({
      id: round.id,
      number: round.number,
      bandId: round.bandId,
      title: round.title,
      status: 'pending',
      scaffoldedAt: null,
      completedAt: null,
      outcome: null,
      note: ''
    }))
  };
}

function roundMarkdown(round) {
  const sections = [
    `# ${round.id.toUpperCase()} ${round.title}`,
    '',
    `Band: ${round.bandTitle}`,
    `Round: ${round.number}`,
    '',
    '## Objective',
    round.objective,
    '',
    '## Hypothesis',
    round.hypothesis,
    '',
    '## Focus Planes',
    ...(round.focusPlanes || []).map((item) => `- ${item}`),
    '',
    '## Story Questions',
    ...(round.storyQuestions || []).map((item) => `- ${item}`),
    '',
    '## Target Files',
    ...(round.targetFiles || []).map((item) => `- ${item}`),
    '',
    '## Mutation Moves',
    ...(round.mutationMoves || []).map((item) => `- ${item}`),
    '',
    '## Acceptance Checks',
    ...(round.acceptanceChecks || []).map((item) => `- ${item}`),
    '',
    '## Deliverables',
    ...(round.deliverables || []).map((item) => `- ${item}`),
    '',
    '## Verification Commands',
    ...(round.verificationCommands || []).map((item) => `- ${item}`),
    '',
    '## Execution Notes',
    '- Files touched:',
    '- What improved:',
    '- What resisted improvement:',
    '- Follow-up risk:',
    '',
    '## Outcome',
    '- Status: pending',
    '- Evidence:',
    ''
  ];

  return `${sections.join('\n')}\n`;
}

function pendingRounds(state) {
  return state.rounds.filter((round) => round.status === 'pending').sort((a, b) => a.number - b.number);
}

function completedRounds(state) {
  return state.rounds.filter((round) => round.status === 'completed').sort((a, b) => a.number - b.number);
}

function writeCheckpoint(baseDir, runId, state, checkpointCount = state.completedCount) {
  const completed = completedRounds(state)
    .filter((round) => round.number <= checkpointCount)
    .slice(-10);
  const count = checkpointCount;
  const checkpointFile = path.join(
    runDir(baseDir, runId),
    'checkpoints',
    `checkpoint-${String(count).padStart(3, '0')}.md`
  );
  ensureDirectory(path.dirname(checkpointFile));
  const lines = [
    `# Checkpoint ${String(count).padStart(3, '0')}`,
    '',
    `Run: ${runId}`,
    `Completed: ${state.completedCount}/${state.totalRounds}`,
    '',
    '## Recent Outcomes',
    ...completed.map((round) => `- ${round.id}: ${round.outcome || 'unknown'}${round.note ? ` - ${round.note}` : ''}`),
    '',
    '## Next Round',
    `- ${(pendingRounds(state)[0] || {}).id || 'none'}`,
    ''
  ];
  fs.writeFileSync(checkpointFile, `${lines.join('\n')}\n`, 'utf8');
}

function commandInit(args) {
  const baseDir = resolveBaseDir(args);
  const plan = loadInteractiveThrillerPlan(resolvePlanDir(args));
  const runId = args['run-id'] || `interactive-thriller-${tokenFromNow()}`;
  const targetDir = runDir(baseDir, runId);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Run already exists: ${targetDir}`);
  }

  ensureDirectory(path.join(targetDir, 'rounds'));
  ensureDirectory(path.join(targetDir, 'checkpoints'));
  writeJson(snapshotPath(baseDir, runId), plan);
  saveState(baseDir, runId, createInitialState(runId, plan));
  appendJsonl(logPath(baseDir, runId), {
    timestamp: now(),
    type: 'run_initialized',
    runId,
    totalRounds: plan.rounds.length
  });
  setActiveRun(baseDir, runId);
  console.log(`OK: initialized ${runId}`);
}

function commandScaffold(args) {
  const baseDir = resolveBaseDir(args);
  const runId = resolveRunId(baseDir, args);
  if (!runId) {
    throw new Error('No active run. Use init first or pass --run-id.');
  }

  const state = loadState(baseDir, runId);
  const snapshot = readJson(snapshotPath(baseDir, runId));
  const byId = new Map(snapshot.rounds.map((round) => [round.id, round]));
  const selected = args.all
    ? pendingRounds(state)
    : pendingRounds(state).slice(0, Number(args.count || 1));

  for (const roundState of selected) {
    const round = byId.get(roundState.id);
    const filePath = path.join(runDir(baseDir, runId), 'rounds', `${round.id}.md`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, roundMarkdown(round), 'utf8');
    }
    roundState.scaffoldedAt = roundState.scaffoldedAt || now();
  }

  if (!state.activeRoundId && selected[0]) {
    state.activeRoundId = selected[0].id;
  }

  saveState(baseDir, runId, state);
  appendJsonl(logPath(baseDir, runId), {
    timestamp: now(),
    type: 'rounds_scaffolded',
    runId,
    count: selected.length,
    roundIds: selected.map((round) => round.id)
  });
  console.log(`OK: scaffolded ${selected.length} round(s) for ${runId}`);
}

function commandComplete(args) {
  const baseDir = resolveBaseDir(args);
  const runId = resolveRunId(baseDir, args);
  const roundId = args._[1];
  if (!runId) {
    throw new Error('No active run. Use init first or pass --run-id.');
  }
  if (!roundId) {
    throw new Error('Usage: complete <round-id> [--outcome success|partial|failed] [--note text]');
  }

  const state = loadState(baseDir, runId);
  const round = state.rounds.find((item) => item.id === roundId);
  if (!round) {
    throw new Error(`Unknown round id: ${roundId}`);
  }

  round.status = 'completed';
  round.completedAt = now();
  round.outcome = args.outcome || 'success';
  round.note = args.note || '';
  state.completedCount = completedRounds(state).length;
  state.activeRoundId = (pendingRounds(state)[0] || {}).id || null;

  saveState(baseDir, runId, state);
  appendJsonl(logPath(baseDir, runId), {
    timestamp: now(),
    type: 'round_completed',
    runId,
    roundId,
    outcome: round.outcome,
    note: round.note
  });

  if (state.completedCount > 0 && (state.completedCount % 10 === 0 || state.completedCount === state.totalRounds)) {
    writeCheckpoint(baseDir, runId, state);
  }

  console.log(`OK: completed ${roundId} (${round.outcome})`);
}

function commandStatus(args) {
  const baseDir = resolveBaseDir(args);
  const runId = resolveRunId(baseDir, args);
  if (!runId) {
    throw new Error('No active run. Use init first or pass --run-id.');
  }

  const state = loadState(baseDir, runId);
  console.log(`Run: ${runId}`);
  console.log(`Completed: ${state.completedCount}/${state.totalRounds}`);
  console.log(`Scaffolded: ${state.rounds.filter((round) => round.scaffoldedAt).length}/${state.totalRounds}`);
  console.log(`Active: ${state.activeRoundId || 'none'}`);
  console.log(`Next: ${(pendingRounds(state)[0] || {}).id || 'none'}`);
}

function commandSeedPending(args) {
  const baseDir = resolveBaseDir(args);
  const runId = resolveRunId(baseDir, args);
  if (!runId) {
    throw new Error('No active run. Use init first or pass --run-id.');
  }

  const state = loadState(baseDir, runId);
  const pending = pendingRounds(state);
  const outcome = args.outcome || 'seeded';
  const note =
    args.note ||
    'Materialized as a committed dossier round under interactive-fiction/playbooks/interactive-thriller.';

  for (const round of pending) {
    round.status = 'completed';
    round.completedAt = now();
    round.outcome = outcome;
    round.note = note;
  }

  state.completedCount = completedRounds(state).length;
  state.activeRoundId = null;
  saveState(baseDir, runId, state);
  appendJsonl(logPath(baseDir, runId), {
    timestamp: now(),
    type: 'pending_rounds_seeded',
    runId,
    count: pending.length,
    outcome,
    note,
  });

  for (let count = 10; count <= state.completedCount; count += 10) {
    writeCheckpoint(baseDir, runId, state, count);
  }

  console.log(`OK: seeded ${pending.length} pending round(s) for ${runId}`);
}

function printUsage() {
  console.log('Usage:');
  console.log('  node thriller/scripts/run-interactive-thriller-evolution-loop.js init [--run-id id] [--plan-dir dir] [--base-dir dir]');
  console.log('  node thriller/scripts/run-interactive-thriller-evolution-loop.js scaffold [--count N|--all] [--run-id id] [--base-dir dir]');
  console.log('  node thriller/scripts/run-interactive-thriller-evolution-loop.js complete <round-id> [--outcome success|partial|failed] [--note text] [--run-id id] [--base-dir dir]');
  console.log('  node thriller/scripts/run-interactive-thriller-evolution-loop.js seed-pending [--outcome seeded] [--note text] [--run-id id] [--base-dir dir]');
  console.log('  node thriller/scripts/run-interactive-thriller-evolution-loop.js status [--run-id id] [--base-dir dir]');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command || command === 'help' || command === '--help') {
    printUsage();
    return;
  }

  switch (command) {
    case 'init':
      commandInit(args);
      break;
    case 'scaffold':
      commandScaffold(args);
      break;
    case 'complete':
      commandComplete(args);
      break;
    case 'status':
      commandStatus(args);
      break;
    case 'seed-pending':
      commandSeedPending(args);
      break;
    default:
      printUsage();
      process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createInitialState,
};
