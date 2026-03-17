#!/usr/bin/env node

const path = require('path');

const { compileProject, writeCompiledStory } = require('./compile-vn-project');
const { validateStory } = require('./validate-vn-json');

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
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

function inspectInteractiveThriller(story) {
  const warnings = [];
  const errors = validateStory(story);
  const playerNodes = collectReachablePlayerNodes(story);
  const openingNodes = playerNodes.slice(0, 2);
  const openingWindow = playerNodes.slice(0, 3);
  const { introduced, required } = collectClueSets(story);
  const inboundCounts = collectInboundCounts(story);

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

  for (const node of story.nodes || []) {
    const nodeThriller = isObject(node.thriller) ? node.thriller : {};

    if (node.kind === 'scene' && Array.isArray(node.choices)) {
      for (const choice of node.choices) {
        const choiceThriller = isObject(choice.thriller) ? choice.thriller : {};
        if (typeof choiceThriller.intent !== 'string' || choiceThriller.intent.length === 0) {
          warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} is missing thriller.intent.`);
        }
        if (!Array.isArray(choiceThriller.costs) || choiceThriller.costs.length === 0) {
          warnings.push(`Choice ${choice.id || '<missing>'} in node ${node.id} is missing thriller.costs.`);
        }
      }
    }

    if ((inboundCounts.get(node.id) || 0) > 1) {
      if (!Array.isArray(nodeThriller.routeMemory) || nodeThriller.routeMemory.length === 0) {
        warnings.push(`Node ${node.id} has multiple inbound paths but no thriller.routeMemory annotation.`);
      }
    }

    if (node.kind === 'ending') {
      if (typeof nodeThriller.endingContract !== 'string' || nodeThriller.endingContract.length === 0) {
        warnings.push(`Ending node ${node.id} is missing thriller.endingContract.`);
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
      introducedClues: introduced.size,
      requiredClues: required.size,
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
