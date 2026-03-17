# Interactive Fiction Quick Reference Card

## Commands
```
/init → /branches → /choices → /character-paths → /state → /node N → /ending N → /consistency → /export {format}
```

## Topology Selection
| Model | Best For | Content Multiplier |
|-------|---------|-------------------|
| Bottleneck | First IF project, moderate complexity | 1.5-2.0x |
| Parallel Investigation | Detective/clue-driven stories | 2.0-3.0x |
| Time Loop | Locked-room, "what killed me" | 1.3-1.8x |
| Trust Network | Social mystery, relationship-driven | 2.5-4.0x |
| Open Exploration | Point-and-click, free investigation | 3.0-5.0x |

## Choice Design: Accept / Reject / Deflect
```
Every dialogue choice = one of three stances:
  Accept:  Go along, cooperate, agree
  Reject:  Push back, refuse, confront
  Deflect: Change subject, humor, escape
3 options is almost always right.
```

## Node Length Guide
| Node Type | Words | Why |
|-----------|-------|-----|
| Opening | 500-800 | Establish atmosphere |
| Standard narrative | 300-600 | Maintain momentum |
| Pre-decision | 200-400 | Context for choice |
| High tension | 150-300 | Short = fast |
| Reveal/ending | 600-1200 | Space for emotion |

## State Variable Naming
```
found_*    boolean  clue discovery
know_*     boolean  information known
trust_*    0-100    relationship quality
did_*      boolean  action taken
count_*    integer  accumulation
flag_*     boolean  flow control
```

## Decision Density
```
Investigation: every 500-800 words (strategic)
Dialogue: every 300-500 words (responsive)
High tension: every 200-400 words (urgent)
Reveal/ending: every 800-1500 words (immersive)
```

## Ending Grade Distribution (target)
```
S (perfect):  ~15% first-time players
A (good):     ~30%
B (neutral):  ~35%
C (bad):      ~20%
Even C endings must be good stories.
```

## Convergence Node Template
```
Layer 1: Core text (shared by all paths)
Layer 2: Conditional text (if trust_X > 60: ...)
Layer 3: Retrospective text (reference player's history)
```

## Per-Node Checklist
```
□ Reachable from at least one path
□ Leads to at least one ending
□ State changes documented
□ Conditional text covers all source paths
□ Word count within target for node type
```

## Export Syntax Cheat
```
Twine Harlowe:  (set: $var to val)  (if: $var)[text]  [[link->passage]]
Twine Sugar:    <<set $var to val>> <<if $var>>text<</if>> [[link]]
ink:            ~ var = val  { var: text }  -> knot  + [choice]
ChoiceScript:   *set var val  *if (var)  *choice  #option  *goto label
```

## General VN Node Kinds
```
start       entry only
scene       primary VN prose + cast + presentation + optional choices
condition   branch on state
instruction apply effects then continue
hub         merge / route without prose
jump        redirect to another node
ending      terminal prose node
annotation  authoring-only note
```

## AI-Friendly Project Layout
```text
manifest.yaml
cast/characters.yaml
world/locations.yaml
systems/variables.yaml
nodes/*.md
build/story.json
```

Compiled package spec:
`interactive-fiction/specs/vn-package.md`

## Local Toolchain
```bash
node thriller/scripts/compile-vn-project.js <project-dir>
node thriller/scripts/doctor-vn-project.js <project-dir>
node thriller/scripts/doctor-interactive-thriller.js <project-dir>
node thriller/scripts/validate-vn-json.js <project-dir>/build/story.json
node thriller/scripts/record-vn-evomap.js
node thriller/scripts/run-interactive-thriller-evolution-loop.js init
node thriller/scripts/run-interactive-thriller-evolution-loop.js scaffold --count 3
node thriller/scripts/run-interactive-thriller-evolution-loop.js status
node thriller/scripts/record-interactive-thriller-evomap.js
node thriller/scripts/evomap-publish.js --dry-run
```

Interactive thriller loop:
`interactive-fiction/specs/interactive-thriller-100-rounds.md`

Thriller annotation overlay:
`interactive-fiction/specs/interactive-thriller-annotations.md`
