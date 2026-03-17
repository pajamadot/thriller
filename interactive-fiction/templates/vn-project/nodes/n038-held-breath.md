---
id: n038-held-breath
kind: scene
title: Held Breath
location: loc.hallway
thriller:
  promise: Restraint buys Mara a little more room, but only by forcing her to live with what she now knows.
  mysteryQuestion: Can Mara carry the theory out intact, or will the house make silence costlier than accusation?
  pressure: low
  requiresClues:
    - clue.projector_inventory_gap
    - clue.guest_card_removed
  suspicionTargets:
    - char.host
    - char.housekeeper
    - char.absent_guest
  routeMemory:
    - flag.banked_theory
  payoffs:
    - e120-silent-ending
presentation:
  background: bg.hallway
cast:
  - character: char.protagonist
    expression: controlled
    pose: standing
    position: left
    visible: true
  - character: char.host
    expression: calm
    pose: standing
    position: right
    visible: true
body:
  - kind: narration
    text: Mara lets the sequence stay unspoken. The effect is immediate. Elias slows half a pace, mistaking silence for uncertainty instead of containment.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: If you are finished reading the walls, Mara, I can at least show you the room that was actually prepared.
  - kind: narration
    text: The offer lands like velvet over a blade. The room is calmer now only because Elias thinks he has bought back the pace.
choices:
  - id: keep-mask
    text: Keep the theory hidden and leave before the house can close the gap again.
    to: e120-silent-ending
    thriller:
      intent: conceal
      costs: [certainty, access]
      reveals: []
      risks:
        - Leaving now preserves the sequence but gives up one last chance to pressure the room.
      immediateOutcome: Elias relaxes into the mistaken belief that he regained control.
      delayedRisk: Mara leaves with theory instead of confession or custody.
      visibleWithinNodes:
        - e120-silent-ending
---

# Held Breath

Low-pressure aftermath node for banking the theory instead of escalating.
