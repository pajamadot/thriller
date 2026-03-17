#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function loadYaml() {
  const candidates = [
    'js-yaml',
    path.resolve(__dirname, '../../web/node_modules/js-yaml'),
    path.resolve(process.cwd(), 'web/node_modules/js-yaml'),
  ];

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (error) {
      // Try the next candidate.
    }
  }

  throw new Error(
    'Unable to load a YAML parser. Install "js-yaml" or run this script from the monorepo root.'
  );
}

const yaml = loadYaml();

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readYamlFile(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    return fallbackValue;
  }

  const parsed = yaml.load(readText(filePath));
  return parsed == null ? fallbackValue : parsed;
}

function parseFrontmatter(markdown, filePath) {
  if (!markdown.startsWith('---')) {
    throw new Error(`Missing frontmatter fence in ${filePath}`);
  }

  const closingIndex = markdown.indexOf('\n---', 3);
  if (closingIndex === -1) {
    throw new Error(`Unclosed frontmatter fence in ${filePath}`);
  }

  const yamlText = markdown.slice(4, closingIndex).trim();
  const body = markdown.slice(closingIndex + 4).trim();
  const frontmatter = yaml.load(yamlText);

  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    throw new Error(`Frontmatter in ${filePath} must parse to an object`);
  }

  return {
    frontmatter,
    body,
  };
}

function normalizeCharacter(character) {
  const { default_expression, ...rest } = character;
  return {
    ...rest,
    defaultExpression: character.defaultExpression ?? default_expression,
  };
}

function normalizeVariable(variable) {
  const { enum_values, ...rest } = variable;
  return {
    ...rest,
    enumValues: variable.enumValues ?? enum_values,
  };
}

function normalizeNode(node, relativeFilePath, markdownBody) {
  const normalized = {
    ...node,
    source: {
      file: relativeFilePath.replace(/\\/g, '/'),
      format: 'markdown-frontmatter',
    },
  };

  if (markdownBody) {
    normalized.notes = normalized.notes ? `${normalized.notes}\n\n${markdownBody}` : markdownBody;
  }

  return normalized;
}

function listMarkdownFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absoluteEntryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(absoluteEntryPath));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(absoluteEntryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function compileProject(projectDir) {
  const absoluteProjectDir = path.resolve(projectDir);
  const manifestPath = path.join(absoluteProjectDir, 'manifest.yaml');
  const manifest = readYamlFile(manifestPath, {});

  const nodeDirectory = manifest.node_directory || manifest.nodeDirectory || 'nodes';
  const compiledStoryPath = manifest.compiled_story || manifest.compiledStory || 'build/story.json';
  const nodeDir = path.join(absoluteProjectDir, nodeDirectory);

  const charactersDoc = readYamlFile(path.join(absoluteProjectDir, 'cast', 'characters.yaml'), {});
  const locationsDoc = readYamlFile(path.join(absoluteProjectDir, 'world', 'locations.yaml'), {});
  const variablesDoc = readYamlFile(path.join(absoluteProjectDir, 'systems', 'variables.yaml'), {});
  const cluesDoc = readYamlFile(path.join(absoluteProjectDir, 'systems', 'clues.yaml'), {});
  const assetsDoc = readYamlFile(path.join(absoluteProjectDir, 'systems', 'assets.yaml'), {});

  const nodes = listMarkdownFiles(nodeDir).map((filePath) => {
    const parsed = parseFrontmatter(readText(filePath), filePath);
    const relativeFilePath = path.relative(absoluteProjectDir, filePath);
    return normalizeNode(parsed.frontmatter, relativeFilePath, parsed.body);
  });

  const story = {
    meta: {
      format: manifest.format || 'vn-package/v1',
      id: manifest.project_id || manifest.projectId || manifest.id,
      title: manifest.title,
      entry: manifest.entry,
      defaultLocale: manifest.default_locale || manifest.defaultLocale || 'en',
      tags: Array.isArray(manifest.tags) ? manifest.tags : [],
      compiler: 'thriller/compile-vn-project',
      sourceLayout: 'vn-project/v1',
    },
    entities: {
      characters: (charactersDoc.characters || []).map(normalizeCharacter),
      locations: locationsDoc.locations || [],
      variables: (variablesDoc.variables || []).map(normalizeVariable),
      clues: cluesDoc.clues || [],
      assets: assetsDoc.assets || [],
    },
    nodes,
  };

  return {
    compiledStoryPath: path.join(absoluteProjectDir, compiledStoryPath),
    projectDir: absoluteProjectDir,
    story,
  };
}

function writeCompiledStory(filePath, story) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(story, null, 2)}\n`, 'utf8');
}

function main() {
  const projectDir = process.argv[2];
  if (!projectDir) {
    console.error('Usage: node thriller/scripts/compile-vn-project.js <project-directory>');
    process.exit(1);
  }

  const { compiledStoryPath, story } = compileProject(projectDir);
  writeCompiledStory(compiledStoryPath, story);
  console.log(`OK: compiled ${compiledStoryPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  compileProject,
  writeCompiledStory,
};
