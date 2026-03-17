# Band 02 Red-Team Note

## Strongest Skeptical Reading

The starter could still cheat if the endings depended on vibes from the portrait gallery instead of evidence every route actually acquires.

Before this pass, the shared gallery scene was doing too much work:

- atmosphere
- accusation setup
- hidden method implication
- silent-route payoff

That made the route vulnerable to a hostile reading:

- the player could reach an ending without ever seeing the crucial timeline evidence
- the reveal could feel like interpretation instead of deduction

## Defenses Added

- A file-level clue ledger now lives in `systems/clues.yaml`.
- The gallery now branches into a dedicated audit beat before the silent or theory-building payoff.
- The thriller doctor now checks route-level clue states against `thriller.requiresClues`.
- Critical clues are declared in one place and linked to the endings or reveals they support.

## Next Likely Blind Spot

The story now has stronger evidence fairness, but suspicion ecology is still thin.
Band 03 should widen the field of plausible explanations without losing the causal spine.
