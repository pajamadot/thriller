---
id: n035-portrait-gallery
kind: scene
title: Portrait Gallery
location: loc.hallway
thriller:
  promise: The house itself starts corroborating the suspicion that Elias has staged the evening.
  mysteryQuestion: Are the damaged portraits hiding family shame, or evidence that tonight's visit was prepared in advance?
  pressure: medium
  introducesClues:
    - clue.portrait_eyes_scratched
    - clue.projector_inventory_gap
  suspicionTargets:
    - char.host
  routeMemory:
    - flag.followed_host
    - know.host_is_afraid
presentation:
  background: bg.hallway
cast:
  - character: char.protagonist
    expression: wary
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
    text: By the time they reach the portrait gallery, Elias has the lead again, but the house has stopped helping him. Every canvas has the eyes scored away, and one brass nameplate is missing altogether.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: Families remove faces when they cannot bear what those faces witnessed.
choices:
  - id: press-host
    text: Press Elias now, while the gallery is still speaking louder than he is.
    to: e110-curious-ending
    effects:
      - op: decrement
        target: trust.host
        value: 15
    thriller:
      intent: accuse
      costs: [trust, safety]
      reveals:
        - clue.host_knows_about_hidden_room
      risks:
        - Pushing too early may cost future access.
  - id: stay-silent
    text: Stay silent and keep the advantage of being underestimated.
    to: e120-silent-ending
    effects:
      - op: increment
        target: trust.host
        value: 5
    thriller:
      intent: conceal
      costs: [information, time]
      reveals:
        - clue.portrait_eyes_scratched
      risks:
        - The player preserves access but postpones confrontation.
---

# Portrait Gallery

Shared pressure scene after the route-specific hallway lead-in.
