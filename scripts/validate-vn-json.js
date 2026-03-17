#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VALID_KINDS = new Set([
  'start',
  'scene',
  'condition',
  'instruction',
  'hub',
  'jump',
  'ending',
  'annotation',
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function collectIds(list, key = 'id') {
  return new Set((Array.isArray(list) ? list : []).map((entry) => entry && entry[key]).filter(Boolean));
}

function validateStory(story) {
  const errors = [];
  const meta = isObject(story.meta) ? story.meta : {};
  const entities = isObject(story.entities) ? story.entities : {};
  const nodes = Array.isArray(story.nodes) ? story.nodes : [];

  if (meta.format !== 'vn-package/v1') {
    errors.push('meta.format must equal "vn-package/v1"');
  }

  const nodeIds = nodes.map((node) => node.id).filter(Boolean);
  if (nodeIds.length !== new Set(nodeIds).size) {
    errors.push('node ids must be unique');
  }

  if (!meta.entry || !nodeIds.includes(meta.entry)) {
    errors.push('meta.entry must reference an existing node id');
  }

  const characterIds = collectIds(entities.characters);
  const locationIds = collectIds(entities.locations);
  const variableIds = collectIds(entities.variables);

  for (const node of nodes) {
    if (!VALID_KINDS.has(node.kind)) {
      errors.push(`node ${node.id || '<missing>'} has invalid kind "${node.kind}"`);
      continue;
    }

    if (node.location && !locationIds.has(node.location)) {
      errors.push(`node ${node.id} references unknown location ${node.location}`);
    }

    if (Array.isArray(node.cast)) {
      for (const castEntry of node.cast) {
        if (!characterIds.has(castEntry.character)) {
          errors.push(`node ${node.id} references unknown character ${castEntry.character}`);
        }
      }
    }

    if (node.kind === 'scene' || node.kind === 'ending') {
      if (!Array.isArray(node.body) || node.body.length === 0) {
        errors.push(`node ${node.id} must include a non-empty body array`);
      }
    }

    if (Array.isArray(node.body)) {
      for (const block of node.body) {
        if (block.speaker && !characterIds.has(block.speaker)) {
          errors.push(`node ${node.id} body references unknown speaker ${block.speaker}`);
        }
      }
    }

    if (Array.isArray(node.choices)) {
      for (const choice of node.choices) {
        if (!choice.to || !nodeIds.includes(choice.to)) {
          errors.push(`node ${node.id} choice ${choice.id || '<missing>'} points to unknown node ${choice.to}`);
        }
        if (Array.isArray(choice.effects)) {
          for (const effect of choice.effects) {
            if (typeof effect.target === 'string' && !variableIds.has(effect.target)) {
              errors.push(`node ${node.id} choice ${choice.id || '<missing>'} targets unknown variable ${effect.target}`);
            }
          }
        }
      }
    }

    if (Array.isArray(node.effects)) {
      for (const effect of node.effects) {
        if (typeof effect.target === 'string' && !variableIds.has(effect.target)) {
          errors.push(`node ${node.id} targets unknown variable ${effect.target}`);
        }
      }
    }

    if (node.kind === 'start' || node.kind === 'instruction' || node.kind === 'hub') {
      if (node.to && !nodeIds.includes(node.to)) {
        errors.push(`node ${node.id} points to unknown node ${node.to}`);
      }
    }

    if (node.kind === 'jump') {
      if (!node.target || !nodeIds.includes(node.target)) {
        errors.push(`jump node ${node.id} must define target referencing an existing node`);
      }
    }

    if (node.kind === 'condition') {
      if (!node.onTrue || !nodeIds.includes(node.onTrue)) {
        errors.push(`condition node ${node.id} must define onTrue referencing an existing node`);
      }
      if (!node.onFalse || !nodeIds.includes(node.onFalse)) {
        errors.push(`condition node ${node.id} must define onFalse referencing an existing node`);
      }
    }
  }

  return errors;
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/validate-vn-json.js <path-to-story.json>');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), filePath);
  const story = readJson(absolutePath);
  const errors = validateStory(story);

  if (errors.length > 0) {
    errors.forEach((message) => console.error(`ERROR: ${message}`));
    process.exit(1);
  }

  console.log(`OK: validated ${absolutePath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  VALID_KINDS,
  validateStory,
};
