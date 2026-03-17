---
id: n030-hallway
kind: scene
title: Hallway
location: loc.hallway
thriller:
  promise: The portraits and Elias's language suggest the house has rehearsed this conversation before.
  mysteryQuestion: Is Elias warning Mara away from a family shame, or from proof that he staged the whole invitation?
  pressure: medium
  introducesClues:
    - clue.portrait_eyes_scratched
  suspicionTargets:
    - char.host
  routeMemory:
    - flag.followed_host
    - trust.host
presentation:
  background: bg.hallway
cast:
  - character: char.protagonist
    expression: wary
    pose: walking
    position: center
    visible: true
  - character: char.host
    expression: calm
    pose: walking
    position: right
    visible: true
body:
  - kind: narration
    text: Every portrait in the hall has the eyes scored away with the same careful blade stroke.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: My family believed a secret stayed polite as long as everyone agreed to look beside it instead of at it.
choices:
  - id: press-host
    text: Press Elias before he can turn the hallway into another performance.
    to: e110-curious-ending
    effects:
      - op: set
        target: know.host_is_afraid
        value: true
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
    text: Stay quiet and let the hallway tell you what Elias will not.
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

# Hallway

Example of a standard prose node with local choices.
