#!/usr/bin/env node

const path = require('path');

const { compileProject, writeCompiledStory } = require('./compile-vn-project');
const { validateStory } = require('./validate-vn-json');

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

function collectReachableNodeIds(story) {
  const nodeMap = new Map((story.nodes || []).map((node) => [node.id, node]));
  const visited = new Set();
  const queue = [story.meta.entry];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId || visited.has(currentId)) {
      continue;
    }

    const currentNode = nodeMap.get(currentId);
    if (!currentNode) {
      continue;
    }

    visited.add(currentId);
    for (const targetId of collectTargets(currentNode)) {
      if (!visited.has(targetId)) {
        queue.push(targetId);
      }
    }
  }

  return visited;
}

function inspectStory(story) {
  const warnings = [];
  const errors = validateStory(story);
  const reachableNodeIds = collectReachableNodeIds(story);

  const runtimeNodes = story.nodes.filter((node) => node.kind !== 'annotation');
  const orphanNodes = runtimeNodes
    .map((node) => node.id)
    .filter((nodeId) => !reachableNodeIds.has(nodeId));

  if (orphanNodes.length > 0) {
    warnings.push(`Unreachable runtime nodes: ${orphanNodes.join(', ')}`);
  }

  for (const node of runtimeNodes) {
    if (node.kind === 'scene' && (!Array.isArray(node.choices) || node.choices.length === 0)) {
      warnings.push(`Scene node ${node.id} has no choices and no explicit continuation`);
    }

    if (node.kind === 'hub' && !node.to) {
      warnings.push(`Hub node ${node.id} has no default "to" target`);
    }

    if (node.kind === 'instruction' && !Array.isArray(node.effects)) {
      warnings.push(`Instruction node ${node.id} has no effects array`);
    }
  }

  const stats = story.nodes.reduce((accumulator, node) => {
    accumulator[node.kind] = (accumulator[node.kind] || 0) + 1;
    return accumulator;
  }, {});

  return {
    errors,
    warnings,
    stats,
    reachableNodeIds: Array.from(reachableNodeIds),
  };
}

function main() {
  const projectDir = process.argv[2];
  const strict = process.argv.includes('--strict');
  if (!projectDir) {
    console.error('Usage: node thriller/scripts/doctor-vn-project.js <project-directory> [--strict]');
    process.exit(1);
  }

  const { compiledStoryPath, story } = compileProject(projectDir);
  writeCompiledStory(compiledStoryPath, story);

  const report = inspectStory(story);
  const relativeOutput = path.relative(process.cwd(), compiledStoryPath).replace(/\\/g, '/');

  console.log(`OK: compiled ${relativeOutput}`);
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
  collectReachableNodeIds,
  inspectStory,
};
