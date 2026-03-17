# Interactive Thriller Quality Framework

This reference defines the capability targets for an interactive thriller that must be:

- gripping enough to pull the reader forward
- rigorous enough to survive scrutiny
- playable enough that choices feel meaningful

The goal is not maximum branching.
The goal is to produce a story that remains tense, coherent, and replayable under interaction.

## Core Standard

Every major iteration should improve at least one of these three outcomes without degrading the other two:

1. Reader pull: the next interaction feels urgent and desirable.
2. Deductive integrity: the story can withstand timeline, clue, and motive scrutiny.
3. Playable consequence: choices alter pressure, knowledge, or access in a way the player can feel.

## Capability Planes

### 1. Hook And Player Promise

Target:
- The opening establishes a compelling danger, mystery, or social threat.
- The player understands what kind of agency they have.

Failure modes:
- Beautiful prose but no urgent question.
- Mystery premise exists, but the player does not know what they can do.
- The first choice is cosmetic.

Mutation directions:
- Tighten the opening question.
- Clarify the investigation verb set.
- Make the first decision alter information, trust, or risk.

Acceptance checks:
- A first-time reader can state the central mystery after the opening.
- The first decision changes the next scene or the next known variable.
- The opening promises either danger, suspicion, or a hidden truth within 2 scenes.

### 2. Clue Logic And Causal Truth

Target:
- Every major revelation has a causal chain.
- Key clues exist before the ending that depends on them.

Failure modes:
- Surprise replaces logic.
- The culprit's method requires handwaving.
- Endings depend on clues unavailable on that route.

Mutation directions:
- Track clue prerequisites.
- Rewrite impossible logistics into visible causality.
- Add redundant clue access paths for essential deductions.

Acceptance checks:
- Each ending has a clue dependency list.
- Critical clues are reachable on every path that uses them.
- Timeline, method, and motive can be paraphrased without contradiction.

### 3. Suspicion Ecology

Target:
- Suspects feel plausible for different reasons.
- The player can form multiple coherent theories before the reveal.

Failure modes:
- One suspect is obviously correct too early.
- Every suspect behaves the same under pressure.
- Red herrings are noise instead of theory generators.

Mutation directions:
- Differentiate motive, opportunity, and demeanor.
- Give each suspect one believable innocent reading and one alarming reading.
- Use contradiction pressure instead of random weirdness.

Acceptance checks:
- At least 3 plausible working theories exist in the middle game.
- Each major suspect has a distinct pressure response.
- Red herrings increase interpretive tension instead of just delay.

### 4. Choice Pressure

Target:
- Choices trade information, trust, safety, time, or moral position.
- Options signal distinct intent before selection.

Failure modes:
- One option is obviously optimal.
- Choices differ only in tone, not consequence.
- The player cannot tell what a choice means.

Mutation directions:
- Use accept / reject / deflect for social scenes.
- Use risk / caution / redirection for investigation scenes.
- Pair short-term payoff with long-term cost.

Acceptance checks:
- Each choice has a distinct narrative intention.
- The player can describe the tradeoff in one sentence.
- At least one consequence is visible within 1-3 subsequent nodes.

### 5. State Parsimony And Delayed Consequence

Target:
- State is small enough to reason about and rich enough to matter.
- Consequences ripple rather than vanish immediately.

Failure modes:
- Too many variables with unclear purpose.
- Every consequence is immediate and shallow.
- State writes exist without later reads.

Mutation directions:
- Collapse overlapping variables.
- Tag essential variables as gate, flavor, or ending-critical.
- Ensure important state changes echo later through dialogue, access, or endings.

Acceptance checks:
- Each critical variable is read in at least 2 later places.
- Every non-trivial effect has a downstream payoff.
- Variable count remains bounded by story scale.

### 6. Convergence Discipline

Target:
- Branches may merge, but route memory survives the merge.
- Shared nodes remain coherent for all incoming paths.

Failure modes:
- Convergence forgets what the player did.
- Shared scenes assume facts not true on all incoming routes.
- Path differences collapse too early and too cheaply.

Mutation directions:
- Use route memory tags and conditional text.
- Converge on shared pressure, not erased history.
- Delay convergence until branches produce real value.

Acceptance checks:
- Merged nodes do not reference unavailable events.
- Shared scenes retain path-sensitive texture.
- Branches justify their cost before convergence.

### 7. Tension Modulation And Play Rhythm

Target:
- Tension rises and falls intentionally.
- High-pressure decisions are buffered by lower-pressure exploration or reflection.

Failure modes:
- Continuous intensity causes numbness.
- The story stalls in investigation loops.
- Choice density feels arbitrary.

Mutation directions:
- Alternate pressure levels.
- Separate clue collection from accusation pressure.
- Tune node length to scene function.

Acceptance checks:
- Consecutive high-burden choices are rare.
- Investigation sequences create accumulation, not repetition.
- The player experiences both acceleration and compression before endings.

### 8. Ending Justice And Replay Value

Target:
- Endings feel earned.
- Replay reveals new interpretive value, not just alternate text.

Failure modes:
- The best ending requires hidden meta knowledge.
- Bad endings are merely punishment.
- Replays expose shallow branching.

Mutation directions:
- Give each ending a clear contract.
- Make replay uncover alternate evidence, attitude, or interpretation.
- Ensure failure endings still resolve emotionally.

Acceptance checks:
- Each ending corresponds to a traceable pattern of play.
- At least one replay path reveals new theory-level meaning.
- Non-ideal endings remain satisfying as stories.

### 9. Reader Legibility

Target:
- The player can track what they know, suspect, and risk.
- The story stays cognitively playable without reducing mystery.

Failure modes:
- Important clue state is invisible.
- The player cannot distinguish what is known from what is guessed.
- Dialogue options become random probing.

Mutation directions:
- Surface clue and relationship feedback indirectly but clearly.
- Use repeated motifs and callback language.
- Write option text with stronger intent signaling.

Acceptance checks:
- Players can summarize current theories at major checkpoints.
- The story does not require hidden bookkeeping to follow.
- Investigative options remain legible without spoiling outcomes.

### 10. Verification Fitness

Target:
- The story can be tested structurally and narratively every round.
- The method gets better as the story gets larger.

Failure modes:
- Path count grows but verification does not.
- New nodes bypass clue or state audits.
- Method changes are not logged.

Mutation directions:
- Keep file boundaries strict.
- Expand doctor checks as new failure classes appear.
- Record hypotheses and validation outcomes every round.

Acceptance checks:
- Every round writes a hypothesis, target files, and acceptance criteria.
- Structural checks remain runnable locally.
- The system can explain why a given round mattered.
