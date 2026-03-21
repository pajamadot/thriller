# Storyboard EvoMap

This document describes how to track the storyboard decomposition system as local EvoMap-compatible assets.

## Local Asset Files

The local evolution ledger lives in:

```text
assets/gep/genes.json      # 4 storyboard genes (sb_*)
assets/gep/capsules.json   # Creation capsule
assets/gep/events.jsonl    # Evolution timeline
```

## Capability Signals

Track evolution at the capability level:

- `capability_gap:script_to_storyboard` — core decomposition ability
- `capability_gap:shot_sequence_logic` — causal reasoning between shots
- `capability_gap:visual_narrative_grammar` — formal shot language rules
- `capability_gap:llm_storyboard_quality` — LLM-specific quality issues
- `capability_gap:storyboard_evaluation` — scoring and assessment
- `capability_gap:visual_autopsy` — reverse-engineering film techniques
- `capability_gap:cross_module_integration` — bridges to other modules
- `research_insight:cognitive_film_theory` — neuroscience validation
- `research_insight:llm_screenplay_generation` — LLM generation research
- `quality_signal:shot_causality` — every cut has a reason
- `quality_signal:decomposition_quality` — overall output quality

## Storyboard Genes

### `gene_sb_shot_logic_system`

Use when shot sequences lack causal reasoning.

Expected moves:
- Formalize cut justification rules
- Build/refine information dependency DAG
- Encode film idioms as state machines
- Integrate cognitive neuroscience constraints
- Expand error dictionary

### `gene_sb_llm_execution_guide`

Use when LLM-generated storyboards show quality issues.

Expected moves:
- Identify new LLM traps from practice
- Refine chain-of-thought protocols
- Update self-audit criteria
- Improve decompose-then-generate strategy

### `gene_sb_evaluation_scoring`

Use when storyboard quality assessment is needed.

Expected moves:
- Define/refine scoring rubrics
- Build visual autopsy framework
- Create genre-adaptive evaluation weights

### `gene_sb_cross_module_bridge`

Use when integration between storyboard and other modules needs strengthening.

Expected moves:
- Map storyboard outputs to VN node directives
- Map storyboard outputs to MCP tool calls
- Strengthen clue-design ↔ fair-play shot mapping

## Evolution Dimensions

The storyboard module evolves along 6 dimensions:

```
1. Logic Depth      — How rigorous is the causal reasoning?
2. Cognitive Fidelity — How well-grounded in perception science?
3. LLM Effectiveness — How reliably can LLMs execute the framework?
4. Idiom Coverage   — How many film patterns are formalized?
5. Integration      — How well does it connect to other modules?
6. Evaluation       — How well can we measure output quality?
```

## Quality Metrics (v5.0 — 12 metrics)

| # | Metric | Target | Measures |
|---|--------|--------|----------|
| 1 | Information Efficiency | > 0.8 | Non-redundant info / total shots |
| 2 | Cut Justification | = 1.0 | Justified cuts / total cuts |
| 3 | Dependency Completeness | = 1.0 | Satisfied REQUIRES / total |
| 4 | Rhythm Variance σ | 1.5-4.0s | Shot duration std dev |
| 5 | Idiom Coverage | 0.6-0.9 | Shots in idioms / total |
| 6 | Shot Size Entropy | > 2.0 bits | Shannon entropy of size dist |
| 7 | ASL (Avg Shot Length) | genre-dependent | Mean shot duration |
| 8 | Lag-1 Autocorrelation r(1) | 0.3-0.7 | 1/f noise proxy |
| 9 | Duration Function MAE | < 1.0s | D_computed vs D_final |
| 10 | Phrase Regularity CV | < 0.3 | Phrase length variation |
| 11 | Climax Alignment | true | Gravity peak = BPM extremum |
| 12 | Cognitive Load Compliance | = 1.0 | Shots within info-unit limits |

## 100-Round Evolution Results

| Metric | v2.0 (start) | v5.0 (after 100 rounds) |
|--------|-------------|------------------------|
| Total lines | 4,800 | 17,576 |
| Reference files | 9 | 17 |
| Idiom FSMs | 6 | 18 (+ compound notation) |
| Cognitive science sources | 2 | 10+ |
| Quality metrics | 6 | 12 |
| Genre libraries | 0 | 6 (+ hybridization rules) |
| Director autopsies | 0 | 10+ (+ technique extraction) |
| Prompt templates | 0 | 5 |
| Visual metaphors | 0 | 28 (M01-M28) |
| Cross-module bridges | conceptual | 3 formalized (10+ field maps each) |
| Duration function | none | D = D_base × G × B × S (calibrated) |
| Rhythm algebra | none | 6 operators (CONCAT, NEST, INVERT, SCALE, ACCENT, INTERLEAVE) |
| Time signatures | none | 6 scene-type signatures |

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v1.0.0 | 2026-03-20 | Initial creation: 5-layer framework, 7-step algorithm, 8 commands |
| v2.0.0 | 2026-03-20 | Shot logic (info DAG, 6 idiom FSMs, cognitive rules), LLM guide, evaluation |
| v3.0.0 | 2026-03-20 | Band 3: cognitive-perception.md (10 sources, 40+ rules), VERIFY cognitive checks |
| v4.0.0 | 2026-03-20 | Band 1-2: shot-logic expanded (18 idioms, formal predicates, compound notation) |
| v5.0.0 | 2026-03-20 | 100-round evolution complete: 17 files, 17.5K lines, 6 new reference docs, 12 metrics |

### Bands Completed

| Band | Rounds | Status | Key Output |
|------|--------|--------|------------|
| 1 Shot Logic Foundation | r001-r010 | Done | Formal predicates, multi-channel DAG, 4th cut-reason |
| 2 Idiom Library Expansion | r011-r020 | Done | 18 idiom FSMs, decision tree, compound notation |
| 3 Cognitive Deepening | r021-r030 | Done | cognitive-perception.md (1522 lines, 10+ sources) |
| 4 Rhythm Sophistication | r031-r040 | Done | Duration function, time signatures, composition algebra |
| 5 Spatial Intelligence | r041-r050 | Done | visual-metaphor.md (28 entries), color/DoF rules |
| 6 LLM Optimization | r051-r060 | Done | prompt-templates.md (5 templates), validator spec |
| 7 Genre Libraries | r061-r070 | Done | genre-libraries.md (6 genres, delta overlays) |
| 8 Cross-Module Integration | r071-r080 | Done | integration-maps.md (3 bridges, 10+ fields each) |
| 9 Director Autopsy | r081-r090 | Done | technique-library.md (10+ autopsies, techniques) |
| 10 Verification & Codification | r091-r100 | Done | Final v5.0 spec locked |
