# Thriller — AI-Powered Thriller Screenplay & Interactive Fiction Skill Pack

> Professional mystery/thriller writing system with 25+ screenwriting methodologies, 30+ academic papers, cinematic storyboard decomposition, and self-evolving methodology via GEP protocol.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v2.1.0-blue.svg)](meta/CHANGELOG.md)

---

## What is this?

A set of Claude Code skills for writing professional-quality mystery/thriller novels and converting them into branching interactive fiction. The system is built on established screenwriting theory (McKee, Hitchcock, Christie, Truby, etc.) augmented by computational narrative research, and it **improves itself** through a built-in evolution framework.

**46 files · 8300+ lines · 24 reference documents · 25+ methodology sources**

---

## Four Modules

### 1. Thriller Screenplay Writing (`thriller-writing/`)

Systematic mystery/thriller creation from concept to manuscript.

| Command | Function | Output |
|---------|----------|--------|
| `/start` | Project init (type, length, POV, trick, tone, theme) | `.thriller-state.json` |
| `/theme` | Thematic premise design (Egri method) | `theme.md` |
| `/trick` | Core mystery architecture, clue layout, fairness check | `trick-design.md` |
| `/characters` | Character system (detective, culprit, suspect matrix, victim) | `characters.md` |
| `/structure` | Three-act adaptation, chapter outline, suspense management | `structure.md` |
| `/scene {N}` | Chapter writing (prose + clue tracking + suspicion shifts) | `chapters/ch{N}.md` |
| `/audit` | Clue consistency audit, sub-type-filtered Knox check | Audit report |
| `/check {N}` | Six-dimension weighted scoring (weights vary by sub-type) | Score report |
| `/revise` | Four revision modes (structure / character / clues / prose) | Revision plan |
| `/reveal` | Truth revelation scene design | Revelation plan |
| `/export` | Complete work export | `export/` |

**9 sub-types**: Honkaku (whodunit) · Social school · Psychological · Thriller · Locked-room · Narrative trick · Procedural · Inverted (howcatchem) · Cozy mystery

**3 workflow routes** (order adapts to sub-type):
- Trick-first: honkaku, locked-room, narrative trick
- Character-first: social school, psychological
- Structure-first: thriller, procedural

**Key methodology highlights**:
- **Knowledge state tracking** (Dynamic Epistemic Logic) — who knows what at every moment
- **Adversarial suspense design** (Xie & Riedl, EACL 2024) — systematically destroy protagonist's escape plans
- **Dual-reader fairness verification** (Wagner et al., 2025) — naive reader (surprise) + detective reader (fair play)
- **Character Compass** (David Corbett) — Lack / Yearning / Resistance / Desire
- **Villain-as-plot-engine** (James Frey) — villain's plan IS the plot skeleton
- **Yes-but / No-and investigation scenes** (Brandon Sanderson) — every investigation has a cost
- **Competing narratives** (John Truby) — detective and killer fight over which version of reality is accepted
- **Anti-theme architecture** (Craig Mazin) — Act 2 reinforces false belief before dismantling it
- **MICE nesting** (Brandon Sanderson) — close story threads in reverse order of opening
- **Short-story mode** — `/start` + `/theme` merge, minimal suspect matrix (2-3 characters)

### 2. Interactive Thriller Fiction (`interactive-fiction/`)

Convert thriller novels into branching interactive narratives.

| Command | Function | Output |
|---------|----------|--------|
| `/init` | Project setup (source, branch depth, endings, platform) | `.interactive-state.json` |
| `/branches` | Narrative topology design (5 models) | `branch-map.md` |
| `/choices` | Decision point design with quality checks | `choices/` |
| `/character-paths` | Character fate matrix, cross-path consistency | `character-branches.md` |
| `/state` | Variable design, conditional logic, ending triggers | `state-system.md` |
| `/node {N}` | Node writing (narrative + choices + state changes) | `nodes/` |
| `/ending {N}` | Ending creation (trigger + prose + replay hooks) | `endings/` |
| `/consistency` | Path integrity, state consistency, narrative coherence audit | Audit report |
| `/export {format}` | Export to Twine / ink / ChoiceScript / JSON / Mermaid | `export/` |

**5 topology models**: Bottleneck · Parallel investigation · Time loop · Trust network · Open exploration

**Export targets**: Twine (Harlowe / SugarCube) · ink · ChoiceScript · JSON Schema · Mermaid flowcharts

**Advanced techniques**:
- **Accept / Reject / Deflect** dialogue choices (Jon Ingold / inkle)
- **Quality-Based Narrative** with parsimony principle (Failbetter Games / Emily Short)
- **Vertical drilling** narrative (Sam Barlow / Her Story) — depth over breadth
- **Storylet pool design** for investigation phases
- **Cross-skill conversion mapping** — thriller-writing outputs feed directly into interactive-fiction inputs

### 3. Storyboard Decomposition (`storyboard/`)

Transform narrative text into professional shot-by-shot storyboard sequences using cinematic language.

| Command | Function | Output |
|---------|----------|--------|
| `/decompose` | Scene-level storyboard decomposition (core command) | Shot sequence table |
| `/shot N` | Fine-tune individual shot (size, angle, movement, composition) | Shot design card |
| `/rhythm` | Rhythm analysis and optimization (scene/chapter level) | Rhythm diagnosis + fixes |
| `/blocking` | Staging design (character positions + camera paths) | Floor plan + trajectories |
| `/montage` | Montage design (inter-shot relationships + transitions) | Montage annotations |
| `/board` | Storyboard export (structured output) | Markdown / JSON / CSV |
| `/visual-audit` | Visual grammar audit (continuity, axis, matching) | Issue report + fixes |
| `/style` | Visual style preset (reference director/genre/palette) | Style manual |

**5-layer analysis model**: Narrative (beats) > Visual Grammar (shots) > Mise-en-scene (staging) > Montage (editing) > Sound (audio design)

**7-step decomposition algorithm**: PARSE > BEAT > BLOCK > SHOOT > CONNECT > RHYTHM > ANNOTATE

**Key methodology sources**:
- **Eisenstein five-level montage** — metric, rhythmic, tonal, overtonal, intellectual
- **Katz A-I-L staging model** — Apex, Inline, L-shape spatial patterns
- **Hitchcock visual suspense** — shot size = narrative importance, audience complicity
- **Murch editing priority** — emotion > story > rhythm > eye trace > 2D > 3D
- **Hall proxemics** — intimate/personal/social/public distance zones
- **Kurosawa internal motion** — move within frame before moving camera

**Thriller-specific techniques**: Fair-play clue planting via shot design, suspense rhythm patterns (Hitchcock/chase/psychological), truth revelation montage sequences

### 4. Self-Evolution System (`meta/`)

The methodology improves itself through structured reflection and external research.

| Command | Function | When |
|---------|----------|------|
| `/retro` | Project-level retrospective (process deviations, findings, fixes) | After each project |
| `/evolve` | Cross-project pattern recognition → hypothesis → methodology update | After 2+ retros |
| `/benchmark` | Critical integration of external methodologies | When encountering new knowledge |
| `/autopsy` | Reverse-engineer excellent published works | When analyzing great works |
| `/blindspot` | Cognitive blind spot scan (5 bias types) | Every 3-5 projects |
| `/pulse` | Creative ecosystem monitoring (trends, platforms, readers) | Ongoing |

**Three-ring evolution model**:
```
Epistemic (are our assumptions still valid?)
Praxis (what happened during writing?)
Ecological (what's changing in the outside world?)
```

**Evolution principles**: Gradual iteration · Preserve failure records (`graveyard.md`) · Dual-track validation (theory + practice) · Complexity budget (refine, don't bloat)

**Knowledge lifecycle**: Experiment → Practice (1-2 projects) → Principle (5+ projects)

**GEP integration**: Local evolution assets in `assets/gep/` (Genes, Capsules, EvolutionEvents) ready to publish to [EvoMap](https://evomap.ai) network when connected.

---

## Methodology Sources (25+)

| Source | Domain | Application |
|--------|--------|-------------|
| Robert McKee *Story* | Screenwriting | Scene as minimal unit of value change |
| Syd Field *Screenplay* | Structure | Three-act structure, plot points |
| Blake Snyder *Save the Cat* | Beat theory | 15-beat rhythm verification |
| Lajos Egri *Art of Dramatic Writing* | Premise/character | Thematic premise, 3D characters |
| Alfred Hitchcock | Suspense theory | Suspense vs surprise, dramatic irony |
| Agatha Christie | Classical mystery | Suspect design, narrative tricks |
| Raymond Chandler | Hardboiled | Scene dynamics |
| John Truby *Anatomy of Story* | 22-step structure | Competing narratives, fake-ally opponent |
| Craig Mazin (Scriptnotes) | Theme theory | Anti-theme architecture |
| David Corbett *Compass of Character* | Character theory | Four-dimension motivation compass |
| James Frey *Damn Good Thriller* | Thriller craft | Villain-as-plot-engine |
| Brandon Sanderson (Writing Excuses) | Narrative technique | MICE nesting, Yes-but/No-and |
| Wayne Booth *Rhetoric of Fiction* | Narrative theory | Unreliable narrator system |
| Patricia Highsmith | Crime psychology | Criminal POV writing |
| Shimada Soji / Ayatsuji Yukito | Shin-honkaku | Spatial puzzle design, diagram contracts |
| S.S. Van Dine | Mystery rules | Twenty rules of fair play |
| Ronald A. Knox | Mystery rules | Ten Commandments of detection |
| Jon Ingold (inkle) | Interactive narrative | Ripple theory, Accept/Reject/Deflect |
| Emily Short | Interactive narrative | Quality-Based Narrative, storylets |
| Sam Barlow (Her Story) | Nonlinear narrative | Vertical drilling, natural discovery design |
| Failbetter Games | QBN design | Parsimony principle, word limits |
| Janet Murray *Hamlet on the Holodeck* | Digital narrative | Reader agency theory |
| Xie & Riedl (EACL 2024) | Computational suspense | Adversarial plan-failure method |
| Wagner et al. (2025) | Fairness modeling | Dual-reader probabilistic verification |
| Eger (AIIDE 2020) | Computational reasoning | Dynamic Epistemic Logic |
| Sergei Eisenstein *Montage Theory* | Editing theory | Five-level montage system, collision principle |
| Steven Katz *Shot by Shot* | Storyboard design | A-I-L staging, shot-by-shot visualization |
| Sidney Lumet *Making Movies* | Directing practice | Dramatic intent of shot design |
| Walter Murch *In the Blink of an Eye* | Editing theory | Emotion-first editing priority (51/23/10/7/5/4) |
| David Bordwell *Film Art* | Film studies | Formal analysis framework |
| Edward T. Hall *Hidden Dimension* | Proxemics | Intimate/personal/social/public distance zones |
| Akira Kurosawa | Visual storytelling | Internal motion priority, environment as narrative |
| StudioBinder | Modern practice | 50+ shot/angle/movement taxonomy |

---

## Reference Documents (29)

### Thriller Writing (`thriller-writing/references/`) — 11 files

| File | Contents |
|------|----------|
| `mystery-structure.md` | Three-act structure, 9 sub-type variants, information economics |
| `clue-design.md` | Clue taxonomy, planting techniques, Knox Decalogue, fair-play spectrum |
| `suspense-technique.md` | Hitchcock model, 9 suspense techniques, adversarial plan-failure, MICE nesting |
| `character-archetype.md` | 7 detective archetypes, villain 4D design, Character Compass, fake-ally opponent |
| `red-herring.md` | Red herring types, lifecycle management, common mistakes |
| `twist-design.md` | Twist taxonomy, reverse engineering, revelation scene structure |
| `pacing-tension.md` | Four-stage pacing model, page-turn drivers, rhythm diagnostics |
| `dialogue-interrogation.md` | Subtext techniques, interrogation strategy matrix, writing lies |
| `unreliable-narrator.md` | 6 unreliable types, trust arc, dual-reading design |
| `setting-atmosphere.md` | Closed spaces, atmosphere writing, everyday uncanny |
| `knowledge-state.md` | Knowledge state tracking, competing narratives, dual-reader verification, villain engine |

### Interactive Fiction (`interactive-fiction/references/`) — 8 files

| File | Contents |
|------|----------|
| `branch-architecture.md` | 5 topology models, hybrid design, complexity control |
| `choice-design.md` | 7 choice types, design principles, copywriting |
| `state-management.md` | Variable design, conditional logic, ending trigger system |
| `narrative-convergence.md` | Convergence techniques, character consistency, ripple model |
| `reader-agency.md` | Reader role positioning, immersion design, replay design |
| `export-formats.md` | Complete Twine/ink/ChoiceScript/JSON syntax specifications |
| `interactive-prose.md` | Interactive prose writing, person choice, node length, convergence node techniques |
| `advanced-if.md` | Accept/Reject/Deflect, QBN, vertical drilling, Storylet design |

### Storyboard Decomposition (`storyboard/references/`) — 7 files

| File | Contents |
|------|----------|
| `shot-grammar.md` | Complete shot size/angle/movement taxonomy, transition rules, continuity editing |
| `montage-theory.md` | Eisenstein five-level montage, transition handbook, Murch editing priority, Kuleshov effect |
| `visual-rhythm.md` | Shot duration system, 6 rhythm patterns, tension arc templates, rhythm diagnostics |
| `composition-staging.md` | Katz A-I-L staging, Hall proxemics, depth layering, color/light narrative, visual metaphor |
| `shot-logic.md` | Shot sequence logic system: 3 cut reasons, information DAG, 6 film idiom FSMs, cognitive continuity (Magliano/Liao), 8 logic errors, viewpoint system |
| `llm-guidance.md` | LLM execution guide: 5 known traps, forced chain-of-thought protocol, 5-step self-audit, decompose-then-generate strategy, 6 quality metrics |
| `decomposition-algorithm.md` | 8-step algorithm with VERIFY gate: PARSE→BEAT→BLOCK→SHOOT→VERIFY→CONNECT→RHYTHM→ANNOTATE+AUDIT |

### Evolution System (`meta/references/`) — 5 files

| File | Contents |
|------|----------|
| `retrospective-method.md` | Three-layer analysis, 5-Why attribution, anti-patterns |
| `evolution-patterns.md` | Four evolution modes (fill/correct/restructure/metamorphosis) |
| `blind-spot-detection.md` | 5 cognitive bias types, reverse thinking exercises |
| `reverse-engineering.md` | Work autopsy method, cross-work comparison |
| `benchmarking-protocol.md` | External methodology critical integration protocol |

---

## Workflows

### Linear Writing (route by sub-type)

```
Trick-first (honkaku / locked-room / narrative trick):
  /start → /theme → /trick → /characters → /structure → /scene → /revise → /reveal → /export

Character-first (social school / psychological):
  /start → /theme → /characters → /trick → /structure → /scene → /revise → /reveal → /export

Structure-first (thriller / procedural):
  /start → /theme → /structure → /characters → /trick → /scene → /revise → /reveal → /export
```

### Interactive Fiction

```
/init → /branches → /choices → /character-paths → /state
                                                      ↓
            /export ← /consistency ← /ending ← /node 1..N
```

### Linear → Interactive Conversion

```
Finished manuscript → /init (source: existing novel) → identify decision points
  → /branches → /choices → /character-paths → /state
  → /node 1..N → /ending → /consistency → /export {format}
```

Outputs from `thriller-writing` feed directly into `interactive-fiction` — see conversion mapping in `interactive-fiction/SKILL.md`.

### Storyboard Decomposition

```
/scene N (from thriller-writing) → /decompose → /shot → /rhythm → /montage
                                                                      ↓
                                  /board ← /visual-audit ← /blocking
```

Storyboard outputs feed into `interactive-fiction` (VN asset planning) and Story Platform MCP (node/asset generation).

### Evolution Loop

```
Write a project → /retro → accumulate 2+ retros → /evolve → update methodology
                                                      ↑
  /benchmark (new books/papers) ─────────────────────┘
  /autopsy (great works) ───────────────────────────┘
  /blindspot (periodic bias scan) ──────────────────┘
```

---

## Pilot Project: *Mirror Visitor* (《镜中访客》)

A psychological thriller short story used to test the full workflow.

- **Type**: Psychological suspense, first-person unreliable narrator
- **Theme**: "We fear not others' malice, but discovering we are the source of it"
- **Status**: `/start` → `/theme` → `/characters` → `/trick` → `/structure` → `/scene 1` → `/check 1` → `/retro` completed
- **Ch1 score**: 46/60 (Good) — Suspense 7, Clues 8, Character 8, Pacing 7, Logic 9, Literary 7
- **Retro findings**: 4 methodology fixes identified and applied in v2.1.0

Files in `projects/mirror-visitor/`.

---

## Repository Structure

```
thriller/
├── thriller-writing/           # Skill 1: Thriller screenplay writing
│   ├── SKILL.md                # 11 commands, 3 workflow routes
│   ├── QUICKREF.md             # Quick reference card
│   ├── references/             # 17 reference documents
│   └── templates/              # 6 sub-type project templates
├── interactive-fiction/         # Skill 2: Interactive branching fiction
│   ├── SKILL.md                # 9 commands, 5 topology models
│   ├── QUICKREF.md             # Quick reference card
│   └── references/             # 10 reference documents
├── storyboard/                 # Skill 3: Storyboard decomposition
│   ├── SKILL.md                # 8 commands, 5-layer model, 7-step algorithm
│   ├── QUICKREF.md             # Quick reference card
│   └── references/             # 5 reference documents
├── meta/                       # Skill 4: Self-evolution system
│   ├── SKILL.md                # 6 evolution commands
│   ├── references/             # 5 evolution reference documents
│   ├── CHANGELOG.md            # Version history
│   ├── VERSION.md              # Current: v2.1.0
│   ├── graveyard.md            # Retired rules archive
│   └── retro-*.md / benchmark-*.md  # Evolution records
├── assets/gep/                 # GEP evolution assets (local)
│   ├── genes.json              # 4 evolution genes
│   ├── capsules.json           # 2 success capsules
│   └── events.jsonl            # Evolution event log
├── memory/                     # Evolution state & session signals
├── projects/                   # Test projects
│   └── mirror-visitor/         # Pilot: psychological thriller
├── LICENSE                     # MIT
└── README.md
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/pajamadot/thriller.git

# Start a project (in Claude Code with this repo as working directory)
/start

# Or jump straight into writing with the pilot project
# Read projects/mirror-visitor/ for an example of the full workflow
```

No dependencies. Pure markdown methodology — works with any LLM that can read the SKILL.md files.

---

## Tech Specs

| Metric | Value |
|--------|-------|
| Files | 73 |
| Lines | 17000+ |
| Reference docs | 39 (17 + 10 + 7 + 5) |
| Methodology sources | 37+ |
| Sub-types supported | 9 |
| Commands | 34 (11 + 9 + 8 + 6) |
| Project templates | 6 sub-type presets |
| Quick reference cards | 3 (thriller + IF + storyboard) |
| GEP assets | 4 Genes · 2 Capsules · 3 Events |
| Evolution rounds | 30 completed |
| External dependencies | Zero |
| Language | Chinese (extensible) |
| License | MIT |
| Version | v3.0.0 |

---

## Credits

- Structure inspired by [0xsline/short-drama](https://github.com/0xsline/short-drama)
- Evolution protocol: [EvoMap GEP](https://evomap.ai) / [autogame-17/evolver](https://github.com/autogame-17/evolver)

---

## License

MIT — see [LICENSE](LICENSE)
