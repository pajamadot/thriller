# VN Project Template

This template is the recommended authoring layout for a general visual novel project.

## Authoring Flow

1. Define entities in `cast/`, `world/`, and `systems/`.
2. Keep `systems/clues.yaml` current if the project depends on investigation or fair-play reveals.
3. Write one markdown file per runtime node in `nodes/`.
4. Keep prose in structured `body` blocks.
5. Compile to `build/story.json`.
6. Validate the compiled file with:

```bash
node thriller/scripts/compile-vn-project.js thriller/interactive-fiction/templates/vn-project
node thriller/scripts/doctor-vn-project.js thriller/interactive-fiction/templates/vn-project
node thriller/scripts/doctor-interactive-thriller.js thriller/interactive-fiction/templates/vn-project
node thriller/scripts/validate-vn-json.js thriller/interactive-fiction/templates/vn-project/build/story.json
```

## Why this layout works for AI

- Stable file boundaries
- Low ambiguity per file
- Explicit IDs and references
- Clear separation between prose, state, and presentation
- A modular clue ledger that can be audited without engine coupling
- Variable design metadata that distinguishes critical ripple state from local texture
- Easy to diff, review, and import

## Scaling Up

When the project gets larger, organize `nodes/` into nested route or chapter folders.
The compiler walks subdirectories recursively, so you can safely use layouts such as:

```text
nodes/
  common/
  chapter-01/
  route-host/
  route-rival/
```
