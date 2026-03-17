#!/usr/bin/env node

const path = require('path');

const { compileProject, writeCompiledStory } = require('./compile-vn-project');
const { validateStory } = require('./validate-vn-json');

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function asStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.length > 0) : [];
}

function collectTargets(node) {
  if (!node || node.kind === 'annotation') {
    return [];
  }

  if (node.kind === 'start' || node.kind === 'instruction' || node.kind === 'hub') {
    return node.to ? [node.to] : [];
  }

  if (node.kind === 'jump') {
    return node.target ? [node.target] : [];
  }

  if (node.kind === 'condition') {
    return [node.onTrue, node.onFalse].filter(Boolean);
  }

  if (Array.isArray(node.choices)) {
    return node.choices.map((choice) => choice.to).filter(Boolean);
  }

  return [];
}

function collectReachablePlayerNodes(story) {
  const nodeMap = new Map((story.nodes || []).map((node) => [node.id, node]));
  const visited = new Set();
  const queue = [story.meta.entry];
  const ordered = [];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId || visited.has(currentId)) {
      continue;
    }

    const node = nodeMap.get(currentId);
    if (!node) {
      continue;
    }

    visited.add(currentId);
    if (node.kind === 'scene' || node.kind === 'ending') {
      ordered.push(node);
    }

    for (const targetId of collectTargets(node)) {
      if (!visited.has(targetId)) {
        queue.push(targetId);
      }
    }
  }

  return ordered;
}

function collectClueSets(story) {
  const introduced = new Set();
  const required = new Set();

  for (const node of story.nodes || []) {
    const nodeThriller = isObject(node.thriller) ? node.thriller : {};
    for (const clueId of nodeThriller.introducesClues || []) {
      introduced.add(clueId);
    }
    for (const clueId of nodeThriller.requiresClues || []) {
      required.add(clueId);
    }
    if (Array.isArray(node.choices)) {
      for (const choice of node.choices) {
        const choiceThriller = isObject(choice.thriller) ? choice.thriller : {};
        for (const clueId of choiceThriller.reveals || []) {
          introduced.add(clueId);
        }
      }
    }
  }

  return {
    introduced,
    required,
  };
}

function collectInboundCounts(story) {
  const counts = new Map((story.nodes || []).map((node) => [node.id, 0]));
  for (const node of story.nodes || []) {
    for (const targetId of collectTargets(node)) {
      counts.set(targetId, (counts.get(targetId) || 0) + 1);
    }
  }
  return counts;
}

function collectClueDefinitions(story) {
  return new Map((story.entities?.clues || []).map((clue) => [clue.id, clue]));
}

function collectClueReferences(story) {
  const references = [];

  for (const node of story.nodes || []) {
    const thriller = isObject(node.thriller) ? node.thriller : {};
    for (const clueId of asStringArray(thriller.introducesClues)) {
      references.push({ clueId, nodeId: node.id, source: 'node.introducesClues' });
    }
    for (const clueId of asStringArray(thriller.requiresClues)) {
      references.push({ clueId, nodeId: node.id, source: 'node.requiresClues' });
    }
    for (const payoffId of asStringArray(thriller.payoffs)) {
      references.push({ payoffId, nodeId: node.id, source: 'node.payoffs' });
    }
    for (const choice of node.choices || []) {
      const choiceThriller = isObject(choice.thriller) ? choice.thriller : {};
      for (const clueId of asStringArray(choiceThriller.reveals)) {
        references.push({
          clueId,
          nodeId: node.id,
          choiceId: choice.id,
          source: 'choice.reveals',
        });
      }
    }
  }

  return references;
}

function collectTransitions(node) {
  if (!node || node.kind === 'annotation') {
    return [];
  }

  if (Array.isArray(node.choices)) {
    return node.choices
      .filter((choice) => choice && choice.to)
      .map((choice) => ({
        to: choice.to,
        addedClues: asStringArray(isObject(choice.thriller) ? choice.thriller.reveals : []),
        choiceId: choice.id || null,
      }));
  }

  if (node.kind === 'start' || node.kind === 'instruction' || node.kind === 'hub') {
    return node.to ? [{ to: node.to, addedClues: [], choiceId: null }] : [];
  }

  if (node.kind === 'jump') {
    return node.target ? [{ to: node.target, addedClues: [], choiceId: null }] : [];
  }

  if (node.kind === 'condition') {
    return [node.onTrue, node.onFalse]
      .filter(Boolean)
      .map((targetId) => ({ to: targetId, addedClues: [], choiceId: null }));
  }

  return [];
}

function serializeClues(clues) {
  return [...new Set(clues)].sort().join('|');
}

function reachableDistances(story) {
  const nodeMap = new Map((story.nodes || []).map((node) => [node.id, node]));
  const distances = new Map();
  const queue = [{ id: story.meta.entry, distance: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (distances.has(current.id)) {
      continue;
    }
    distances.set(current.id, current.distance);
    const node = nodeMap.get(current.id);
    if (!node) {
      continue;
    }
    for (const targetId of collectTargets(node)) {
      if (!distances.has(targetId)) {
        queue.push({ id: targetId, distance: current.distance + 1 });
      }
    }
  }

  return distances;
}

function collectVariableUsage(story) {
  const variableDefinitions = story.entities?.variables || [];
  const variableReads = new Map(variableDefinitions.map((variable) => [variable.id, new Set()]));
  const variableWrites = new Map(variableDefinitions.map((variable) => [variable.id, new Set()]));

  for (const node of story.nodes || []) {
    const thriller = isObject(node.thriller) ? node.thriller : {};
    for (const variableId of asStringArray(thriller.routeMemory)) {
      if (!variableReads.has(variableId)) {
        variableReads.set(variableId, new Set());
      }
      variableReads.get(variableId).add(node.id);
    }

    for (const effect of Array.isArray(node.effects) ? node.effects : []) {
      if (effect && typeof effect.target === 'string' && effect.target.length > 0) {
        if (!variableWrites.has(effect.target)) {
          variableWrites.set(effect.target, new Set());
        }
        variableWrites.get(effect.target).add(node.id);
      }
    }

    for (const choice of node.choices || []) {
      for (const effect of Array.isArray(choice.effects) ? choice.effects : []) {
        if (effect && typeof effect.target === 'string' && effect.target.length > 0) {
          if (!variableWrites.has(effect.target)) {
            variableWrites.set(effect.target, new Set());
          }
          variableWrites.get(effect.target).add(`${node.id}:${choice.id || '<choice>'}`);
        }
      }
    }
  }

  return { variableReads, variableWrites };
}

function mergeCallbackCoverage(node) {
  const thriller = isObject(node.thriller) ? node.thriller : {};
  const routeMemory = asStringArray(thriller.routeMemory);
  const callbacks = Array.isArray(thriller.mergeCallbacks) ? thriller.mergeCallbacks : [];
  const covered = new Set();

  for (const callback of callbacks) {
    if (!isObject(callback)) {
      continue;
    }
    const whenVariables = asStringArray(callback.when);
    for (const variableId of whenVariables) {
      covered.add(variableId);
    }
  }

  return {
    callbacks,
    routeMemory,
    covered,
  };
}

function buildReachableClueStates(story) {
  const nodeMap = new Map((story.nodes || []).map((node) => [node.id, node]));
  const byNode = new Map();
  const visited = new Set();
  const queue = [{ nodeId: story.meta.entry, clues: [] }];
  const maxStates = 4096;

  while (queue.length > 0) {
    const current = queue.shift();
    const visitKey = `${current.nodeId}::${serializeClues(current.clues)}`;
    if (visited.has(visitKey)) {
      continue;
    }
    visited.add(visitKey);

    if (visited.size > maxStates) {
      throw new Error(`Interactive thriller doctor exceeded ${maxStates} clue states. Simplify loops or add route checkpoints.`);
    }

    const node = nodeMap.get(current.nodeId);
    if (!node) {
      continue;
    }

    const nodeThriller = isObject(node.thriller) ? node.thriller : {};
    const nextClues = [...new Set([...current.clues, ...asStringArray(nodeThriller.introducesClues)])];
    const existingStates = byNode.get(node.id) || [];
    const nextKey = serializeClues(nextClues);
    if (!existingStates.some((state) => serializeClues(state) === nextKey)) {
      existingStates.push(nextClues);
      byNode.set(node.id, existingStates);
    }

    for (const transition of collectTransitions(node)) {
      queue.push({
        nodeId: transition.to,
        clues: [...new Set([...nextClues, ...transition.addedClues])],
      });
    }
  }

  return byNode;
}

function inspectInteractiveThriller(story) {
  const warnings = [];
  const errors = validateStory(story);
  const playerNodes = collectReachablePlayerNodes(story);
  const openingNodes = playerNodes.slice(0, 2);
  const openingWindow = playerNodes.slice(0, 3);
  const { introduced, required } = collectClueSets(story);
  const inboundCounts = collectInboundCounts(story);
  const clueDefinitions = collectClueDefinitions(story);
  const reachableClueStates = buildReachableClueStates(story);
  const clueReferences = collectClueReferences(story);
  const nodeIds = new Set((story.nodes || []).map((node) => node.id));
  const distances = reachableDistances(story);
  const { variableReads, variableWrites } = collectVariableUsage(story);
  const majorSuspects = (story.entities?.characters || []).filter((character) => {
    const profile = isObject(character.thrillerProfile) ? character.thrillerProfile : {};
    return profile.suspectWeight === 'major';
  });
  const reachableSuspicionTargets = new Set();
  const reachableTheorySuspects = new Set();

  if (openingNodes.length > 0) {
    const openingHasContract = openingNodes.some((node) => {
      const thriller = isObject(node.thriller) ? node.thriller : {};
      return typeof thriller.promise === 'string' || typeof thriller.mysteryQuestion === 'string';
    });
    if (!openingHasContract) {
      warnings.push('The first two player-facing nodes do not declare a thriller promise or mystery question.');
    }
  }

  const openingScene = openingWindow.find((node) => node.kind === 'scene');
  if (openingScene && Array.isArray(openingScene.choices) && openingScene.choices.length > 1) {
    const intents = new Set(
      openingScene.choices
        .map((choice) => (isObject(choice.thriller) ? choice.thriller.intent : null))
        .filter(Boolean)
    );
    if (intents.size < 2) {
      warnings.push(`Opening scene ${openingScene.id} does not expose at least two distinct thriller intents.`);
    }
  }

  const openingHasPressureSpike = openingWindow.some((node) => {
    const thriller = isObject(node.thriller) ? node.thriller : {};
    return thriller.pressure === 'high' || thriller.pressure === 'spike';
  });
  if (!openingHasPressureSpike && openingWindow.length > 0) {
    warnings.push('The first three player-facing nodes do not contain a high-pressure or spike-pressure beat.');
  }

  if (clueDefinitions.size === 0) {
    warnings.push('No systems/clues.yaml registry was compiled. Add a clue ledger for route fairness audits.');
  }

  for (const node of playerNodes) {
    const thriller = isObject(node.thriller) ? node.thriller : {};
    for (const suspectId of asStringArray(thriller.suspicionTargets)) {
      reachableSuspicionTargets.add(suspectId);
    }
    for (const theorySeed of Array.isArray(thriller.theorySeeds) ? thriller.theorySeeds : []) {
      if (isObject(theorySeed) && typeof theorySeed.suspect === 'string' && theorySeed.suspect.length > 0) {
        reachableTheorySuspects.add(theorySeed.suspect);
      }
    }
  }

  if (majorSuspects.length < 3) {
    warnings.push('The cast defines fewer than three major suspects. Suspicion ecology will stay thin.');
  }

  if (majorSuspects.length > 0) {
    const pressureStyles = new Set(
      majorSuspects
        .map((character) => (isObject(character.thrillerProfile) ? character.thrillerProfile.pressureStyle : null))
        .filter(Boolean)
    );
    if (pressureStyles.size < majorSuspects.length) {
      warnings.push('Major suspects do not yet have distinct thrillerProfile.pressureStyle values.');
    }

    const missingCoverage = majorSuspects
      .map((character) => character.id)
      .filter((suspectId) => !reachableSuspicionTargets.has(suspectId) && !reachableTheorySuspects.has(suspectId));
    if (missingCoverage.length > 0) {
      warnings.push(`Major suspects missing from reachable suspicion metadata: ${missingCoverage.join(', ')}.`);
    }
  }

  if (reachableTheorySuspects.size > 0 && reachableTheorySuspects.size < 3) {
    warnings.push('Fewer than three suspect theories are legible in reachable thriller.theorySeeds metadata.');
  }

  if (reachableSuspicionTargets.size > 0 && reachableSuspicionTargets.size < 3) {
    warnings.push('Reachable thriller.suspicionTargets do not yet keep at least three suspects in play.');
  }

  for (const variable of story.entities?.variables || []) {
    const reads = variableReads.get(variable.id) || new Set();
    const writes = variableWrites.get(variable.id) || new Set();
    const payoffs = asStringArray(variable.payoffs);
    const designRole = typeof variable.designRole === 'string' ? variable.designRole : 'local';

    for (const payoffNodeId of payoffs) {
      if (!nodeIds.has(payoffNodeId)) {
        errors.push(`Variable ${variable.id} references missing payoff node ${payoffNodeId}.`);
      }
    }

    if (designRole === 'critical') {
      if (writes.size === 0) {
        warnings.push(`Critical variable ${variable.id} is defined but never written by any node or choice effect.`);
      }
      if (reads.size < 2) {
        warnings.push(`Critical variable ${variable.id} is read in fewer than two places.`);
      }
      if (payoffs.length < 2) {
        warnings.push(`Critical variable ${variable.id} declares fewer than two payoff nodes.`);
      }
    }

    if (
      designRole === 'local' &&
      writes.size > 0 &&
      reads.size === 0 &&
      payoffs.length === 0 &&
      !(typeof variable.rationale === 'string' && variable.rationale.length > 0)
    ) {
      warnings.push(`Local variable ${variable.id} is written but has no declared payoff or later read.`);
    }
  }

  for (const reference of clueReferences) {
    if (reference.clueId && !clueDefinitions.has(reference.clueId)) {
      errors.push(`Clue ${reference.clueId} referenced in ${reference.source} on ${reference.nodeId} is not defined in systems/clues.yaml.`);
    }
    if (reference.payoffId && !nodeIds.has(reference.payoffId)) {
      errors.push(`Payoff target ${reference.payoffId} referenced on ${reference.nodeId} does not exist.`);
    }
  }

  for (const [clueId, clue] of clueDefinitions.entries()) {
    for (const targetId of asStringArray(clue.supports)) {
      if (!nodeIds.has(targetId)) {
        errors.push(`Clue ${clueId} supports missing target ${targetId}.`);
      }
    }
    if (clue.critical && !introduced.has(clueId)) {
      errors.push(`Critical clue ${clueId} is defined but never introduced on any route.`);
    }
  }

  for (const node of story.nodes || []) {
    const nodeThriller = isObject(node.thriller) ? node.thriller : {};
    const nodeClueStates = reachableClueStates.get(node.id) || [];
    const requiredClues = asStringArray(nodeThriller.requiresClues);

    if (node.kind === 'scene' && Array.isArray(node.choices)) {
      const choiceOutcomeTargets = new Set();
      for (const choice of node.choices) {
        const choiceThriller = isObject(choice.thriller) ? choice.thriller : {};
        if (typeof choiceThriller.intent !== 'string' || choiceThriller.intent.length === 0) {
          warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} is missing thriller.intent.`);
        }
        if (!Array.isArray(choiceThriller.costs) || choiceThriller.costs.length === 0) {
          warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} is missing thriller.costs.`);
        }
        if (typeof choiceThriller.immediateOutcome !== 'string' || choiceThriller.immediateOutcome.length === 0) {
          warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} is missing thriller.immediateOutcome.`);
        }
        if (typeof choiceThriller.delayedRisk !== 'string' || choiceThriller.delayedRisk.length === 0) {
          warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} is missing thriller.delayedRisk.`);
        }
        const visibleWithin = asStringArray(choiceThriller.visibleWithinNodes);
        if (visibleWithin.length === 0) {
          warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} is missing thriller.visibleWithinNodes.`);
        }
        const sourceDistance = distances.get(node.id);
        for (const targetId of visibleWithin) {
          if (!nodeIds.has(targetId)) {
            errors.push(`Choice ${choice.id || '<missing>'} in node ${node.id} references missing visible consequence node ${targetId}.`);
            continue;
          }
          const targetDistance = distances.get(targetId);
          if (sourceDistance != null && targetDistance != null && targetDistance - sourceDistance > 3) {
            warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} pushes visible consequence ${targetId} beyond three reachable nodes.`);
          }
          choiceOutcomeTargets.add(targetId);
        }
      }
      if (node.choices.length > 1 && choiceOutcomeTargets.size < node.choices.length) {
        warnings.push(`Choice set in node ${node.id} does not expose distinct visible consequence targets for each option.`);
      }
    }

    if ((inboundCounts.get(node.id) || 0) > 1) {
      if (!Array.isArray(nodeThriller.routeMemory) || nodeThriller.routeMemory.length === 0) {
        warnings.push(`Node ${node.id} has multiple inbound paths but no thriller.routeMemory annotation.`);
      }
      const mergeState = mergeCallbackCoverage(node);
      if (mergeState.routeMemory.length > 0) {
        if (mergeState.callbacks.length === 0) {
          warnings.push(`Merged node ${node.id} has routeMemory but no thriller.mergeCallbacks.`);
        }
        const uncovered = mergeState.routeMemory.filter((variableId) => !mergeState.covered.has(variableId));
        if (uncovered.length > 0) {
          warnings.push(`Merged node ${node.id} does not cover all routeMemory variables in thriller.mergeCallbacks: ${uncovered.join(', ')}.`);
        }
        for (const callback of mergeState.callbacks) {
          if (!isObject(callback) || typeof callback.callback !== 'string' || callback.callback.length === 0) {
            warnings.push(`Merged node ${node.id} has a thriller.mergeCallbacks entry without callback text.`);
          }
        }
      }
    }

    if (node.kind === 'ending') {
      if (typeof nodeThriller.endingContract !== 'string' || nodeThriller.endingContract.length === 0) {
        warnings.push(`Ending node ${node.id} is missing thriller.endingContract.`);
      }
    }

    if (requiredClues.length > 0 && nodeClueStates.length > 0) {
      const unfairStates = nodeClueStates
        .map((state) => {
          const missing = requiredClues.filter((clueId) => !state.includes(clueId));
          return missing.length > 0 ? missing : null;
        })
        .filter(Boolean);

      if (unfairStates.length > 0) {
        const message = `Node ${node.id} can be reached without required clues: ${[...new Set(unfairStates.flat())].join(', ')}.`;
        if (node.kind === 'ending') {
          errors.push(message);
        } else {
          warnings.push(message);
        }
      }
    }
  }

  for (const clueId of required) {
    if (!introduced.has(clueId)) {
      errors.push(`Required clue ${clueId} is never introduced by any node or choice.`);
    }
  }

  if (introduced.size === 0) {
    warnings.push('No thriller clue annotations were found. Introduce clues explicitly for logic audits.');
  }

  return {
    errors,
    warnings,
    stats: {
      reachablePlayerNodes: playerNodes.length,
      definedClues: clueDefinitions.size,
      criticalClues: [...clueDefinitions.values()].filter((clue) => clue.critical).length,
      introducedClues: introduced.size,
      requiredClues: required.size,
      majorSuspects: majorSuspects.length,
      reachableSuspicionTargets: reachableSuspicionTargets.size,
      legibleTheorySuspects: reachableTheorySuspects.size,
      criticalVariables: (story.entities?.variables || []).filter((variable) => variable.designRole === 'critical').length,
      writtenVariables: [...variableWrites.values()].filter((writes) => writes.size > 0).length,
      mergedNodesWithCallbacks: story.nodes.filter((node) => {
        const inbound = inboundCounts.get(node.id) || 0;
        const thriller = isObject(node.thriller) ? node.thriller : {};
        return inbound > 1 && Array.isArray(thriller.mergeCallbacks) && thriller.mergeCallbacks.length > 0;
      }).length,
      fairRequiredNodes: story.nodes.filter((node) => {
        const requiredClues = asStringArray(isObject(node.thriller) ? node.thriller.requiresClues : []);
        if (requiredClues.length === 0) {
          return false;
        }
        const states = reachableClueStates.get(node.id) || [];
        return states.length > 0 && states.every((state) => requiredClues.every((clueId) => state.includes(clueId)));
      }).length,
      mergedNodesWithRouteMemory: story.nodes.filter((node) => {
        const inbound = inboundCounts.get(node.id) || 0;
        const thriller = isObject(node.thriller) ? node.thriller : {};
        return inbound > 1 && Array.isArray(thriller.routeMemory) && thriller.routeMemory.length > 0;
      }).length,
    },
  };
}

function main() {
  const projectDir = process.argv[2];
  const strict = process.argv.includes('--strict');
  if (!projectDir) {
    console.error('Usage: node thriller/scripts/doctor-interactive-thriller.js <project-directory> [--strict]');
    process.exit(1);
  }

  const { compiledStoryPath, story } = compileProject(projectDir);
  writeCompiledStory(compiledStoryPath, story);
  const report = inspectInteractiveThriller(story);

  console.log(`OK: compiled ${path.relative(process.cwd(), compiledStoryPath).replace(/\\\\/g, '/')}`);
  console.log(`Stats: ${JSON.stringify(report.stats)}`);

  for (const warning of report.warnings) {
    console.warn(`WARNING: ${warning}`);
  }

  if (report.errors.length > 0) {
    for (const error of report.errors) {
      console.error(`ERROR: ${error}`);
    }
    process.exit(1);
  }

  if (strict && report.warnings.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  inspectInteractiveThriller,
};
