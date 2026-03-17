# Visual Novel Content Package

This document defines a general-purpose visual novel content package for AI-assisted authoring.
It is engine-neutral and importer-friendly.

## Design Goals

- Keep authoring simple enough for an LLM to generate predictably.
- Keep the compiled interchange format strict enough for validation.
- Separate prose, presentation, and logic instead of mixing them into freeform text.
- Prefer one file per node in authoring mode.
- Support both lightweight scene-driven novels and logic-heavy branching projects.

## Two Layers

### 1. Authoring Layout

Use markdown files with YAML frontmatter for node-level work.
This is the preferred layout for AI generation and human review.

### 2. Interchange JSON

Compile the authoring layout into a single `story.json`.
This is the preferred handoff format for importers, test tools, and runtime adapters.

## Project Workflow

Use the package in three stages:

1. Author entities and nodes in the project folders.
2. Compile the project directory into `build/story.json`.
3. Validate and inspect the compiled graph before import.

Recommended local commands:

```bash
node thriller/scripts/compile-vn-project.js thriller/interactive-fiction/templates/vn-project
node thriller/scripts/doctor-vn-project.js thriller/interactive-fiction/templates/vn-project
node thriller/scripts/validate-vn-json.js thriller/interactive-fiction/templates/vn-project/build/story.json
```

## Recommended Authoring Layout

```text
project/
  manifest.yaml
  cast/
    characters.yaml
  world/
    locations.yaml
  systems/
    variables.yaml
    assets.yaml
  nodes/
    n000-start.md
    n010-foyer-arrival.md
    n020-door-check.md
    e100-bad-ending.md
  locales/
    en.json
    zh.json
  build/
    story.json
```

For larger projects, `nodes/` may contain nested folders such as:

```text
nodes/
  common/
  chapter-01/
  route-host/
  route-rival/
```

## Authoring Rules

- Use stable IDs and never derive meaning from filenames alone.
- Keep one runtime node per markdown file.
- Nested directories under `nodes/` are allowed for chapter or route organization.
- Put shared entities in `cast/`, `world/`, and `systems/`.
- Put prose inside structured `body` blocks, not in frontmatter.
- Put state rules in `conditions`, `effects`, or logic nodes.
- Use explicit node kinds instead of inventing new freeform labels.

## Node File Contract

Each node markdown file should follow this pattern:

```md
---
id: n010-example
kind: scene
title: Example Scene
chapter: chapter-01
route: route-host
tags: [intro, foyer]
location: loc.example
body:
  - kind: narration
    text: The room is quiet.
choices:
  - id: continue
    text: Continue.
    to: n020-next
---

# Optional authoring note

Any markdown below the frontmatter is treated as notes for humans and AI.
It is not required for runtime.
```

## Node Taxonomy

### Player-facing nodes

| Kind | Purpose | Typical use |
|------|---------|-------------|
| `start` | Story entry | Defines first runtime target |
| `scene` | Main VN unit | Background, cast, dialogue, narration, optional choices |
| `ending` | Terminal player-facing scene | Ending prose and credits hook |

### Logic nodes

| Kind | Purpose | Typical use |
|------|---------|-------------|
| `condition` | Branch on state | Trust gates, clue checks, route unlocks |
| `instruction` | Apply state effects then continue | Inventory change, flag updates, route bookkeeping |
| `hub` | Merge or fan out with no prose | Route convergence, structural simplification |
| `jump` | Redirect to another node | Shared scene reuse, late redirects |

### Authoring-only nodes

| Kind | Purpose | Typical use |
|------|---------|-------------|
| `annotation` | Notes excluded from runtime | Writer comments, import hints |

## Scene Node Shape

`scene` is the primary visual novel node.

- `location`: semantic location reference
- `presentation`: background, music, ambience, transition
- `cast`: visible characters with expression / pose / position
- `body`: ordered blocks of prose or dialogue
- `choices`: optional player actions branching out of the node

## Body Block Kinds

| Kind | Meaning |
|------|---------|
| `narration` | Non-spoken prose |
| `dialogue` | Spoken line by a speaker |
| `stage_direction` | Performative or cinematic note visible to the player |
| `aside` | Optional meta or internal-text presentation block |

## Choice Shape

Each choice should contain:

- `id`
- `text`
- `to`
- optional `conditions`
- optional `effects`
- optional `tags`

Choices belong inside the source `scene`.
Do not create a separate choice node unless the target engine requires it.

## Project Scale Conventions

For medium or large novels, use `chapter`, `route`, and `tags` on nodes.

- `chapter`: coarse structural grouping
- `route`: route ownership or romance / investigation branch
- `tags`: lightweight retrieval labels for tools and AI

## Conditions

Use declarative condition objects when possible:

```json
{ "all": [
  { "var": "flag.key_found", "op": "eq", "value": true },
  { "var": "trust.host", "op": "gte", "value": 50 }
] }
```

Avoid embedding engine-specific expression languages in the authoring layer.

## Effects

Recommended effect operations:

- `set`
- `increment`
- `decrement`
- `toggle`
- `push_tag`
- `remove_tag`

Example:

```json
{ "op": "increment", "target": "trust.host", "value": 10 }
```

## Character Presentation

Each cast entry should be explicit:

```json
{
  "character": "char.host",
  "expression": "smile",
  "pose": "standing",
  "position": "right",
  "visible": true
}
```

Recommended position values:

- `far-left`
- `left`
- `center`
- `right`
- `far-right`

## Interchange JSON Root

`build/story.json` should contain:

- `meta`
- `entities`
- `nodes`

Example root keys:

```json
{
  "meta": {
    "format": "vn-package/v1",
    "id": "project.mirror-house",
    "title": "Mirror House",
    "entry": "n000-start",
    "defaultLocale": "en"
  },
  "entities": {
    "characters": [],
    "locations": [],
    "variables": [],
    "assets": []
  },
  "nodes": []
}
```

## Importer Notes

- Importers may keep `scene.body` as a scene-local dialogue array.
- Importers may split a `scene` into smaller runtime units if their engine needs line-by-line nodes.
- `condition`, `instruction`, `hub`, and `jump` exist to preserve logic without bloating prose files.
- `annotation` must never be treated as runtime content.
- Compilers may preserve the original authoring file path as `node.source.file`.

## AI Authoring Checklist

- IDs are unique.
- Every non-terminal node leads somewhere valid.
- Every referenced character, location, and variable exists.
- Every `scene` contains at least one `body` block.
- Every `ending` is terminal.
- Every compiled package validates before import.
- Every project passes a graph-level doctor pass before import.
