# State Ripple Checklist

Use this checklist when thriller state should stay sparse but still matter.

## Variable Design

- Every variable declares whether it is `critical` or `local`.
- Critical variables advertise payoff nodes in `systems/variables.yaml`.
- Local variables either resolve inside one route or explain their limited scope with a short rationale.

## Read / Write Discipline

- A critical variable is written by at least one effect and read later in at least two places.
- A state write that changes access, suspicion, or posture leaves a visible downstream echo.
- New state is not introduced if a clue or routeMemory read can carry the same job.

## Convergence Discipline

- Shared nodes only read route memory they can safely assume on incoming paths.
- Endings or payoff scenes advertise which earlier posture they are echoing.
- State ripple changes how the route feels, not just what spreadsheet cell was touched.

## Red-Team Layer

- You can point to one player-facing failure caused by dead state.
- You can point to one concrete later node where the repaired state now matters.
- The next band can name which remaining state is still decorative.
