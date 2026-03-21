# LLM Prompt Templates for Storyboard Decomposition

> Copy-pasteable prompt templates for /decompose, /shot, and /rhythm operations.
> Each template includes system prompt, user prompt structure, chain-of-thought scaffolding,
> output schema, and built-in quality gates.
> Designed to counteract the 5 known LLM traps documented in llm-guidance.md.

---

## How to Use This File

```
1. Select the template matching your command.
2. Fill in the {{PLACEHOLDER}} variables with actual content.
3. Send the SYSTEM prompt first, then the USER prompt.
4. Validate output against the Output Validator Spec (see llm-guidance.md Section 8).
5. If validation fails, use the Self-Correction Protocol (see llm-guidance.md Section 9).
```

### Context Loading Strategy

Each template specifies which reference files to include and which to omit.
Follow the context budget table in llm-guidance.md Section 7 to stay within token limits.

```
Priority levels:
  [MUST]  = Always include; template will fail without it
  [LOAD]  = Include if context budget allows
  [SKIP]  = Do not include; information is embedded in the prompt
```

---

## Template 1: Full Scene Decomposition (`/decompose`)

### Purpose

Converts a narrative text passage into a complete, validated shot sequence
using the 8-step pipeline: PARSE -> BEAT -> BLOCK -> SHOOT -> VERIFY -> CONNECT -> RHYTHM -> ANNOTATE.

### Context Requirements

```
[MUST] Source text (the scene to decompose)
[MUST] Character list (who appears in this scene)
[MUST] Space description (where the scene takes place)
[LOAD] Style anchor (if /style has been set, include the 3-5 constraint summary)
[LOAD] Previous scene's last 3 shots (for transition continuity)
[SKIP] shot-grammar.md (rules are embedded in prompt)
[SKIP] visual-rhythm.md (rules are embedded in RHYTHM step)
```

### System Prompt

```
You are a professional storyboard artist and film editor specializing in
{{GENRE}} visual narratives. You understand shot grammar, montage theory,
cognitive film science, and information-theoretic editing principles.

Your task is to decompose narrative text into a shot sequence using an
8-step pipeline. You must execute each step explicitly and sequentially.
Do not skip steps. Do not combine steps.

CORE PRINCIPLES:
- Every cut must have a reason (INFORMATION / REACTION / EMPHASIS / ORIENTATION).
- Every shot must PROVIDE at least one new information unit.
- Use the decompose-then-generate strategy: extract beats FIRST, then design shots.
- Never generate shots directly from text. The beat list is your mandatory
  intermediate representation.

KNOWN TRAPS TO AVOID:
- SURFACE MIMICRY: Do not generate "looks professional" sequences without causal logic.
  Force yourself to justify every cut with a specific reason.
- UNIFORMITY BIAS: Do not make all shots 3-4 seconds. Vary durations based on gravity.
  Include at least one shot that is 2x longer or 0.5x shorter than the mean.
- OVER-CUTTING: Do not give every sentence its own shot. One beat can span multiple
  sentences. Ask "can these adjacent beats merge?" after the BEAT step.
- PATTERN INERTIA: After every 5 shots, ask "should the current pattern break?"
  Do not use the same shot size for more than 4 consecutive shots.
- NEGATIVE SPACE NEGLECT: At least one shot must be designed around what it does NOT
  show. Include at least one SIL (silence) marking in sound design.

SHOT SIZE ENUM: EWS | ELS | VLS | LS | MLS | FS | MS | MCS | MCU | CU | BCU | ECU | INSERT
ANGLE ENUM: EYE | HIGH | LOW | BIRD | WORM | DUTCH | OTS | POV
MOVEMENT ENUM: STATIC | PUSH | PULL | TRACK | PAN | TILT | HANDHELD | STEADY | ORBIT | CRANE | DZOOM
TRANSITION ENUM: CUT | JCUT | MATCH | GMATCH | FADE | DISSOLVE | LCUT | JCUT_AUDIO | INVIS
SOUND TYPE ENUM: DIA | VO | AMB | SFX | MUS | SIL
BEAT TYPE ENUM: ACT-B | REACT-B | REVEAL-B | TURN-B | TENSION-B | RELEASE-B | TRANS-B
CUT REASON ENUM: INFORMATION | REACTION | EMPHASIS | ORIENTATION

STYLE ANCHOR (if set):
{{STYLE_ANCHOR_OR_NONE}}
```

### User Prompt

```
DECOMPOSE the following scene into a complete shot sequence.

SOURCE TEXT:
"""
{{SCENE_TEXT}}
"""

CHARACTERS IN SCENE:
{{CHARACTER_LIST_WITH_BRIEF_DESCRIPTIONS}}

SPACE:
{{SPACE_DESCRIPTION_WITH_KEY_FURNITURE_DOORS_WINDOWS}}

PREVIOUS SCENE (last 3 shots, for transition continuity):
{{PREVIOUS_SHOTS_OR_NONE}}

---

Execute ALL 8 steps below. Show your reasoning for each step.
Output each step's result before moving to the next step.

## STEP 1: PARSE
For each text segment, output:
- Unit number
- Function tag: [DESC] | [ACT] | [DIA] | [THINK] | [EXPO] | [TRANS]
- The text
- Implicit visual/auditory information not stated in text

## STEP 2: BEAT
For each beat:
1. Answer: "What value changed?" (power / emotion / information / threat / distance)
   If no value changed -> merge into adjacent beat.
2. Classify: ACT-B | REACT-B | REVEAL-B | TURN-B | TENSION-B | RELEASE-B | TRANS-B
3. Assign gravity: 1-5. Justify why not one level higher or lower.
4. After all beats: draw the arc as a number sequence.
   Check: Is the peak in a reasonable position? Are there breathing points?
   Check: Can any adjacent beats merge? If yes, merge and re-number.

## STEP 3: BLOCK
1. Draw a simple ASCII floor plan of the space (mark doors, windows, key furniture).
2. Mark character starting positions.
3. For each beat with movement: trace FROM -> TO, note speed and motivation.
4. Label staging patterns: A-type (apex/confrontation), I-type (inline/following),
   L-type (L-shape/casual).
5. Note proxemics zone for key moments: intimate(<45cm), personal(45-120),
   social(120-360), public(>360).

## STEP 4: SHOOT
For each beat, design the shot(s). For EACH shot, answer these 5 questions explicitly:

Q1 CUT REASON: Why cut from the previous shot? -> INFORMATION / REACTION / EMPHASIS / ORIENTATION
   (First shot is exempt from this question.)
Q2 SHOT SIZE: Why this size? -> What emotional distance should the audience feel?
Q3 ANGLE: Why this angle? -> Who has power? What psychological state?
Q4 MOVEMENT: Why this movement or stillness? -> What is the narrative energy direction?
Q5 NEW INFO: What new information does this shot give the audience?
   -> Must answer with at least one concrete item. If blank -> delete this shot.

Then specify: shot_size, angle, movement, duration_s, sound (type + content),
character_in_frame, and the Q1-Q5 answers as annotations.

## STEP 5: VERIFY
For EACH shot, fill in:
- REQUIRES: [list of info the audience must already know]
- PROVIDES: [list of new info this shot gives -- MUST be non-empty]
  - Tag each item: (V) visual, (A) auditory, (N) narrative subtext
- RAISES: [questions this shot plants in the audience's mind]

Then run these checks (output PASS or FAIL for each):
- P01: Every shot has non-empty PROVIDES?
- P02: Every cut (after shot 1) has a CUT REASON from the enum?
- P03: Every REQUIRES is satisfied by a prior shot's PROVIDES?
- P04: No circular dependencies in the DAG?
- P05: No orphan shots (every shot has at least one dependency edge)?
- P06: Cause shots appear before reaction shots?
- P07: Adjacent shot order is non-interchangeable? (Would swapping break logic?)
- P08: Scale-out is used only for impact/breathing, not routine transitions?
- P09: No shot size jump > 2 levels without explicit narrative justification?
- P10: No more than 4 consecutive shots at the same shot size?

IF any check FAILs: fix the failing shots, re-run VERIFY, and show the fix.
Do NOT proceed to STEP 6 until all checks PASS.
Maximum 3 correction cycles. If still failing, flag remaining issues.

## STEP 6: CONNECT
For each pair of adjacent shots (N, N+1):
1. Transition type (default: CUT unless narrative demands otherwise)
2. Scale direction: scale-in / scale-out / same-scale / angle-change-only
3. 180-degree line maintained? (YES / NO + justification if NO)
4. Motion continuity: motion->motion / motion->static / static->motion / static->static
5. Identify idiom spans: ESTABLISHING / SHOT-REVERSE-SHOT / REVEAL / CHASE /
   REACTION-CHAIN / VOYEUR / OTHER(explain)
   Mark each idiom's start and end shot numbers.

## STEP 7: RHYTHM
1. List all shot durations.
2. Compute: mean, standard deviation (sigma), min, max, max/min ratio.
3. Draw an ASCII rhythm chart:
   Each shot = one column, height proportional to duration.
   Mark beats with gravity >= 4.
4. Diagnose rhythm pattern: PULSE / ACCELERANDO / RITARDANDO / BREATHE /
   BURST / FERMATA / MIXED
5. Check:
   - sigma > 1.5s? (If not -> too uniform, adjust)
   - max/min ratio >= 3? (If not -> no contrast, adjust)
   - Is there a breathing point every 5-8 short shots?
   - Does the climax beat align with a rhythm change?
6. If any check fails: adjust specific shot durations and re-run checks.

## STEP 8: ANNOTATE
For shots with gravity >= 3:
1. Director's intent: why this exact design?
2. Audience should feel: [specific emotion]
3. Film reference (if applicable): [film, scene, technique borrowed]
4. Alternative design: [1 alternative approach with different effect]

## FINAL OUTPUT

After all 8 steps, output the complete shot sequence as a JSON array:

```json
[
  {
    "shot_id": 1,
    "beat_id": 1,
    "shot_size": "ELS",
    "angle": "EYE",
    "movement": "STATIC",
    "duration_s": 5.0,
    "character_in_frame": ["ye_zhiqiu"],
    "content": "Consulting room exterior -> interior",
    "sound": [
      {"type": "AMB", "content": "office hum, distant traffic"}
    ],
    "cut_reason": null,
    "provides": ["(V) consulting room space", "(A) ambient quiet"],
    "requires": [],
    "raises": [],
    "transition_in": null,
    "scale_direction": null,
    "idiom": "ESTABLISHING",
    "annotation": "Opening shot establishes claustrophobic workspace"
  }
]
```

Then output a summary:

```
METRICS:
  Total shots: N
  Total duration: Xs
  Info efficiency: (unique info units / total shots)
  Cut justification coverage: (justified cuts / total cuts)
  Dependency completeness: (satisfied REQUIRES / total REQUIRES)
  Rhythm variance sigma: Xs
  Idiom coverage: (shots in idioms / total shots)
  Shot size entropy: X bits
```
```

---

## Template 2: Single Shot Refinement (`/shot N`)

### Purpose

Adjusts a single shot's parameters (size, angle, movement, duration, sound)
based on a stated adjustment intent, while maintaining consistency with
the surrounding sequence.

### Context Requirements

```
[MUST] Current shot definition (JSON or description)
[MUST] Shot N-1 and Shot N+1 (the neighbors)
[MUST] Adjustment intent (what to change and why)
[LOAD] Full beat list (to check gravity alignment)
[LOAD] Style anchor
[SKIP] Full sequence (neighbors are sufficient)
```

### System Prompt

```
You are a film editor refining a single shot within an existing storyboard sequence.
You must adjust the specified shot while preserving:
1. Information DAG integrity (REQUIRES/PROVIDES chain unbroken)
2. Continuity with neighboring shots (180-degree, 30-degree, motion continuity)
3. Rhythm coherence (the adjusted duration should not create a rhythm anomaly
   unless that is the stated intent)

Genre: {{GENRE}}
Style anchor: {{STYLE_ANCHOR_OR_NONE}}
```

### User Prompt

```
REFINE shot {{N}} based on the adjustment intent below.

CURRENT SHOT (N = {{N}}):
{{SHOT_N_JSON}}

PREVIOUS SHOT (N-1):
{{SHOT_N_MINUS_1_JSON}}

NEXT SHOT (N+1):
{{SHOT_N_PLUS_1_JSON}}

BEAT CONTEXT:
  Beat ID: {{BEAT_ID}}
  Beat type: {{BEAT_TYPE}}
  Gravity: {{GRAVITY}}
  Value change: {{VALUE_CHANGE_DESCRIPTION}}

ADJUSTMENT INTENT:
{{WHAT_TO_CHANGE_AND_WHY}}

---

Execute the following reasoning chain:

## 1. UNDERSTAND INTENT
Restate the adjustment goal in your own words.
What effect should the change achieve?

## 2. EVALUATE CURRENT
Why is the current design insufficient for this intent?
Which of the 5 shot questions (CUT REASON, SIZE, ANGLE, MOVEMENT, NEW INFO) need revision?

## 3. PROPOSE CHANGE
Specify the new values. For each changed parameter, answer:
- Old value -> New value
- Why the new value serves the intent better
- Impact on emotional distance, power dynamics, or energy direction

## 4. VERIFY CONSISTENCY

Check against neighbors:
- [PASS/FAIL] PROVIDES still non-empty?
- [PASS/FAIL] REQUIRES of shot N+1 still satisfied?
- [PASS/FAIL] Transition from N-1 still coherent?
  - Scale direction: {{old}} -> {{new}} -- still appropriate?
  - 180-degree line: maintained?
  - Motion continuity: motion state transition still logical?
- [PASS/FAIL] No shot-size jump > 2 levels without justification?
- [PASS/FAIL] Duration does not create rhythm anomaly?
  (Unless anomaly is the stated intent.)

If any FAIL: adjust the proposal to restore consistency, or flag neighbor
shots that need cascading changes.

## 5. OUTPUT

```json
{
  "shot_id": {{N}},
  "changes": {
    "shot_size": {"old": "MS", "new": "CU", "reason": "..."},
    "angle": {"old": "EYE", "new": "LOW", "reason": "..."}
  },
  "updated_shot": { ... complete shot JSON ... },
  "cascading_changes": [
    {"shot_id": ..., "field": ..., "recommended": ..., "reason": ...}
  ],
  "consistency_checks": {
    "provides_nonempty": "PASS",
    "requires_satisfied": "PASS",
    "transition_coherent": "PASS",
    "scale_jump_ok": "PASS",
    "rhythm_ok": "PASS"
  }
}
```
```

---

## Template 3: Rhythm Analysis (`/rhythm`)

### Purpose

Analyzes the temporal rhythm of a complete shot sequence, diagnoses rhythm
pathologies, and prescribes targeted fixes. Outputs an ASCII visualization
and a rhythm health report.

### Context Requirements

```
[MUST] Complete shot sequence with durations and shot sizes
[MUST] Beat gravity values for each shot
[LOAD] Genre (affects rhythm baselines)
[SKIP] Full reference files (rhythm rules are embedded)
```

### System Prompt

```
You are a film editor specializing in rhythm and pacing analysis.
You understand Murch's "editing as breathing" principle, Eisenstein's
metric/rhythmic montage theory, and cognitive science research on
attention cycles.

Genre: {{GENRE}}

Rhythm baselines for {{GENRE}}:
  Average shot length (ASL): {{ASL_RANGE}}
  Static shot ratio: {{STATIC_RATIO}}
  Close-up ratio: {{CU_RATIO}}
  Long take frequency: {{LONG_TAKE_FREQ}}

For thriller/suspense specifically:
  ASL: 3-6s
  Static ratio: 40-60%
  CU ratio: 30-40%
  Long takes: common at interrogation/revelation/tracking scenes
  Rhythm taboos: all-fast-cut, all-slow, uniform pacing, deceleration before climax
```

### User Prompt

```
ANALYZE the rhythm of the following shot sequence.

SHOT SEQUENCE:
| # | Size | Duration | Gravity | Beat Type | Static? | Content Summary |
|---|------|----------|---------|-----------|---------|-----------------|
{{SHOT_TABLE_ROWS}}

---

Execute the following analysis:

## 1. RAW METRICS

Compute:
- N (total shots)
- Total duration
- Mean duration (mu)
- Standard deviation (sigma)
- Min duration, Max duration
- Max/Min ratio
- Median duration
- ASL (average shot length = total duration / N)

## 2. DURATION DISTRIBUTION

Group shots by duration bracket:
- Ultra-short (<1s): count, percentage
- Short (1-2s): count, percentage
- Medium (3-5s): count, percentage
- Long (6-10s): count, percentage
- Ultra-long (>10s): count, percentage

## 3. ASCII RHYTHM CHART

Draw the sequence as a bar chart.
Each shot is one column. Height = duration (1 row per second, max 15 rows).
Mark gravity >= 4 beats with a star (*) above the column.
Mark gravity = 5 with double star (**).

Example:
```
**
 *                    *
 |         |          |
 |    |    |     |    |    |
 |    |    |     |    |    |
 ||   ||   ||    ||   ||   ||
 ||   ||   ||    ||   ||   ||
 ||   ||   ||    ||   ||   ||
-S01--S02--S03---S04--S05--S06-
 3s   3s   5s    3s   8s   2s
```

## 4. PATTERN RECOGNITION

Identify the dominant rhythm pattern:
- PULSE: uniform durations (sigma < 0.8)
- ACCELERANDO: decreasing durations toward climax
- RITARDANDO: increasing durations (post-climax wind-down)
- BREATHE: alternating long-short (natural conversation rhythm)
- BURST: stable -> sudden rapid fire -> long hold
- FERMATA: normal rhythm with one anomalous long shot
- MIXED: combination of patterns (specify segments)

Map segments of the sequence to patterns:
  Shots 1-4: ACCELERANDO
  Shots 5-8: FERMATA at shot 7
  ...

## 5. RHYTHM HEALTH CHECK

Run these diagnostics (PASS/WARN/FAIL):

| Check | Criterion | Value | Status |
|-------|-----------|-------|--------|
| Variance | sigma > 1.5s | {{sigma}} | |
| Contrast | max/min >= 3 | {{ratio}} | |
| Breathing | Long shot every 5-8 short shots | | |
| Climax alignment | Gravity peak matches rhythm change | | |
| No monotone run | No 4+ consecutive same-duration (+-0.5s) | | |
| Shot-size harmony | Long shots not paired with ECU (unreadable) | | |
| Genre fit | ASL within genre range | {{asl}} | |

## 6. SHOT-SIZE FLOW ANALYSIS

List the shot-size sequence as abbreviations:
  LS - MS - CU - CU - MS - ECU - LS - MS - CU

Check:
- Progressive (far->near): where?
- Regressive (near->far): where?
- Jump (>2 levels): where? justified?
- Lock (same size 4+): where?
- Scale direction matches emotional arc?

## 7. DIAGNOSIS AND PRESCRIPTION

For each WARN or FAIL:
1. Name the problem
2. Identify the specific shots causing it
3. Prescribe a fix:
   - "Extend shot N from 2s to 6s" (breathing point)
   - "Shorten shots 4-6 from 4s each to 4s/3s/2s" (accelerando before climax)
   - "Change shot 8 from MS to CU" (size-duration harmony)
4. Predict the effect of the fix on the overall rhythm

## 8. OUTPUT SUMMARY

```
RHYTHM REPORT: {{SCENE_NAME}}
  Pattern: {{DOMINANT_PATTERN}}
  Health: {{PASS_COUNT}}/7 checks passed
  ASL: {{ASL}}s (genre target: {{GENRE_TARGET}})
  Sigma: {{SIGMA}}s (target: 1.5-4.0)
  Contrast: {{RATIO}} (target: >= 3)

  Fixes needed:
    1. {{FIX_1}}
    2. {{FIX_2}}
    ...

  Revised durations (if fixes applied):
    [original] -> [revised]
```
```

---

## Template 4: VERIFY-Only Pass (Standalone Validation)

### Purpose

Run the VERIFY step as a standalone validation on an existing shot sequence,
without re-running the full decomposition pipeline. Useful for checking
sequences that were hand-edited or produced by `/shot` adjustments.

### Context Requirements

```
[MUST] Complete shot sequence with REQUIRES/PROVIDES/RAISES
[MUST] Beat list with gravity values
[SKIP] Source text (not needed for pure validation)
```

### System Prompt

```
You are a quality assurance specialist for storyboard sequences.
Your ONLY job is to validate logical integrity. You do not redesign shots.
You identify problems and specify which shots are affected.

Apply the 20 formal predicates (P01-P20) from the shot-logic system v2.1.
For each predicate, output PASS, WARN, or FAIL with the affected shot IDs.
```

### User Prompt

```
VALIDATE the following shot sequence.

SHOT SEQUENCE:
{{SHOT_SEQUENCE_JSON}}

BEAT LIST:
{{BEAT_LIST_WITH_GRAVITY}}

---

## Run each predicate:

P01 PROVIDES_NONEMPTY: Every shot has non-empty PROVIDES?
P02 CUT_REASON_PRESENT: Every cut (after shot 1) has a reason from
    {INFORMATION, REACTION, EMPHASIS, ORIENTATION}?
P03 REQUIRES_SATISFIED: Every item in every shot's REQUIRES is provided
    by a prior shot's PROVIDES?
P04 DAG_ACYCLIC: No circular dependency chains?
P05 NO_ORPHANS: Every shot has at least one dependency edge (in or out)?
P06 CAUSE_BEFORE_REACTION: Cause shots appear before their reaction shots?
P07 ORDER_NON_INTERCHANGEABLE: For each adjacent pair, swapping would break logic?
P08 SCALE_OUT_JUSTIFIED: Scale-out transitions used only for impact/breathing?
P09 SCALE_JUMP_JUSTIFIED: Shot-size jumps > 2 levels have explicit narrative reason?
P10 NO_SIZE_MONOTONE: No more than 4 consecutive shots at the same size?
P11 IDIOM_COMPLETE: Every identified idiom has a complete pattern
    (not truncated half-way)?
P12 180_LINE_MAINTAINED: 180-degree line consistent within dialogue sequences?
P13 MOTION_CONTINUITY: Motion state transitions are intentional
    (motion->static only for emphasis/halt)?
P14 RAISES_TRACTION: At every point in the sequence, the audience has at least
    one unanswered question from prior RAISES?
P15 VIEWPOINT_CONSISTENT: Observer type (character POV / adjacent / omniscient /
    hidden voyeur) does not change without narrative justification?
P16 SOUND_ANNOTATED: Every shot has at least one sound annotation?
P17 SILENCE_PRESENT: At least one SIL annotation exists in the sequence?
P18 GRAVITY_ALIGNMENT: Shots covering gravity >= 4 beats use CU or tighter?
    (Unless rule-breaking is annotated with justification.)
P19 DURATION_RANGE: All durations in 0.3s-30s range?
P20 RHYTHM_VARIANCE: Sigma > 1.5s across the full sequence?

## Output format:

```json
{
  "total_predicates": 20,
  "pass": 0,
  "warn": 0,
  "fail": 0,
  "results": [
    {
      "id": "P01",
      "name": "PROVIDES_NONEMPTY",
      "status": "PASS|WARN|FAIL",
      "affected_shots": [],
      "detail": "..."
    }
  ],
  "verdict": "VALID | NEEDS_FIXES | CRITICAL_FAILURES",
  "fix_priority": [
    {"predicate": "P03", "shots": [5, 8], "suggested_fix": "..."}
  ]
}
```
```

---

## Template 5: Score Report (`/score`)

### Purpose

Evaluate a completed shot sequence against the 6-dimension scoring system
with genre-specific weighting.

### Context Requirements

```
[MUST] Complete shot sequence (JSON or table)
[MUST] Genre specification
[LOAD] Beat list for narrative alignment check
[SKIP] Reference files (scoring rubrics embedded)
```

### System Prompt

```
You are a storyboard critic evaluating shot sequences using a 6-dimension
scoring system. You score objectively according to the rubric below.
Do not inflate scores. A score of 7/10 is "good with minor issues."
A score of 10/10 means professional-grade work ready for production.

Genre: {{GENRE}}

Genre weight multipliers:
| Dimension | Thriller | Action | Drama | Horror |
|-----------|----------|--------|-------|--------|
| LOGIC     | 1.3      | 1.0    | 0.9   | 1.1    |
| NARR      | 1.2      | 0.9    | 1.3   | 1.0    |
| VIS       | 1.0      | 1.1    | 1.2   | 1.1    |
| RHYTHM    | 1.0      | 1.3    | 0.8   | 1.2    |
| SOUND     | 1.1      | 0.8    | 1.0   | 1.3    |
| CRAFT     | 0.9      | 0.9    | 1.2   | 0.9    |
```

### User Prompt

```
SCORE the following shot sequence.

GENRE: {{GENRE}}

SHOT SEQUENCE:
{{SHOT_SEQUENCE_JSON_OR_TABLE}}

BEAT LIST:
{{BEAT_LIST_WITH_GRAVITY}}

---

## Score each dimension 0-10 with justification:

### LOGIC (0-10): Causal reasoning quality
- Are all cuts justified?
- Is the information DAG complete?
- Are idioms complete?
- Are there any of the 8 common logic errors?

### NARR (0-10): Narrative alignment
- Every beat covered by shots?
- Narrative arc matches visual arc?
- Clues planted via fair-play?
- Viewpoint consistent?

### VIS (0-10): Visual design quality
- Shot sizes serve emotional distance?
- Angles reflect power dynamics?
- Movement matches energy direction?
- Composition uses depth layers?

### RHYTHM (0-10): Temporal design
- Duration variance sigma in 1.5-4.0?
- Climax has rhythm change?
- Breathing points present?
- No rhythm pathologies?

### SOUND (0-10): Audio design
- Every shot annotated?
- Sync/counterpoint/advance used intentionally?
- Silence as narrative tool?
- J-Cut/L-Cut at scene transitions?

### CRAFT (0-10): Creative excellence
- Any shots that transcend templates?
- Visual metaphors present?
- Consistent directorial voice?
- Intentional rule-breaking with justification?

## Compute weighted total:
  weighted_total = sum(dimension_score * genre_weight)

## Output the computable metrics:
  Info efficiency, Cut justification coverage, Dependency completeness,
  Rhythm variance, Idiom coverage, Shot size entropy

## Top 3 improvement suggestions (priority order)

## Final rating: {{SCORE}}/60 (unweighted) | {{WEIGHTED}}/66 (weighted for {{GENRE}})
```

---

## Prompt Assembly Checklist

Before sending any template, verify:

```
[ ] System prompt includes genre and style anchor
[ ] All {{PLACEHOLDER}} variables have been filled
[ ] Source text is included for PARSE/BEAT steps (Template 1)
[ ] Context budget is within the step's token limit (see llm-guidance.md Section 7)
[ ] If this is a continuation, previous step output is included as input
[ ] Output format matches what downstream steps expect
```

### Template Selection Guide

| Command | Template | When to Use |
|---------|----------|-------------|
| `/decompose` | Template 1 | Full pipeline on new scene text |
| `/shot N` | Template 2 | Adjusting a single shot after initial decompose |
| `/rhythm` | Template 3 | Evaluating/fixing timing after sequence is built |
| `/visual-audit` | Template 4 | Standalone logic validation |
| `/score` | Template 5 | Final quality assessment |

---

## Calibration Benchmarks

Three test scenes from "Mirror Visitor" Ch.1, with expected metric targets.
Use these to validate that prompt templates produce consistent, quality output.

### Benchmark 1: Consulting Room Dialogue (dialogue-heavy)

**Scene segment**: "Lin Xiaoman arrives -> reveals stalking -> Ye Zhiqiu's reaction"
(Beats 4-7 from decomposition-algorithm.md)

```
Text: From "Lin Xiaoman enters on time" through
      "Ye Zhiqiu writes down the name Zhou Mingzhe"

Scene type: Two-person dialogue escalating to revelation
Staging: A-type (across desk), social distance (200cm), no movement
Dominant idiom: SHOT-REVERSE-SHOT escalating to REVEAL

Expected metrics:
  Shot count: 7-10
  ASL: 4-6s
  Sigma: 1.5-2.5s
  Info efficiency: >= 0.85
  Cut justification: 1.0
  Dependency completeness: 1.0
  Idiom coverage: 0.7-0.9
  Shot size entropy: >= 2.0 bits

Expected rhythm pattern: BREATHE -> FERMATA at "your mother's exact words"
Expected idiom sequence:
  ESTABLISHING (1-2 shots) ->
  SHOT-REVERSE-SHOT (3-5 shots, escalating OTS -> CU) ->
  REVEAL (1-2 shots, CU -> ECU at revelation) ->
  REACTION (1 shot, CU/ECU of Ye Zhiqiu)

Expected shot size flow:
  MS -> MCU -> MS/OTS -> CU -> CU -> ECU -> CU
  (progressive scale-in toward revelation, single scale-out for breathing)

Key quality checks:
  - The line "your mother's exact words" MUST be at CU or tighter
  - Ye Zhiqiu's reaction MUST be a separate shot (not combined with dialogue)
  - At least 1 SIL marking after the revelation
  - The revelation shot should be the longest in the sub-sequence
```

### Benchmark 2: Going Home Solo (solo movement/transition)

**Scene segment**: "After Lin Xiaoman leaves -> Ye Zhiqiu sits alone -> returns to apartment"
(Beats 8-9)

```
Text: From "After seeing Lin Xiaoman off, I sat in the consulting room for a long time"
      through "I returned to the apartment"

Scene type: Solo reflection + location transition
Staging: Single character, A-type collapses (empty opposite chair), space transition
Dominant idiom: ESTABLISHING (new space) + potential DISSOLVE/FADE transition

Expected metrics:
  Shot count: 3-5
  ASL: 5-8s
  Sigma: 2.0-4.0s
  Info efficiency: >= 0.8
  Cut justification: 1.0
  Idiom coverage: 0.5-0.8 (transition sequences are less idiom-heavy)
  Shot size entropy: >= 1.5 bits

Expected rhythm pattern: RITARDANDO (long, contemplative shots)
Expected idiom sequence:
  Post-dialogue settle (CU/MS of Ye Zhiqiu alone) ->
  TIME PASSAGE (DISSOLVE or FADE, darkening window) ->
  ESTABLISHING of apartment (LS/MS)

Expected shot size flow:
  CU -> MS/MLS (pull out to show empty room) -> LS (apartment)
  (regressive/scale-out: emotional release after tense dialogue)

Key quality checks:
  - Empty chair/sofa SHOULD be visible (visual absence = narrative presence)
  - Window darkening is implicit in text -> should appear in shot design
  - Transition between locations should use DISSOLVE/FADE, not hard CUT
  - At least one shot >= 8s (contemplative long take)
  - Sound design should include AMB change (office -> street -> apartment)
```

### Benchmark 3: Discovering Anomalies (revelation sequence)

**Scene segment**: "The grey hoodie -> analyzing Zhou Mingzhe -> fresh mud on shoes"
(Beats 10-12)

```
Text: From "a grey hoodie hanging on the coat hook" through
      "but there was fresh mud on the shoes"

Scene type: Solo discovery sequence, escalating anomalies
Staging: Single character in apartment, moving between coat hook, desk, entrance
Dominant idiom: REVEAL (repeated, escalating)

Expected metrics:
  Shot count: 6-9
  ASL: 3-5s
  Sigma: 1.5-3.0s
  Info efficiency: >= 0.85
  Cut justification: 1.0
  Idiom coverage: 0.6-0.8
  Shot size entropy: >= 2.0 bits

Expected rhythm pattern: BREATHE -> ACCELERANDO toward final mud reveal
Expected idiom sequence:
  REVEAL-progressive (hoodie: LS -> MS -> INSERT) ->
  ANALYSIS (MS/MCU of Ye Zhiqiu thinking, quasi-TENSION) ->
  REVEAL-progressive (mud: MS -> CU -> ECU on shoes)

Expected shot size flow:
  MS -> INSERT(hoodie) -> MS -> MCU(thinking) -> MS -> CU(shoes) -> ECU(mud)
  (two progressive scale-in arcs, second one going tighter)

Key quality checks:
  - Hoodie INSERT must be brief (1-2s) -- character dismisses it quickly
  - Mud on shoes ECU should be the tightest shot in the sub-sequence
  - The "rationalization" internal monologue should use VO, not DIA
  - Second reveal (mud) should be visually stronger than first (hoodie):
    tighter shot, longer duration, more dramatic sound design
  - The sequence should END on the mud reveal -- no resolution shot
    (chapter ends on unresolved tension = cliffhanger structure)
  - Sound: SIL or minimal AMB at final ECU (absence of sound = weight)
```

### How to Use Benchmarks

```
1. Run Template 1 (Full Decompose) on each benchmark's text segment.
2. Compare output metrics against the expected targets.
3. For each metric outside the target range:
   a. Identify which LLM trap caused the deviation.
   b. Adjust the system prompt emphasis for that trap.
   c. Re-run and compare.
4. Record the calibration results in the evolution log.

Acceptable calibration:
  - 5/6 computable metrics within target ranges on all 3 benchmarks
  - All 3 key quality checks PASS on each benchmark
  - Idiom sequences match expected patterns (order may vary slightly)

Needs recalibration:
  - Any benchmark has 3+ metrics outside target ranges
  - Any "must" quality check fails consistently across re-runs
```
