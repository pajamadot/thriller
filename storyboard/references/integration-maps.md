# Cross-Module Integration Maps v1.0

> Band 8 (R071-R080): Formal field-by-field bridge specifications between storyboard,
> thriller-writing, interactive-fiction, and Story Platform MCP.
>
> Supersedes the conceptual 3-mapping lists in SKILL.md section "与其他模块的集成".

---

## R071 Audit: Gap Analysis

The existing integration section in SKILL.md (lines 636-672) provides three conceptual
mapping lists with 5-7 bullet points each. The following structural gaps were identified:

| Gap | Description | Impact |
|-----|-------------|--------|
| G-INT-1 | No field-by-field mapping; mappings are prose descriptions | Ambiguous execution; different sessions produce different translations |
| G-INT-2 | No data format converter spec | Cannot automate pipeline; manual transcription required every time |
| G-INT-3 | No quality contract at boundaries | No way to validate a bridge output is "correct" |
| G-INT-4 | No branching narrative handling | Thriller-writing may output choice points; storyboard has no idiom for diverging paths |
| G-INT-5 | No collapse/expansion rules for VN pacing | Film shots and VN nodes have fundamentally different temporal granularity |
| G-INT-6 | No asset generation trigger spec | Background/portrait/music needs are identified but never queued |
| G-INT-7 | No bidirectional feedback path | Storyboard findings cannot inform script revision |
| G-INT-8 | No graph layout algorithm for MCP node positioning | Nodes dumped at (0,0) without spatial organization |

---

## R072 Research: Module Interface Summary

### thriller-writing outputs

A `/scene N` command produces a chapter markdown file with the following extractable fields:

```
chapter markdown file:
  scene_info:
    POV: string               # e.g. "叶知秋（第一人称）"
    location: string           # e.g. "叶知秋的心理咨询室 → 叶知秋的公寓"
    time: string               # e.g. "周一，下午到深夜"
    core_function: string      # e.g. "建立世界 + 引入案件 + 埋设线索C01 + 埋设红鲱鱼H01"
  body_text: string            # Full prose, may contain:
    dialogue_lines[]           #   Lines in quotation marks with speaker attribution
    internal_monologue[]       #   First-person reflections without quotes
    action_descriptions[]      #   Physical actions and environmental descriptions
    section_breaks: "---"      #   Scene-internal location/time transitions
  chapter_hook: string         # Final paragraphs after last section break
  creation_notes:
    clue_operations: string[]  # e.g. ["C01埋设", "H01埋设"]
    red_herring_ops: string[]  # e.g. ["H01 埋设（周明哲的控制型人格）"]
    suspicion_shift: string    # e.g. "周明哲 ↑"
    reader_state: string       # Expected reader reasoning at chapter end
    unreliable_markers: string # Narrative reliability signals
```

From `structure.md`, per-chapter metadata includes:

```
structure.chapter_outline[N]:
    tension_level: int (1-10)  # Column "张力" in chapter outline table
    clue_operations: string[]  # Column "线索操作"
    suspicion_shifts: string   # Column "嫌疑转移"
    core_event: string         # Column "核心事件"
```

### interactive-fiction (VN) outputs

A VN node in the interactive-fiction module has these fields:

```
vn_node:
    id: string
    type: "dialogue" | "narration" | "choice" | "transition"
    speaker: string | null
    dialogue_text: string
    narrator_mode: "first_person" | "third_person" | "omniscient"
    background_asset: string           # description or asset reference
    music_asset: string | null
    sfx: string | null
    character_positions: [
        { character_id, position: "left"|"center"|"right"|"far_left"|"far_right",
          zoom: "close"|"medium"|"far",
          expression: string,
          flip: boolean }
    ]
    transition_in: string              # "fade"|"cut"|"dissolve"|...
    focus_directives: [                # embedded insert/detail views
        { target: string, description: string }
    ]
    choice_options: [                  # only for type="choice"
        { text: string, target_node_id: string, condition?: string }
    ]
    state_changes: [                   # variable mutations
        { variable: string, operation: "set"|"add"|"toggle", value: any }
    ]
    auto_advance: boolean              # true for narration, false for dialogue
    typewriter_speed: "slow"|"normal"|"fast"
```

### Story Platform MCP: story_node schema

From the MCP server's node tools and the database schema:

```
mcp.node.create:
    content: string                  # dialogue + narration text
    node_type: string                # "dialogue"|"narration"|"choice"|"start"|"end"
    title: string
    scene_id: UUID
    character_ids: UUID[]
    location_id: UUID
    background_asset_id: UUID
    music_asset_id: UUID
    position: { x: number, y: number }  # graph editor coordinates
    metadata: JSONB                  # extensible; storyboard data goes here

mcp.connection.create:
    from_node_id: UUID
    to_node_id: UUID
    choice_text: string | null
    conditions: JSONB | null

mcp.character.get:
    → { id, name, portrait_asset_id, ... }

mcp.generation.create_image:
    → { prompt, style, aspect_ratio, ... } → asset_id

mcp.generation.create_music:
    → { mood, duration, ... } → asset_id
```

---

## Bridge 1: thriller-writing --> storyboard

### Purpose

Translate a chapter's narrative content and metadata into structured `/decompose` input,
producing a storyboard sequence that preserves all thriller-specific information
(clues, red herrings, suspicion shifts, unreliable narration markers).

### Input Format

```
Source: projects/<project>/chapters/chNNN.md
        + projects/<project>/structure.md (for tension_level, clue_operations)
        + projects/<project>/characters.md (for character profiles, suspicion matrix)
```

### Field-by-Field Mapping Table

| # | Source Field | Storyboard Target | Transformation Rule | Validation |
|---|-------------|-------------------|---------------------|------------|
| B1-01 | `scene_info.POV` | `/decompose` viewpoint parameter + per-shot `logic.viewpoint` | `"第一人称"` → primary viewpoint = `character_adjacent` with POV inserts for discovery moments; `"第三人称"` → `omniscient` with selective `character_adjacent`; `"多视角"` → viewpoint annotated per section between `---` breaks | Every shot must have a `logic.viewpoint` value; POV shots must not exceed 30% of total unless style=hitchcock |
| B1-02 | `scene_info.location` | Establishing shot design + spatial model for `/blocking` | Single location → 1 establishing shot (ELS/LS); `"A → B"` transition format → section break triggers new establishing sequence; each location gets a spatial model (room dimensions, key furniture, entry points) for blocking consistency | Every location must have >= 1 establishing shot; location transitions must have >= 1 transition beat |
| B1-03 | `scene_info.time` | Color temperature baseline + lighting preset in `composition` annotations | Time-of-day mapping: `早上` → warm yellow (5500K+); `下午` → neutral warm (4500K); `傍晚` → amber/orange (3500K); `夜/深夜` → cool blue-tungsten (3200K interior / 5600K moonlight); `"下午到深夜"` range → gradual color temperature shift across sequence | Color temperature must be noted in first establishing shot; shifts must correlate with section breaks |
| B1-04 | `scene_info.core_function` | Storyboard macro-structure and beat allocation | Parse function list: `"建立世界"` → allocate 20-30% of shots to environment/character establishment; `"引入案件"` → ensure at least one reveal beat with gravity >= 4; `"埋设线索X"` → trigger B1-06 clue mapping; `"埋设红鲱鱼X"` → trigger B1-07 red herring mapping | Each declared function must map to >= 1 shot with explicit annotation |
| B1-05 | `body_text` (full prose) | Beat decomposition input for `/decompose` Step 2 | Section breaks (`---`) → scene-internal location/time transitions, each section = separate decomposition pass; paragraphs → candidate beat boundaries; dialogue lines → shot-reverse-shot idiom candidates; internal monologue → Internal Monologue Visualization idiom; action descriptions → action beat shots | Output beat count should be 1.5-3x the paragraph count (not 1:1 with sentences) |
| B1-06 | `creation_notes.clue_operations` | Shot `logic.provides` and `logic.raises` annotations | Parse operation type: `"C01 埋设/plant"` → at least one shot must PROVIDE C01 information; prefer background placement (LS/FS) for fair-play; character's gaze must NOT point at clue; clue should sit on rule-of-thirds intersection; `"C01 激活/activate"` → shot must use CU/INSERT to foreground the clue; `"C01 呈现/reveal"` → ECU or dedicated reveal sequence idiom; `"C01 回溯/retrospect"` → flash-cut montage (理性蒙太奇) referencing original plant shot | Each clue op must map to >= 1 shot; plant shots must have `PROVIDES: "C{id} visual presence"` and must NOT have director_notes calling attention to clue |
| B1-07 | `creation_notes.red_herring_ops` | Misdirection shot design | `"H01 埋设"` → shot must RAISE suspicion about H01 target using: emphasis shots (CU on suspect's reaction), suggestive angle (slightly LOW on suspect = authority/threat), or suspicious insert (suspect's possessions/behavior); `"H01 激活"` → escalate: more CU, lower angles, possibly DUTCH for unease; `"H01 消解"` → reverse: return to EYE angle, pull back to MS/LS, possibly OTS showing suspect in sympathetic framing | Each H-op must map to >= 2 shots (primary + reinforcement); suspicion direction must be consistent within a scene |
| B1-08 | `creation_notes.suspicion_shift` | Angle and framing progression across scene | Parse direction: `"character_name ↑"` → progressive angle lowering on suspect across scene (EYE → slight LOW → LOW), with shot sizes narrowing (MS → MCU → CU); `"character_name ↓"` → progressive angle raising (LOW → EYE → slight HIGH), shot sizes widening (CU → MS → LS); `"character_name ↑↑"` → faster progression + add DUTCH or threatening composition; neutral/no shift → maintain consistent EYE angles throughout | Angle progression must be monotonic within scene (no reversals unless justified by script event); must affect >= 3 shots |
| B1-09 | `chapter_hook` (last section) | Final 3-5 shots must create tension/cliffhanger | Map to one of three hook patterns: **Reveal Hook** → progressive reveal idiom ending on CU/ECU of disturbing detail (hold 6-10s); **Question Hook** → end on character's face with unanswered RAISES; **Dread Hook** → end on environmental detail (INSERT) that contradicts character's narration, with silence or single SFX | Last shot must have `narrative_gravity >= 3`; final shot duration must be >= 5s; must contain at least one RAISES |
| B1-10 | `structure.tension_level` (1-10) | Rhythm pattern selection for entire scene | `1-3` → Breathe pattern (long-short alternation, average shot duration 5-7s, low energy); `4-6` → Breathe→Accelerando (start relaxed, progressively shorten shots in final third); `7-8` → Accelerando→Burst (progressive shortening → rapid-fire sequence → fermata hold); `9-10` → Burst→Fermata (start intense, rapid cuts, end on extended static shot >= 8s) | Rhythm pattern must be declared in storyboard header; actual shot duration statistics must match pattern profile |
| B1-11 | `body_text.dialogue_lines` | Shot-reverse-shot idiom with CU escalation | Default: Master shot (MS two-shot) → OTS-A / OTS-B alternation; **CU Escalation Trigger**: lines containing emotional revelation, accusation, or key information → break from OTS to direct CU; lines containing the chapter's core clue → INSERT or POV after the line; `>= 6` consecutive dialogue exchanges → mandatory reframing or blocking change to prevent visual monotony | CU escalation points must correlate with beat gravity >= 3; no more than 4 consecutive OTS shots without variation |
| B1-12 | `body_text.internal_monologue` | Internal Monologue Visualization idiom | Map to one of: **Voiceover + Environmental** → VO narration over environmental shots (character absent or in LS); **Voiceover + Reaction** → VO over CU/ECU of character's face (eyes, hands); **Subjective Camera** → POV shots with VO, camera movement reflects emotional state (HANDHELD for anxiety, STEADY for cold analysis, PUSH for approaching realization); for unreliable narrator: add subtle DUTCH tilt or slight color desaturation during self-deceptive passages | Internal monologue must not be rendered as simple "talking head"; VO passages > 3 sentences must have visual variety (>= 2 different shot setups) |
| B1-13 | `body_text.action_descriptions` | Action beat shots | Physical movement → TRACK or STEADY follow; entering/exiting space → shot size transition (LS→MS on entry, MS→LS on exit); object manipulation → INSERT for key objects, MS for mundane actions; environmental description → establishing or re-establishing shot | Action beats must have camera movement matching action energy |
| B1-14 | `creation_notes.unreliable_markers` | Subtle visual unreliability signals | Self-deceptive rationalization (e.g., "大概是吧") → micro-composition cues: slight frame asymmetry, character slightly off-center, barely perceptible color shift (1-2% desaturation); memory gap narration → DISSOLVE or JCUT transition with fractional time skip; contradictory physical evidence (e.g., muddy shoes) → INSERT with extended hold (fair-play: let audience see what narrator dismisses) | Unreliability signals must be subtle enough to miss on first viewing but identifiable on re-viewing; must not use obvious techniques (DUTCH, extreme color) for planted unreliability |
| B1-15 | `section_breaks ("---")` | Scene-internal transitions | Each `---` triggers: (a) transition beat (FADE, DISSOLVE, or time-lapse montage depending on time gap); (b) new establishing shot for new location/time; (c) reset of blocking model; (d) potential rhythm pattern shift if tension_level changes across sections | Must produce >= 2 shots per transition (transition + re-establishment) |

### Thriller-Specific Enrichments

Beyond the field mappings, Bridge 1 applies these thriller-genre overlays:

```
Fair-Play Constraint:
  Every clue marked as "植入/plant" must be visually present in at least
  one shot where the audience CAN see it, even if the character ignores it.
  Validation: shot exists where PROVIDES contains C{id} AND
              director_notes do NOT explicitly call attention to it AND
              shot_size is >= MS (not CU/INSERT which would be too obvious).

Unreliable Narrator Overlay:
  When POV character is flagged as unreliable (characters.md: "不可靠类型"):
    - All POV shots carry implicit caveat: "this may not be what happened"
    - Memory-narrated sequences use DISSOLVE transitions (not CUT)
    - Rationalization dialogue gets micro-DUTCH (2-3 degrees, not full DUTCH)
    - Time gaps in narration → hard CUT with ambient sound discontinuity

Suspicion Accumulation:
  Across chapters (not just within one), angle/framing for each suspect
  must follow the suspicion_index curve from structure.md:
    ch1: 周明哲 ↑   → LOW angle introduced
    ch2: 周明哲 ↑↑  → lower angle, tighter framing
    ch3: 周明哲 ↑↑↑ → extreme LOW, near-DUTCH
    ch4: 周明哲 ↓   → return to EYE, wider framing (innocence revealed)
  This cross-chapter tracking requires a persistent suspect-framing register.
```

### Quality Contract: Bridge 1

A Bridge 1 output (storyboard sequence) is valid if and only if:

```
B1-QC-01: Every clue_operation in creation_notes maps to >= 1 shot
           with corresponding PROVIDES/RAISES annotation.
B1-QC-02: Every red_herring_op maps to >= 2 shots with suspicion-direction
           consistent angle/framing.
B1-QC-03: Tension_level and actual rhythm pattern are congruent
           (measured by shot duration distribution matching declared pattern).
B1-QC-04: Chapter_hook maps to final 3-5 shots with gravity >= 3 and
           at least one open RAISES.
B1-QC-05: All location transitions from scene_info produce establishing shots.
B1-QC-06: Internal monologue passages do not produce "talking head" sequences
           (>= 2 visual setups per VO passage of 3+ sentences).
B1-QC-07: Unreliable narrator markers produce subtle (not overt) visual cues.
B1-QC-08: POV consistency: viewpoint does not shift without script justification.
B1-QC-09: Beat count is 1.5-3x paragraph count (not 1:1 sentence mapping).
B1-QC-10: All 6 quality metrics from /score pass minimum thresholds:
           information_efficiency > 0.8, cut_justification = 1.0,
           dependency_completeness = 1.0, rhythm_variance 1.5-4.0s,
           idiom_coverage 0.6-0.9, shot_size_entropy > 2.0 bits.
```

---

## Bridge 2: storyboard --> interactive-fiction (VN nodes)

### Purpose

Translate a storyboard JSON (output of `/board --format json`) into a sequence of
VN node directives that can be played in a visual novel engine. This bridge must
handle the fundamental pacing difference: film cuts every 2-8 seconds; VN advances
on player click, typically every 1-3 sentences.

### Input Format

```
Source: /board --format json output (see SKILL.md JSON Schema, lines 496-560)
```

### Collapse Rules (shots --> VN nodes)

Before field mapping, multiple shots must be collapsed into single VN nodes.
Film has higher temporal granularity than VN; direct 1:1 mapping produces
unplayable rapid-fire nodes.

```
COLLAPSE RULE C2-01: Same-Background Merge
  IF   shot[i].composition.background == shot[i+1].composition.background
  AND  shot[i].blocking_notes references same character set as shot[i+1]
  AND  neither shot is an INSERT
  THEN merge into single VN node
  KEEP the tighter shot_size (more intimate) for character zoom
  CONCAT dialogue/narration text

COLLAPSE RULE C2-02: Shot-Reverse-Shot Collapse
  IF   shots [i..i+N] form a shot_reverse_shot idiom (logic.idiom == "shot_reverse_shot")
  THEN collapse entire sequence into single VN dialogue node
  MAP  each shot's dialogue to sequential speaker lines within the node
  MARK CU escalation points as emphasis markers (bold or shake effect)

COLLAPSE RULE C2-03: INSERT Embedding
  IF   shot[i].shot_size == "INSERT"
  AND  shot[i-1] exists and is not an INSERT
  THEN embed shot[i] as a focus_directive within the previous node's VN node
  MAP  INSERT composition.midground → focus_directive.description

COLLAPSE RULE C2-04: Establishing Shot Absorption
  IF   shot[i].beat_type == "transition" AND shot_size in ["ELS", "LS"]
  AND  shot[i] is the first shot in a new location
  THEN convert to a VN background-change directive (not a dialogue node)
  MAP  composition → new background_asset description
  MAP  sound.ambient + sound.music → ambient/music change directives

COLLAPSE RULE C2-05: Reaction Chain Preservation
  IF   shots [i..i+N] form a reaction_chain idiom
  THEN keep as separate VN nodes (one per character reaction)
  REASON: player needs time to read each character's reaction

COLLAPSE RULE C2-06: Montage Compression
  IF   shots [i..i+N] are connected by montage_type != null
  AND  total narrative content < 2 sentences
  THEN collapse into single VN narration node with transition effect
  MAP  montage_type → VN transition: metric/rhythmic → "flash",
       tonal → "dissolve", overtonal → "crossfade", intellectual → "cut"
```

### Expansion Rules (storyboard --> VN additions)

Some VN-specific elements have no storyboard equivalent and must be generated:

```
EXPAND RULE E2-01: Choice Point Insertion
  IF   storyboard contains a beat with logic.raises that presents
       a decision the POV character is contemplating
  AND  the project's structure.md indicates this is a branching point
  THEN generate a VN choice node after the contemplation node
  MAP  each choice option → target branch storyboard sequence

EXPAND RULE E2-02: Save Point Markers
  IF   VN node is the first node after a scene transition (new background)
  THEN mark as auto_save_point = true

EXPAND RULE E2-03: Character Entry/Exit Animations
  IF   a character appears in shot[i].blocking_notes but not in shot[i-1]
  THEN add character_enter animation to VN node
  IF   a character appears in shot[i-1] but not in shot[i]
  THEN add character_exit animation to preceding VN node
```

### Field-by-Field Mapping Table

| # | Storyboard Field (JSON path) | VN Node Field | Transformation Rule |
|---|------------------------------|---------------|---------------------|
| B2-01 | `shot.composition.background` | `vn_node.background_asset` | Extract background description; if background changes from previous shot group → new background directive; include lighting/color temperature from composition annotations; format as generation prompt: `"{location}, {time_of_day}, {mood}, {lighting}"` |
| B2-02 | `shot.sound.music` | `vn_node.music_asset` | `MUS: description` → music asset description; `null` or unchanged → inherit from previous node; music change → crossfade directive with 2s default transition |
| B2-03 | `shot.sound.ambient` | VN ambient layer | `AMB: description` → ambient sound loop; layered with music; changes on scene transitions |
| B2-04 | `shot.sound.sfx` | `vn_node.sfx` | `SFX: description` → one-shot sound effect; timed to appear at node display start or at specific text position (if dialogue-synced) |
| B2-05 | `shot.sound.silence_seconds` | VN pause directive | `SIL: Ns` → insert N-second pause before next text; screen may dim slightly |
| B2-06 | `shot.camera_angle` + `shot.shot_size` | `character_positions[].zoom` + `character_positions[].position` | Combined mapping matrix (see below) |
| B2-07 | `shot.sound.dialogue` | `vn_node.dialogue_text` + `vn_node.speaker` | `DIA: "text"` → dialogue with speaker extracted from blocking_notes; quotation marks stripped; speaker name from character in midground/foreground of composition |
| B2-08 | `shot.sound.voiceover` | `vn_node.dialogue_text` + narrator mode | `VO: "text"` → narration text; `narrator_mode: "first_person"`; no speaker portrait (or translucent overlay); typewriter_speed: "slow" for contemplative VO |
| B2-09 | `shot.logic.viewpoint` | `vn_node.narrator_mode` | `character_pov` → `"first_person"`; `character_adjacent` → `"first_person"` (VN default for close-third); `omniscient` → `"third_person"`; `hidden_voyeur` → `"third_person"` + screen edge vignette effect |
| B2-10 | `shot.blocking_notes` | `vn_node.character_positions[]` | Parse character names and spatial positions; map to VN screen positions (see Position Mapping below); include expressions derived from beat_type and narrative context |
| B2-11 | `shot.transition_in` | `vn_node.transition_in` | `CUT` → `"cut"`; `FADE` → `"fade"`; `DISSOLVE` → `"dissolve"`; `MATCH/GMATCH` → `"cut"` (VN has no match-cut; note in metadata); `JCUT` → `"cut"` + screen_shake or flash; `L/J` → `"cut"` (sound handled separately); `INVIS` → `"cut"` |
| B2-12 | `shot.duration_seconds` | `vn_node.typewriter_speed` | `< 3s` → `"fast"`; `3-6s` → `"normal"`; `> 6s` → `"slow"`; affects text reveal pacing to mirror intended shot duration |
| B2-13 | `shot.narrative_gravity` | VN emphasis effects | `5` → screen_shake + font_size increase or flash; `4` → slight zoom + emphasis sound; `3` → normal with bold text markers; `1-2` → normal, auto_advance eligible |
| B2-14 | `shot.logic.raises` | VN suspense markers | If RAISES contains unresolved question → add `"..."` pause beat or dim-screen effect; if RAISES at chapter end → "To be continued" overlay eligible |
| B2-15 | `shot.montage_type` (intellectual) | VN flash-sequence | Intellectual montage → rapid image sequence (0.5s per image, auto-advance) showing recalled clue images |

### Camera-to-VN Position Matrix (B2-06 detail)

```
Shot Size + Camera Angle → VN Zoom + Position

                    EYE          HIGH         LOW          OTS          POV
  ELS/LS      far/center     far/center   far/center      --           --
  FS          far/center     far/center   far/center      --           --
  MS       medium/center  medium/center medium/center  medium/L|R       --
  MCU      medium/center  medium/center medium/center  medium/L|R       --
  CU       close/center   close/center  close/center   close/L|R       --
  ECU      close/center   close/center  close/center       --           --
  INSERT        --              --           --             --    [focus_directive]

OTS position logic:
  Speaker on camera-left in storyboard → position: "right" in VN (facing left)
  Speaker on camera-right → position: "left" (facing right)
  Reverse shot → swap positions

POV shots:
  No character sprite displayed; background becomes "what character sees"
  Any INSERT in POV → focus_directive overlay
```

### Expression Mapping (derived from beat context)

```
beat_type + narrative_gravity → character expression suggestion

  action (1-2)    → "neutral" or "determined"
  action (3-5)    → "serious" or "alarmed"
  reaction (1-2)  → "thoughtful" or "curious"
  reaction (3-4)  → "surprised" or "concerned"
  reaction (5)    → "shocked" or "horrified"
  reveal (any)    → "surprised" → "realization" (two-phase)
  turn (any)      → "conflicted" or "decisive"
  tension (any)   → "anxious" or "fearful"
  release (any)   → "relieved" or "sad_smile"
  transition      → "neutral"

These are suggestions; actual expressions should be refined based on
dialogue content and character personality from characters.md.
```

### Branching Scene Handling

When the storyboard encounters a narrative branch point (from interactive-fiction
module or structure.md choice annotations):

```
BRANCH RULE BR-01: Choice Divergence
  A storyboard sequence leading to a choice produces:
    1. Linear VN nodes up to the decision point
    2. A VN choice node with options
    3. Separate storyboard sequences for each branch
       (each branch runs through Bridge 2 independently)

BRANCH RULE BR-02: Convergence
  When branches reconverge to the same story node:
    Each branch's final VN node transitions to the shared continuation
    Background/music state must be normalized at convergence point

BRANCH RULE BR-03: Shared Establishing Shots
  If multiple branches occur in the same location:
    The establishing shot sequence is shared (generated once)
    Branch-specific content begins after establishment

BRANCH RULE BR-04: Suspicion-Variable Branches
  If choices affect suspicion_shift differently:
    Each branch maps B1-08 independently
    state_changes record suspicion variable mutations:
      { variable: "suspicion_zhou", operation: "add", value: 1 }
```

### Quality Contract: Bridge 2

```
B2-QC-01: No VN node contains more than 4 sentences of dialogue/narration
           (split into multiple nodes if exceeded).
B2-QC-02: Every background change produces a visible transition effect
           (not a silent swap).
B2-QC-03: Character positions are consistent within a scene
           (no teleportation without exit/enter animation).
B2-QC-04: INSERT shots are never standalone VN nodes (always embedded
           as focus_directives).
B2-QC-05: Shot-reverse-shot sequences collapse into multi-line dialogue nodes
           (not individual nodes per line).
B2-QC-06: Music and ambient sound are explicitly specified at every
           scene boundary (no undefined audio state).
B2-QC-07: At least one VN node per scene has typewriter_speed != "normal"
           (temporal variety).
B2-QC-08: Choice nodes have 2-4 options (never 1, never > 4).
B2-QC-09: Gravity-5 beats produce visible emphasis effects in VN.
B2-QC-10: Total VN node count is 30-60% of total shot count
           (collapse rules are being applied).
```

---

## Bridge 3: storyboard --> Story Platform MCP

### Purpose

Translate a storyboard JSON into a sequence of MCP tool calls that create
a playable story graph in the Story Platform, including asset generation
requests for backgrounds, character portraits, and music.

### Input Format

```
Source: /board --format json output
        + project context (project_id, story_id, existing character/location IDs)
```

### Graph Layout Algorithm

MCP nodes require `position: {x, y}` coordinates for the React Flow graph editor.
The storyboard provides a linear sequence; layout must create a readable graph.

```
LAYOUT RULE L3-01: Linear Sequence
  Nodes in a linear sequence are placed left-to-right:
    x = node_index * 300 (pixels)
    y = 0 (baseline)
  Scene transitions create a new row:
    y += 400 for each new scene

LAYOUT RULE L3-02: Choice Branching
  Choice node is placed at branch point:
    x = branch_point_index * 300
    y = current_row_y
  Each branch creates a new row:
    branch_0: y = current_row_y (continues on same row)
    branch_1: y = current_row_y + 250
    branch_2: y = current_row_y + 500
  Branch nodes continue left-to-right from the branch point x

LAYOUT RULE L3-03: Convergence
  When branches merge, convergence node is placed at:
    x = max(last_node_x across all branches) + 300
    y = original_branch_point_y (return to main row)

LAYOUT RULE L3-04: Act Boundaries
  If storyboard spans multiple acts:
    x resets to 0
    y += 600 (double scene spacing)
    Separator comment node inserted
```

### Processing Pipeline

```
Phase 1: PREPARE (ensure project entities exist)
  For each unique location in storyboard:
    → Check if location exists: mcp.location.list { story_id }
    → If not: mcp.location.create { story_id, name, description }
    → Record location_id mapping

  For each unique character in storyboard:
    → Check if character exists: mcp.character.list { story_id }
    → If not: mcp.character.create { story_id, name, bio }
    → Record character_id mapping

  For each unique scene/act boundary:
    → Check if scene exists or create: mcp.scene.add / mcp.act.create

Phase 2: GENERATE ASSETS (queue generation requests)
  → See Asset Generation Triggers section below

Phase 3: CREATE NODES (build story graph)
  → See Node Creation Mapping below

Phase 4: CREATE CONNECTIONS (link nodes)
  → See Connection Mapping below

Phase 5: VALIDATE (run story validation)
  → mcp.story.validate { story_id }
  → Check for orphan nodes, missing connections, broken references
```

### Node Creation Mapping

After applying Bridge 2 collapse rules to determine VN-level nodes (not raw shots),
each VN node maps to an MCP node:

| # | Source (collapsed VN node) | MCP Tool + Field | Transformation |
|---|---------------------------|------------------|----------------|
| B3-01 | VN node content | `mcp.node.create { content }` | Concatenate: dialogue/narration text + director_notes as HTML comment `<!-- storyboard: ... -->` |
| B3-02 | VN node type | `mcp.node.create { node_type }` | `"dialogue"` → `"dialogue"`; `"narration"` → `"narration"`; `"choice"` → `"choice"`; first node → `"start"`; last node → `"end"` |
| B3-03 | VN node title | `mcp.node.create { title }` | Generate from: `"{scene_title} - {beat_type} #{sequence_number}"` e.g., "咨询室 - 揭示 #04" |
| B3-04 | scene context | `mcp.node.create { scene_id }` | Look up from Phase 1 scene mapping |
| B3-05 | VN character_positions | `mcp.node.create { character_ids }` | Extract character IDs from Phase 1 character mapping; include all characters present in the node |
| B3-06 | VN background_asset | `mcp.node.create { background_asset_id }` | Look up from Phase 2 asset generation results; if not yet generated, use placeholder and queue |
| B3-07 | VN music_asset | `mcp.node.create { music_asset_id }` | Look up from Phase 2; only set when music changes (not on every node) |
| B3-08 | layout position | `mcp.node.create { position }` | Compute from Layout Rules L3-01 through L3-04 |
| B3-09 | storyboard shot data | `mcp.node.create { metadata.storyboard }` | Store complete shot JSON(s) that were collapsed into this node; enables round-trip editing |
| B3-10 | VN character expressions | `mcp.node.create { metadata.vn_directives }` | Store character_positions[], zoom, expressions, transition effects, focus_directives, typewriter_speed |

### Connection Mapping

```
CONNECTION RULE C3-01: Linear Sequence
  For adjacent VN nodes [i] and [i+1] in same branch:
    → mcp.connection.create {
        from_node_id: node[i].id,
        to_node_id: node[i+1].id,
        choice_text: null,
        conditions: null
      }

CONNECTION RULE C3-02: Choice Branches
  For a choice node with N options:
    → N connections, one per option:
      mcp.connection.create {
        from_node_id: choice_node.id,
        to_node_id: branch_first_node[k].id,
        choice_text: option[k].text,
        conditions: option[k].condition (if any)
      }

CONNECTION RULE C3-03: Branch Convergence
  For each branch's last node converging to a shared node:
    → mcp.connection.create {
        from_node_id: branch_last_node[k].id,
        to_node_id: convergence_node.id,
        choice_text: null,
        conditions: null
      }

CONNECTION RULE C3-04: Scene Transitions
  Between last node of scene A and first node of scene B:
    → Standard connection; transition effect stored in node metadata
```

### Asset Generation Triggers

When the storyboard describes assets that do not yet exist in the project,
generation requests are queued:

```
ASSET TRIGGER AT-01: New Background
  IF   shot.composition.background describes a location not in existing assets
  THEN queue: mcp.generation.create_image {
    prompt: "{location_name}, {time_of_day}, {mood}, {lighting_description},
             {color_temperature}, visual novel background, detailed environment,
             no characters",
    style: project_style_preset,
    aspect_ratio: "16:9",
    metadata: {
      source: "storyboard_bridge_3",
      scene_id: scene_id,
      location_id: location_id,
      time_of_day: extracted_time,
      shots_using: [shot_ids]
    }
  }
  OUTPUT: asset_id → stored for B3-06 mapping

ASSET TRIGGER AT-02: New Character Expression
  IF   character_positions[].expression is not in existing portrait set
       for that character
  THEN queue: mcp.generation.create_portrait {
    character_id: character_id,
    expression: expression_name,
    reference_asset_id: character.portrait_asset_id (base portrait),
    prompt: "{character_name}, {expression}, {outfit_description},
             consistent with reference portrait",
    metadata: {
      source: "storyboard_bridge_3",
      beat_type: originating_beat_type,
      scene_context: scene_title
    }
  }
  OUTPUT: asset_id → stored for character expression library

ASSET TRIGGER AT-03: Music Mood
  IF   shot.sound.music describes a mood not matched by existing music assets
  THEN queue: mcp.generation.create_music {
    mood: extracted_mood,
    duration: estimated_scene_duration_seconds,
    genre: "thriller_ambient" | "tension" | "revelation" | based on context,
    prompt: music_description_from_storyboard,
    metadata: {
      source: "storyboard_bridge_3",
      scene_id: scene_id,
      tension_level: scene_tension_level
    }
  }
  OUTPUT: asset_id → stored for B3-07 mapping

ASSET TRIGGER AT-04: Sound Effect
  IF   shot.sound.sfx describes a specific sound effect
  THEN queue: mcp.generation.create_sfx {
    prompt: sfx_description,
    duration: shot.duration_seconds,
    metadata: { source: "storyboard_bridge_3" }
  }
  OUTPUT: asset_id → stored in node metadata

ASSET TRIGGER AT-05: Focus Detail Image
  IF   a focus_directive (collapsed INSERT) describes a specific object
       that needs a dedicated detail image
  THEN queue: mcp.generation.create_image {
    prompt: "{object_description}, close-up detail, {lighting}, {mood}",
    aspect_ratio: "1:1" or "4:3",
    metadata: {
      source: "storyboard_bridge_3",
      type: "insert_detail",
      related_clue: clue_id (if applicable)
    }
  }
```

### Batch Optimization

To minimize API calls, Bridge 3 batches operations:

```
BATCH STRATEGY BS-01: Asset Generation First
  Queue ALL asset generation requests before creating any nodes.
  Wait for generation completion (or use placeholder IDs).
  This prevents nodes referencing non-existent assets.

BATCH STRATEGY BS-02: Node Creation in Topological Order
  Create nodes in story-flow order (start → end).
  This ensures from_node always exists before its connections.

BATCH STRATEGY BS-03: Connection Batch
  After all nodes are created, create all connections in a single pass.
  This is safe because all node IDs are known.

BATCH STRATEGY BS-04: Idempotency
  Each MCP call includes metadata.storyboard_shot_ids for deduplication.
  Re-running Bridge 3 on the same storyboard should update, not duplicate.
```

### Quality Contract: Bridge 3

```
B3-QC-01: Every node has a valid scene_id (no orphan nodes).
B3-QC-02: Every node has at least one character_id OR is type "narration"/"transition".
B3-QC-03: Graph is connected: every node is reachable from start_node.
B3-QC-04: Choice nodes have >= 2 outgoing connections with non-null choice_text.
B3-QC-05: No two nodes share the same position coordinates.
B3-QC-06: Asset generation is triggered for every new background/expression/music
           (no unresolved description-only references in final output).
B3-QC-07: metadata.storyboard field is populated on every node
           (enables round-trip editing).
B3-QC-08: Node count matches Bridge 2 collapsed VN node count
           (no accidental re-expansion).
B3-QC-09: mcp.story.validate passes with zero errors after full pipeline.
B3-QC-10: Graph layout has no overlapping nodes (minimum 200px separation).
```

---

## R075: End-to-End Pipeline Application (Mirror Visitor ch1)

### Step 1: Extract Bridge 1 Inputs from ch001.md

```
SOURCE: projects/mirror-visitor/chapters/ch001.md
        + structure.md chapter 1 row
        + characters.md

EXTRACTED INPUTS:
  scene_info:
    POV: "叶知秋（第一人称）"
    location: "叶知秋的心理咨询室 → 叶知秋的公寓"
    time: "周一，下午到深夜"
    core_function: "建立世界 + 引入案件 + 埋设线索C01 + 埋设红鲱鱼H01"

  tension_level: 4 (from structure.md)

  clue_operations: ["C01埋设"]
  red_herring_ops: ["H01 埋设"]
  suspicion_shift: "周明哲 ↑"
  unreliable_markers: "叶知秋对百乐钢笔和灰色帽衫的合理化"

  body_text sections (split by ---):
    Section A: Morning routine (公寓, 早上)
      - Internal monologue: insomnia, blank time, dust on feet, wrong pen
      - C01 plant: blank time x2, wrong pen (百乐 vs 凌美)
    Section B: Consultation (咨询室, 下午)
      - Dialogue: 叶知秋 + 林小曼, 12 dialogue exchanges
      - H01 plant: 周明哲 introduced as controlling ex-husband
      - Key revelation: stalker quotes therapy-private words
    Section C: Evening reflection (咨询室→公寓, 傍晚→深夜)
      - Internal monologue: professional catastrophe fears
      - Action: return home, discover grey hoodie
      - C01 plant: hoodie rationalization, muddy shoes
    Chapter hook: muddy shoes detail (contradicts narrator)

  characters_present: [叶知秋, 林小曼]
  characters_mentioned: [周明哲, 苏远(implicit)]
```

### Step 2: Apply Bridge 1 Mappings → Storyboard Design Directives

```
B1-01 (POV): viewpoint = character_adjacent default, POV for discovery moments
  → POV shots when: discovering dust on feet, finding wrong pen,
    seeing hoodie, noticing muddy shoes
  → character_adjacent for dialogue scenes

B1-02 (location): Two locations with transition
  → Establishing shot #1: 咨询室 exterior/interior (afternoon, warm light)
  → Establishing shot #2: 公寓 exterior (evening, cooling light)
  → Section A (公寓, morning) → actually opens the chapter, needs its own establish

  Revised location sequence:
    公寓 (morning) → 咨询室 (afternoon) → 公寓 (evening/night)
  → 3 establishing shots needed

B1-03 (time → color temperature):
  Section A morning: warm yellow 5500K
  Section B afternoon: neutral warm 4500K, interior fluorescent
  Section C evening→night: transition from amber 3500K to cool blue 3200K interior

B1-04 (core_function → beat allocation):
  "建立世界" → 20-30% establishing/environmental shots (Sections A + early B)
  "引入案件" → reveal beat >= gravity 4 (林小曼's stalker revelation)
  "C01埋设" → fair-play background placements (3 instances)
  "H01埋设" → suspicion-direction shots on 周明哲 mention

B1-06 (C01 plant → PROVIDES):
  C01-a: blank time → VO narration over DISSOLVE transition (sleep→morning)
    PROVIDES: "protagonist experiences memory gaps"
    Shot: MS of 叶知秋 in bed → DISSOLVE → alarm clock INSERT
  C01-b: wrong pen → POV INSERT of 百乐 pen in drawer
    PROVIDES: "unfamiliar object in familiar space"
    Director note: do NOT linger; character dismisses it
  C01-c: grey hoodie → POV → INSERT of hoodie on coat hook
    PROVIDES: "C01 visual presence — clothing she doesn't own"
    Fair-play: hoodie visible for 5s, character moves past it
  C01-d: muddy shoes → INSERT, final shot of chapter
    PROVIDES: "physical evidence contradicting narrator's account"
    RAISES: "did she go out last night?"

B1-07 (H01 plant → suspicion):
  H01 target: 周明哲
  Shots during 林小曼's description of ex-husband:
    - CU on 叶知秋 writing name "周明哲" (INSERT of notebook)
    - Slight LOW angle on 叶知秋's face as she analyzes (transferred threat)
    - VO analysis of "控制型人格" with clinical authority
  RAISES: "周明哲 is the stalker"

B1-08 (suspicion_shift 周明哲 ↑):
  Angle progression: only 周明哲 is mentioned, not shown
  → Transfer to叶知秋's analytical shots: her angle stays EYE (she's the detective)
  → INSERT shots of 周明哲-related information get slightly dramatic treatment

B1-09 (chapter_hook → final shots):
  Last 5 shots:
    1. MS: 叶知秋 sits at desk, VO about 周明哲 (distracted analysis)
    2. MCU: consciousness fading (eyelids heavy) — DISSOLVE
    3. INSERT: alarm clock showing 7:00 AM (morning, time jump)
    4. CU: 叶知秋's face, sitting on bed edge, looking down
    5. INSERT: muddy shoes (HOLD 6s, SIL, ambient hum only)
  RAISES: "Where did she go? Why doesn't she remember?"

B1-10 (tension_level 4 → rhythm):
  Pattern: Breathe → Accelerando
  Sections A+B: breathing pattern (long-short alternation, 5-7s average)
  Section C: accelerando (shots progressively shorter toward chapter hook)

B1-14 (unreliable markers):
  "大概是吧" (rationalization) → micro off-center framing
  "可能是去年买的" → slight desaturation (2%)
  Memory gap narration → DISSOLVE (not CUT)
```

### Step 3: Generate Storyboard Sequence (abbreviated)

```
SCENE: Mirror Visitor Ch.1

Shot#  Beat       Size   Angle  Move    Duration  Gravity  Key Content
----   ----       ----   -----  ----    --------  -------  -----------
01     transition ELS    EYE    STEADY  4s        1        公寓楼外景, 晨光
02     transition MS     EYE    PUSH    3s        1        走廊→门, 框中框
03     action     MCU    EYE    STATIC  4s        2        叶知秋醒来, 疲惫
04     reaction   CU     EYE    STATIC  5s        2        VO: 不是失眠, 更奇怪
05     reveal     POV→IN POV    PUSH    4s        3        脚底灰 INSERT (C01-a)
06     reaction   CU     EYE    STATIC  3s        2        合理化: "白天踩的吧"
07     reveal     POV    POV    STATIC  3s        3        抽屉中百乐钢笔 (C01-b)
08     reaction   MCU    EYE    STATIC  2s        2        困惑→忽略

--- TRANSITION: FADE (morning → afternoon) ---

09     transition LS     EYE    CRANE_DN 4s       1        咨询室外景→内景
10     action     MS     EYE    STATIC  3s        1        叶知秋整理记录
11     action     MS     EYE    TRACK   3s        2        林小曼推门进入
12     reaction   MCU    EYE    STATIC  4s        2        叶知秋观察: 化妆, 青黑
13     reveal     CU     EYE    STATIC  5s        4        "有人在跟踪我" ★
14     reaction   CU     EYE    STATIC  3s        3        叶知秋放下笔记本
15-22  SRS idiom  OTS×8  OTS    STATIC  3-4s ea   2-3     对话: 跟踪细节
23     reveal     CU     EYE    PUSH    6s        5        "你妈妈说得对..." ★★
24     reaction   ECU    EYE    STATIC  4s        4        叶知秋: 空气冷了一秒
25     tension    CU     EYE    STATIC  5s        3        VO: 泄露咨询记录
26-29  SRS idiom  OTS×4  OTS    STATIC  3s ea     2        对话: 周明哲信息
30     reveal     INSERT EYE    STATIC  3s        3        笔记本: "周明哲" (H01)
31     reaction   MCU    EYE    STATIC  4s        3        VO: 控制型人格分析

--- TRANSITION: DISSOLVE (afternoon → evening) ---

32     transition LS     EYE    PULL    5s        1        咨询室, 窗外天暗
33     tension    MCU    EYE    STATIC  6s        3        VO: 职业灾难恐惧
34     action     MS     EYE    TRACK   3s        1        叶知秋离开咨询室

--- TRANSITION: CUT (exterior travel implied) ---

35     transition ELS    EYE    STEADY  4s        1        公寓楼外景, 夜
36     action     MS     EYE    PUSH    3s        1        进门, 挂大衣
37     reveal     CU→IN  EYE    PUSH    5s        3        帽衫 INSERT (C01-c)
38     reaction   MCU    EYE    STATIC  3s        2        "那是我的吗？大概是吧"

--- ACCELERANDO begins ---

39     action     MS     EYE    STATIC  4s        2        烧水, 泡茶, 坐下
40     tension    MCU    EYE    STATIC  5s        3        VO: 分析周明哲动机
41     tension    CU     EYE    PUSH    4s        3        VO: "怎么拿到咨询内容？"
42     reaction   CU     EYE    STATIC  3s        2        意识模糊 (DISSOLVE预备)
43     transition --     --     --      2s        1        DISSOLVE: 夜→晨
44     reveal     INSERT EYE    STATIC  2s        2        闹钟 7:00 AM
45     reaction   CU     EYE    STATIC  4s        2        又一个被擦掉的夜晚
46     reveal     INSERT EYE    STATIC  6s        4        鞋子泥点 HOLD (C01-d) ★

Total: 46 shots, ~165s estimated
Rhythm: Breathe (shots 1-31) → Accelerando (shots 32-46)
```

### Step 4: Apply Bridge 2 → VN Node Directives (abbreviated)

```
Applying collapse rules to 46 shots → ~22 VN nodes:

VN#  Type        Source Shots  Content Summary
---  ----        ------------  ---------------
V01  narration   01-02 (C2-01) BG: 公寓楼外景晨光. 走廊进入.
V02  narration   03-04 (C2-01) 叶知秋醒来. VO: 不是失眠...
V03  narration   05-06 (C2-03) 脚底灰 [focus: 灰尘]. 合理化.
V04  narration   07-08 (C2-03) 百乐钢笔 [focus: 笔]. 忽略.
V05  transition  09    (C2-04) BG CHANGE: 咨询室. FADE transition.
V06  narration   10    (---)   整理记录.
V07  dialogue    11-12 (C2-01) 林小曼进入. 叶知秋观察.
V08  dialogue    13-14 (C2-01) "有人在跟踪我" + 叶知秋反应. emphasis: shake.
V09  dialogue    15-22 (C2-02) Shot-reverse-shot collapsed. 8 exchanges.
V10  dialogue    23-24 (C2-01) "你妈妈说得对..." gravity5: screen_shake + flash.
V11  narration   25    (---)   VO: 泄露咨询记录恐惧.
V12  dialogue    26-29 (C2-02) 周明哲信息 dialogue.
V13  narration   30-31 (C2-03) [focus: 笔记本"周明哲"]. VO分析.
V14  transition  32    (C2-04) BG stays but: window darkens. DISSOLVE.
V15  narration   33-34 (C2-01) VO: 职业恐惧. 离开咨询室.
V16  transition  35    (C2-04) BG CHANGE: 公寓夜景. CUT.
V17  narration   36    (---)   进门挂大衣.
V18  narration   37-38 (C2-03) [focus: 灰色帽衫]. "大概是吧."
V19  narration   39-41 (C2-01) 泡茶. VO: 分析. 疑问盘旋.
V20  narration   42-43 (C2-06) 意识模糊. DISSOLVE. (montage transition)
V21  narration   44-45 (C2-01) 闹钟. 又一个空白夜晚.
V22  narration   46    (---)   [focus: 泥鞋 HOLD]. SIL. typewriter: slow.

Collapse ratio: 46 shots → 22 VN nodes = 48% (within B2-QC-10 range of 30-60%)

Sample VN Node (V10 - gravity 5 peak moment):
{
  "id": "v10",
  "type": "dialogue",
  "speaker": "林小曼",
  "dialogue_text": "他说：'你妈妈说得对，你确实不值得被爱。'",
  "narrator_mode": "first_person",
  "background_asset": "counseling_room_afternoon_warm_neutral_4500K",
  "music_asset": null,
  "sfx": null,
  "character_positions": [
    { "character_id": "lin_xiaoman", "position": "center",
      "zoom": "close", "expression": "fearful", "flip": false },
    { "character_id": "ye_zhiqiu", "position": "right",
      "zoom": "close", "expression": "shocked", "flip": true }
  ],
  "transition_in": "cut",
  "focus_directives": [],
  "state_changes": [],
  "auto_advance": false,
  "typewriter_speed": "slow",
  "emphasis": { "screen_shake": true, "flash": "white_0.1s" }
}

Sample VN Node (V22 - chapter hook):
{
  "id": "v22",
  "type": "narration",
  "speaker": null,
  "dialogue_text": "但鞋子上有新鲜的泥点。",
  "narrator_mode": "first_person",
  "background_asset": "apartment_bedroom_morning_cool_blue_5600K",
  "music_asset": null,
  "sfx": null,
  "character_positions": [],
  "transition_in": "cut",
  "focus_directives": [
    { "target": "muddy_shoes", "description": "一双鞋，鞋底和侧面有新鲜泥点，与干净的室内形成对比" }
  ],
  "state_changes": [
    { "variable": "clue_C01_exposure", "operation": "add", "value": 1 }
  ],
  "auto_advance": false,
  "typewriter_speed": "slow",
  "emphasis": { "hold_seconds": 6, "ambient_fade_to_silence": true }
}
```

### Step 5: Apply Bridge 3 → MCP Tool Calls (abbreviated)

```
Phase 1 PREPARE:
  mcp.location.create { name: "叶知秋的公寓", description: "老公寓..." }  → loc_apt
  mcp.location.create { name: "心理咨询室", description: "独立执业..." }   → loc_office

Phase 2 GENERATE ASSETS:
  mcp.generation.create_image { prompt: "老公寓楼外景, 清晨, 暖黄光,
    城市住宅区, 一扇窗亮着灯, VN背景, 16:9" }                           → bg_apt_morning
  mcp.generation.create_image { prompt: "心理咨询室内景, 下午自然光,
    沙发和书架, 温暖中性光, VN背景, 16:9" }                              → bg_office_afternoon
  mcp.generation.create_image { prompt: "老公寓楼外景, 夜晚, 冷蓝光,
    路灯, 孤独氛围, VN背景, 16:9" }                                     → bg_apt_night
  mcp.generation.create_image { prompt: "公寓卧室内景, 早晨, 柔和晨光,
    简约陈设, VN背景, 16:9" }                                           → bg_apt_bedroom
  mcp.generation.create_portrait { character: 叶知秋, expression: "tired" }
  mcp.generation.create_portrait { character: 叶知秋, expression: "shocked" }
  mcp.generation.create_portrait { character: 叶知秋, expression: "analytical" }
  mcp.generation.create_portrait { character: 林小曼, expression: "fearful" }
  mcp.generation.create_portrait { character: 林小曼, expression: "nervous" }

Phase 3 CREATE NODES (22 nodes):
  mcp.node.create {
    content: "我又没有睡好...",
    node_type: "start",
    title: "公寓 - 过渡 #01",
    scene_id: scene_ch1,
    character_ids: [叶知秋_id],
    background_asset_id: bg_apt_morning,
    position: { x: 0, y: 0 },
    metadata: { storyboard: { shots: [1,2], ... }, vn: { ... } }
  }
  ... (20 more nodes)
  mcp.node.create {
    content: "但鞋子上有新鲜的泥点。",
    node_type: "end",
    title: "公寓 - 揭示 #22",
    scene_id: scene_ch1,
    character_ids: [],
    background_asset_id: bg_apt_bedroom,
    position: { x: 6300, y: 0 },
    metadata: {
      storyboard: { shots: [46], clue: "C01-d" },
      vn: { focus: "muddy_shoes", hold: 6, emphasis: "silence" }
    }
  }

Phase 4 CREATE CONNECTIONS (21 linear connections):
  mcp.connection.create { from: node_v01, to: node_v02 }
  mcp.connection.create { from: node_v02, to: node_v03 }
  ... (19 more)

Phase 5 VALIDATE:
  mcp.story.validate { story_id } → expect 0 errors
```

---

## R076-R078: Refinements and Bidirectional Feedback

### Bidirectional Link: Storyboard --> Script Revision

Bridge 1 is not one-way. Storyboard analysis can reveal script issues that
should be fed back to thriller-writing for revision:

```
FEEDBACK RULE FB-01: Missing Visual Anchor
  IF   a clue_operation has no concrete visual object in the script
       (e.g., "C04 plant: 叶知秋的记忆空白" — abstract concept)
  THEN feed back to thriller-writing:
       "Clue C04 needs a physical anchor for visual plant.
        Suggestion: add a concrete object that represents the memory gap
        (e.g., a journal with missing pages, a clock showing wrong time)"

FEEDBACK RULE FB-02: Dialogue Imbalance
  IF   shot-reverse-shot decomposition reveals > 10 consecutive exchanges
       without action/reaction interruption
  THEN feed back: "Scene has long unbroken dialogue block (exchanges 15-22).
       Suggest adding physical action or environmental interruption
       to create visual variety."

FEEDBACK RULE FB-03: Spatial Impossibility
  IF   blocking analysis reveals character positions that are
       physically impossible given the described space
  THEN feed back: "Location description needs spatial clarification.
       咨询室 layout unclear: where is the door relative to the sofa?
       Blocking requires entry path specification."

FEEDBACK RULE FB-04: Pacing Mismatch
  IF   tension_level says 4 but script content reads as 7+
       (too many reveals/turns packed into one scene)
  THEN feed back: "Tension content exceeds declared level.
       Either adjust structure.md tension to match,
       or redistribute reveals across chapters."

FEEDBACK RULE FB-05: Missing Transition Content
  IF   a section break ("---") implies a location/time change
       but the script provides no transitional text
  THEN feed back: "Section break between 咨询室 and 公寓 needs
       at least one sentence of transitional action for storyboard
       to generate a motivated scene change."
```

### Bidirectional Link: VN Feedback --> Storyboard Revision

Bridge 2 outputs can also feed back to the storyboard:

```
FEEDBACK RULE FB-06: Over-Collapsed Content
  IF   Bridge 2 collapse produces a VN node with > 4 sentences
       AND the original shots were distinct beats
  THEN feed back to storyboard: "Shots {ids} have distinct beats but
       identical backgrounds. Consider varying composition (foreground
       elements, lighting shift) to justify keeping as separate VN nodes."

FEEDBACK RULE FB-07: Expression Gap
  IF   Bridge 2 requires a character expression that has no clear
       mapping from the storyboard beat context
  THEN feed back: "Shot {id} needs explicit emotional annotation
       for character expression generation. Current beat_type '{type}'
       is ambiguous for VN portrait selection."

FEEDBACK RULE FB-08: Interactive Opportunity
  IF   storyboard contains a contemplation beat (VO with RAISES)
       that could naturally become a player choice
  THEN feed back: "Shot {id} contains decision-point potential.
       Consider marking as branching point in structure for
       interactive-fiction module."
```

---

## R079: Stress Test — Branching Scene

Testing bridges with a hypothetical branching scene from ch4 (mid-point):

```
SCENARIO: Chapter 4, 叶知秋 confronts 周明哲
  Structure: 周明哲 has unbreakable alibi → H01 dissolved
  This is a potential branching point in VN adaptation

BRANCH POINT: After 周明哲 presents his alibi evidence
  Option A: "我相信你" (I believe you) → fast H01 dissolution
  Option B: "证据可以伪造" (Evidence can be faked) → slower dissolution + extra scene
  Option C: [Hidden, requires clue_C01_exposure >= 3]
            "那天晚上我也不记得自己在哪" → early self-doubt path

BRIDGE 1 IMPACT:
  Each branch needs independent storyboard sequence
  Branch A: 3-4 shots, relief beats, angles return to EYE on 周明哲
  Branch B: 6-8 shots, continued tension, 周明哲 angle stays LOW
  Branch C: 4-5 shots, internal crisis, DUTCH on 叶知秋, self-focused

BRIDGE 2 IMPACT:
  Choice node generated with 2-3 options
  Branch A: ~2 VN nodes (short acceptance)
  Branch B: ~4 VN nodes (extended interrogation)
  Branch C: ~3 VN nodes (inner turmoil) + state_change: self_doubt += 2
  All branches converge at: 叶知秋 leaving 周明哲's workplace

BRIDGE 3 IMPACT:
  Graph layout:
    ...→ [choice_node at x=2400, y=0]
         ├→ Branch A: nodes at y=0 (x=2700, 3000)
         ├→ Branch B: nodes at y=250 (x=2700, 3000, 3300, 3600)
         └→ Branch C: nodes at y=500 (x=2700, 3000, 3300)
    All → [convergence at x=3900, y=0]

  Additional assets needed:
    Branch B: new bg "周明哲's office_tense_variant" (redder lighting)
    Branch C:叶知秋 expression "self_doubt" (new portrait)

VALIDATION:
  B2-QC-08: Choice has 2-3 options ✓ (3 if C01 threshold met, else 2)
  B3-QC-04: Choice node has >= 2 connections with choice_text ✓
  B3-QC-03: All nodes reachable from start ✓
  B3-QC-05: No position overlap (250px vertical separation) ✓
```

---

## R080: Codification — Integration Protocol Summary

### When to Apply Each Bridge

```
PROTOCOL: Full Pipeline (recommended for new chapters)
  1. thriller-writing: /scene N → chapter markdown
  2. Bridge 1: chapter markdown → storyboard directives
  3. storyboard: /decompose → shot sequence
  4. Feedback loop: FB-01 through FB-05 → revise script if needed
  5. storyboard: /board --format json → structured output
  6. Bridge 2: storyboard JSON → VN node directives
  7. Feedback loop: FB-06 through FB-08 → revise storyboard if needed
  8. Bridge 3: VN directives → MCP tool calls → published story graph

PROTOCOL: Quick Update (for revisions to existing scenes)
  1. Edit chapter markdown
  2. Re-run Bridge 1 (only changed sections, tracked by section breaks)
  3. Re-run /decompose on affected shots only
  4. Re-run Bridge 2 with idempotency (update existing VN nodes)
  5. Re-run Bridge 3 with BS-04 idempotency (update, don't duplicate)

PROTOCOL: VN-First (for interactive-fiction-originated scenes)
  1. Design VN choice tree in interactive-fiction module
  2. Reverse Bridge 2: VN nodes → storyboard shot suggestions
  3. Refine storyboard with /shot and /rhythm
  4. Forward Bridge 3: finalized storyboard → MCP
```

### Integration Completeness Matrix

| Aspect | Bridge 1 | Bridge 2 | Bridge 3 | Status |
|--------|----------|----------|----------|--------|
| Field-by-field mapping | 15 rules | 15 rules | 10 rules | Complete |
| Collapse/expansion rules | N/A | 6 collapse + 3 expand | 4 batch | Complete |
| Branching narrative | Suspicion tracking | Choice/convergence | Graph layout | Complete |
| Asset generation | N/A | Expression derivation | 5 trigger types | Complete |
| Quality contract | 10 checks | 10 checks | 10 checks | Complete |
| Bidirectional feedback | 5 feedback rules | 3 feedback rules | Via validate | Complete |
| Data format spec | Markdown → directives | JSON → VN struct | VN → MCP calls | Complete |
| Stress-tested | ch1 applied | ch1 applied | ch1 applied + ch4 branch | Complete |

### Cross-Reference to SKILL.md

This document replaces the conceptual mappings in SKILL.md lines 636-672.
SKILL.md should add a pointer:

```
## 与其他模块的集成

详见 references/integration-maps.md — 完整的字段级桥接规范。
```

### Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | Band 8 (R071-R080) | Initial creation: 3 bridges, 40 field mappings, 30 quality checks, 8 feedback rules, branching stress test, end-to-end pipeline demo |

---

**Band**: 8 (R071-R080)
**Status**: Complete
**Dependencies**: SKILL.md, shot-logic.md v2.1, evaluation.md, llm-guidance.md
**Next**: Band 9 should stress-test these bridges with chapters 2-4 and measure quality contract pass rates
