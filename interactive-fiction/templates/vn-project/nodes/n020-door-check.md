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
    - clue.brass_bowl_recently_moved
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
        - clue.side_door_fresh_scratches
      risks:
        - Elias now knows Mara will cross a boundary to get an answer.
      immediateOutcome: The hidden room opens before Elias can reframe it.
      delayedRisk: Mara burns trust for immediate access and loses the wider social read.
      visibleWithinNodes:
        - n040-secret-room
  - id: confront-host
    text: Leave the lock alone and watch whether Elias flinches when you name the hidden room.
    to: n031-hallway-recovered
    effects:
      - op: set
        target: know.host_is_afraid
        value: true
      - op: decrement
        target: trust.host
        value: 5
    thriller:
      intent: accuse
      costs: [trust, leverage]
      reveals:
        - clue.elias_watched_door
        - clue.host_flinched
      risks:
        - Elias regains control of the route before Mara gains access.
      immediateOutcome: Elias slips, then starts repairing the room around that slip.
      delayedRisk: Mara gains behavioral evidence but loses direct access to the hidden room.
      visibleWithinNodes:
        - n031-hallway-recovered
        - n035-portrait-gallery
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
      immediateOutcome: Elias recovers the door and the conversation at the same time.
      delayedRisk: Caution protects Mara briefly but leaves the strongest lead sealed.
      visibleWithinNodes:
        - e100-locked-out
---

# Door Check

Investigation pressure scene with a visible access tradeoff.
