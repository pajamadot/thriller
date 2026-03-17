# Interactive Thriller Annotation Overlay

This overlay adds optional thriller-specific design metadata on top of the general VN package.

The goal is not engine binding.
The goal is to make suspense, clue logic, and playable tradeoffs inspectable in files.

## Project-Level Clue Ledger

Interactive thrillers may keep a clue registry in `systems/clues.yaml`:

```yaml
clues:
  - id: clue.projector_inventory_gap
    label: Projector inventory gap
    kind: physical
    question: "What piece of projection equipment is missing from the room?"
    summary: "The host removed a component needed to replay one specific reel."
    supports:
      - e120-silent-ending
      - e130-staged-guest-ending
    critical: true
```

Recommended clue fields:

- `id`
- `label`
- `kind`
- `question`
- `summary`
- `supports`
- `critical`

This ledger stays file-first and importer-friendly.
It exists so local doctors can reason about clue fairness without binding the package to any runtime.

## Node-Level `thriller` Block

Any runtime node may include:

```yaml
thriller:
  promise: "What the scene promises the reader."
  mysteryQuestion: "What question the player should now care about."
  pressure: medium
  introducesClues: [clue.burned_film, clue.scratched_lock]
  requiresClues: [clue.projector_room]
  suspicionTargets: [char.host]
  routeMemory: [flag.followed_host, trust.host]
  payoffs: [ending.secret_room]
  endingContract: "Curiosity over caution reveals the hidden room."
```

Recommended fields:

- `promise`
- `mysteryQuestion`
- `pressure`
- `introducesClues`
- `requiresClues`
- `suspicionTargets`
- `routeMemory`
- `payoffs`
- `endingContract`

## Choice-Level `thriller` Block

Choices may include:

```yaml
choices:
  - id: inspect-door
    text: Check the locked side door.
    to: n020-door-check
    thriller:
      intent: investigate
      costs: [time, trust]
      reveals: [clue.scratched_lock]
      risks: ["Elias notices the player's fixation on the door."]
```

Recommended fields:

- `intent`
- `costs`
- `reveals`
- `risks`

Suggested `intent` values:

- `investigate`
- `comply`
- `deflect`
- `accuse`
- `conceal`
- `stall`
- `flee`
- `trust`
- `distrust`

Suggested `pressure` values:

- `low`
- `medium`
- `high`
- `spike`

## Why This Exists

These fields let local tools ask useful thriller questions:

- Does the opening actually promise a mystery?
- Are clues introduced before they are required?
- Do choices signal intention and cost?
- Do endings advertise the play pattern that earns them?

This overlay is optional.
The base VN package stays valid without it.
