---
id: n020-door-check
kind: scene
title: Door Check
location: loc.foyer
thriller:
  promise: The side door may hide the real reason Elias invited Mara before the road closed.
  mysteryQuestion: If the door is supposed to stay locked, why are the scratches fresh and the brass bowl warm?
  pressure: high
  introducesClues:
    - clue.scratched_lock
    - clue.hidden_key
  suspicionTargets:
    - char.host
presentation:
  background: bg.foyer
cast:
  - character: char.protagonist
    expression: focused
    pose: crouching
    position: left
    visible: true
  - character: char.host
    expression: calm
    pose: standing
    position: right
    visible: true
body:
  - kind: narration
    text: Fresh brass dust glitters around the lock. A shallow bowl on the console table still rocks from being moved in a hurry.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: That room is full of old equipment. Nothing in there is meant to survive a curious guest.
choices:
  - id: lift-bowl
    text: Lift the bowl and try the hidden key before Elias can stop you.
    to: n040-secret-room
    effects:
      - op: set
        target: flag.key_found
        value: true
      - op: decrement
        target: trust.host
        value: 10
    thriller:
      intent: investigate
      costs: [trust, safety]
      reveals:
        - clue.hidden_key
        - clue.projector_room
      risks:
        - Elias now knows Mara will cross a boundary to get an answer.
  - id: back-away
    text: Step back before Elias can catch you crossing the line.
    to: e100-locked-out
    thriller:
      intent: stall
      costs: [access, leverage]
      reveals:
        - clue.elias_watched_door
      risks:
        - The hidden room closes again before Mara gains leverage.
---

# Door Check

Investigation pressure scene with a visible access tradeoff.
