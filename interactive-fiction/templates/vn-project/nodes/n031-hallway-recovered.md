---
id: n031-hallway-recovered
kind: scene
title: Hallway Recovery
location: loc.hallway
thriller:
  promise: Mara has rattled Elias, but not enough to stop him from reclaiming control of the house.
  mysteryQuestion: Why did Elias react to the hidden room as if Mara had spoken a forbidden name?
  pressure: medium
  introducesClues:
    - clue.host_flinched
    - clue.host_rehearsed_greeting
  suspicionTargets:
    - char.host
  routeMemory:
    - know.host_is_afraid
presentation:
  background: bg.hallway
cast:
  - character: char.protagonist
    expression: focused
    pose: walking
    position: left
    visible: true
  - character: char.host
    expression: tense
    pose: walking
    position: right
    visible: true
body:
  - kind: narration
    text: Elias flinches once, almost invisibly, then turns the motion into an invitation deeper into the hall.
  - kind: dialogue
    speaker: char.host
    expression: tense
    text: You came here expecting a confession. Most visitors only expect hospitality.
choices:
  - id: continue-gallery
    text: Let him recover his composure and study what the corridor preserved from the slip.
    to: n035-portrait-gallery
    thriller:
      intent: investigate
      costs: [time, leverage]
      reveals:
        - clue.host_rehearsed_greeting
      risks:
        - Elias restores his mask before Mara can force a second mistake.
      immediateOutcome: Mara keeps the admission alive but not the upper hand.
      delayedRisk: Elias regains social polish before she can reopen the same wound.
      visibleWithinNodes:
        - n035-portrait-gallery
        - n036-nameplate-audit
---

# Hallway Recovery

Route-specific aftermath of confronting Elias at the door.
