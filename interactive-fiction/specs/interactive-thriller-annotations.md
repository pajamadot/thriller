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
  theorySeeds:
    - suspect: char.host
      reading: dangerous
      basis: "The host is controlling who sees what."
  theoryRevisions:
    - from: char.host
      to: char.absent_guest
      reason: "A new clue forces Mara to treat the missing guest as an active author, not only a victim."
  routeMemory: [flag.followed_host, trust.host]
  mergeCallbacks:
    - when: [flag.followed_host]
      callback: "The host still thinks he is setting the pace."
    - when: [know.host_is_afraid]
      callback: "The earlier flinch keeps leaking through the host's posture."
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
- `theorySeeds`
- `theoryRevisions`
- `routeMemory`
- `mergeCallbacks`
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
      immediateOutcome: "Elias stops treating Mara as a passive guest."
      delayedRisk: "The host starts routing around her instead of through her."
      visibleWithinNodes: [n020-door-check, n031-hallway-recovered]
```

Recommended fields:

- `intent`
- `costs`
- `reveals`
- `risks`
- `immediateOutcome`
- `delayedRisk`
- `visibleWithinNodes`

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

## Character-Level Thriller Profile

Projects may also annotate suspect-facing characters in `cast/characters.yaml`:

```yaml
thrillerProfile:
  suspectWeight: major
  innocentRead: "Protecting the household from scandal."
  dangerousRead: "Destroying evidence before the witness can compare notes."
  pressureStyle: territorial aggression
```

Recommended fields:

- `suspectWeight`
- `innocentRead`
- `dangerousRead`
- `pressureStyle`
