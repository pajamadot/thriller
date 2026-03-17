# Interactive Thriller 100-Round Loop

This is a file-first method for evolving an interactive thriller over 100 rounds.

The target is not branch count.
The target is sustained improvement in:

1. Reader pull
2. Deductive integrity
3. Playable consequence

## Modular Layout

The plan is intentionally modular:

- [manifest.json](/G:/PajamaDot/story/thriller/interactive-fiction/specs/interactive-thriller-plan/manifest.json)
- [slots.json](/G:/PajamaDot/story/thriller/interactive-fiction/specs/interactive-thriller-plan/slots.json)
- `bands/*.json`
- [interactive-thriller-plan.js](/G:/PajamaDot/story/thriller/scripts/lib/interactive-thriller-plan.js)

That keeps the method editable by capability, not trapped in one giant file.

## File-First Rule

The story source remains files:

- `manifest.yaml`
- `cast/characters.yaml`
- `world/locations.yaml`
- `systems/variables.yaml`
- `nodes/**/*.md`
- `build/story.json`

The loop writes working state to `meta/runs/interactive-thriller/`.
Those run files are not the story source of truth.

## The 10 Bands

1. Promise and agency
2. Clue logic and causal truth
3. Suspicion ecology
4. Choice tradeoffs
5. State economy and delayed consequence
6. Convergence discipline
7. Tension rhythm
8. Midgame escalation and theory shift
9. Ending justice and replay value
10. Verification and codification

Every band uses the same 10-slot work rhythm:

1. Audit the current weakness
2. Tighten the contract
3. Rewrite a small structural unit
4. Sharpen choice consequence
5. Reinforce logic and redundancy
6. Preserve route memory
7. Tune pace and tension
8. Test downstream payoff
9. Red-team the route
10. Codify the gain

## Local Commands

Initialize a run:

```bash
node thriller/scripts/run-interactive-thriller-evolution-loop.js init
```

Scaffold the next 3 rounds:

```bash
node thriller/scripts/run-interactive-thriller-evolution-loop.js scaffold --count 3
```

Check progress:

```bash
node thriller/scripts/run-interactive-thriller-evolution-loop.js status
```

Mark a round complete:

```bash
node thriller/scripts/run-interactive-thriller-evolution-loop.js complete r001 --outcome success --note "Clarified the first choice contract."
```

Record the capability into the local EvoMap ledger:

```bash
node thriller/scripts/record-interactive-thriller-evomap.js
```
