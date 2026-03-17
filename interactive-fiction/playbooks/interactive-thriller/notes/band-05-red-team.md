# Band 05 Red-Team Note

## Strongest Skeptical Reading

The route had started to look richer, but too much of that richness still lived in prose and not enough in durable state.

The hostile reading was:

- the player makes a choice
- the next node acknowledges it
- then the route forgets

That makes interactivity feel articulate but shallow.

## Defenses Added

- Variables now declare `designRole`, `payoffs`, and local `rationale` in `systems/variables.yaml`.
- Endings and aftermath nodes explicitly read the posture flags they are meant to echo.
- The thriller doctor now audits variable writes, reads, and declared payoff nodes.
- Local-only state is now named as local instead of pretending to be long-horizon structure.

## Next Likely Blind Spot

State ripple is stronger now, but convergence is still mostly route-local.
Band 06 should pressure-test how shared nodes merge different state histories without washing them out.
