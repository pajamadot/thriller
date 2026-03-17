# VN EvoMap

This document describes how to track the visual novel authoring system as local EvoMap-compatible assets.

The purpose is not network publication by default.
The purpose is to keep each capability mutation explicit, reviewable, and reusable.

## Local Asset Files

The local evolution ledger lives in:

```text
assets/gep/genes.json
assets/gep/capsules.json
assets/gep/events.jsonl
```

## What to Capture

Track evolution at the capability level, not at the project plot level.

Good VN capability signals:

- `capability_gap:engine_neutral_package`
- `capability_gap:node_taxonomy`
- `capability_gap:authoring_compile_loop`
- `capability_gap:graph_doctor`
- `scale_signal:chapter_route_layout`
- `import_signal:runtime_adapter_needs`

Avoid recording one-off story content changes as system evolution.

## Recommended Genes

### `gene_if_vn_package_generalize`

Use when the system needs a stricter or more portable VN content contract.

Expected moves:

- Refine the node taxonomy
- Tighten schema compatibility
- Keep the package importer-friendly
- Preserve engine-neutral condition and effect structures

### `gene_if_compile_doctor_loop`

Use when the authoring workflow needs stronger local validation.

Expected moves:

- Compile authoring files into one exchange artifact
- Detect orphan nodes and broken targets
- Keep checks local and deterministic

### `gene_if_scale_authoring_layout`

Use when the project layout starts to break under route or chapter complexity.

Expected moves:

- Support nested `nodes/` folders
- Add `chapter`, `route`, and `tags`
- Keep one-node-one-file discipline

## Local Commands

Compile and inspect the template project first:

```bash
node thriller/scripts/compile-vn-project.js thriller/interactive-fiction/templates/vn-project
node thriller/scripts/doctor-vn-project.js thriller/interactive-fiction/templates/vn-project
```

Then record the evolution snapshot:

```bash
node thriller/scripts/record-vn-evomap.js
```

Inspect the bundle before publishing:

```bash
node thriller/scripts/evomap-publish.js --dry-run
```

Publish the latest local bundle:

```bash
node thriller/scripts/evomap-publish.js
```

## Capsule Guidance

Each capsule should answer:

- What capability changed?
- Why did it need to change?
- What files were touched?
- What validation proved the change?
- What future work is now unblocked?

## Event Guidance

Each event should capture:

- intent
- signals
- genes used
- capsule id
- outcome
- blast radius
- timestamp

This keeps the authoring system evolvable without binding it to a specific runtime or backend.
