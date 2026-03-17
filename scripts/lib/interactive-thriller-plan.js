const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_PLAN_DIR = path.join(ROOT, 'interactive-fiction', 'specs', 'interactive-thriller-plan');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function unique(items) {
  return Array.from(new Set((items || []).filter(Boolean)));
}

function loadInteractiveThrillerPlan(planDir = DEFAULT_PLAN_DIR) {
  const absolutePlanDir = path.resolve(planDir);
  const manifestPath = path.join(absolutePlanDir, 'manifest.json');
  const manifest = readJson(manifestPath);
  const slots = readJson(path.join(absolutePlanDir, manifest.slotsFile || 'slots.json'))
    .slice()
    .sort((left, right) => left.slot - right.slot);
  const bandsDir = path.join(absolutePlanDir, manifest.bandsDir || 'bands');
  const bands = fs
    .readdirSync(bandsDir)
    .filter((fileName) => fileName.toLowerCase().endsWith('.json'))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => readJson(path.join(bandsDir, fileName)))
    .sort((left, right) => left.roundStart - right.roundStart);

  if (bands.length === 0) {
    throw new Error(`No band files found in ${bandsDir}`);
  }

  const rounds = [];
  for (const band of bands) {
    const expectedCount = band.roundEnd - band.roundStart + 1;
    if (expectedCount !== slots.length) {
      throw new Error(
        `Band ${band.bandId} spans ${expectedCount} rounds but slots file defines ${slots.length} slots`
      );
    }

    for (const slot of slots) {
      const number = band.roundStart + slot.slot - 1;
      rounds.push({
        id: `r${String(number).padStart(3, '0')}`,
        number,
        bandId: band.bandId,
        bandTitle: band.title,
        title: `${band.title}: ${slot.label}`,
        objective: band.objective,
        hypothesis: `${slot.hypothesisStem} Focus area: ${band.objective}`,
        focusPlanes: band.focusPlanes || [],
        storyQuestions: band.storyQuestions || [],
        targetFiles: unique([...(band.defaultTargetFiles || []), ...(slot.targetFiles || [])]),
        mutationMoves: unique([...(slot.mutationMoves || [])]),
        acceptanceChecks: unique([
          ...(band.baseAcceptanceChecks || []),
          ...(slot.acceptanceAdditions || []),
        ]),
        deliverables: unique([...(slot.deliverables || [])]),
        verificationCommands: unique([...(manifest.defaultVerificationCommands || [])]),
      });
    }
  }

  if (rounds.length !== manifest.totalRounds) {
    throw new Error(
      `Expanded plan has ${rounds.length} rounds but manifest expects ${manifest.totalRounds}`
    );
  }

  return {
    ...manifest,
    planDir: absolutePlanDir,
    slots,
    bands,
    rounds,
  };
}

module.exports = {
  DEFAULT_PLAN_DIR,
  loadInteractiveThrillerPlan,
};
