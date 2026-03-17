---
id: n030-hallway-led
kind: scene
title: Hallway Lead
location: loc.hallway
thriller:
  promise: Elias has won the first exchange and is trying to turn that advantage into narrative control.
  mysteryQuestion: What did Elias need Mara to miss while he kept her moving?
  pressure: medium
  introducesClues:
    - clue.host_controls_route
    - clue.burned_film_smell_returns
  suspicionTargets:
    - char.host
  routeMemory:
    - flag.followed_host
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
    text: Elias keeps half a step ahead of Mara, as if the hall itself had taught him how to guide a guest away from the wrong door without ever touching her.
  - kind: narration
    text: The hot, chemical smell from the foyer returns between the portraits, stronger now that she knows to look for it.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: A house is easiest to misread when the host looks cooperative.
choices:
  - id: continue-gallery
    text: Keep following and look for what the hallway records instead of what Elias says.
    to: n035-portrait-gallery
    thriller:
      intent: investigate
      costs: [time, leverage]
      reveals:
        - clue.burned_film_smell_returns
      risks:
        - Elias keeps the initiative while Mara studies the environment.
      immediateOutcome: Mara keeps access to the hall at the cost of letting Elias narrate it first.
      delayedRisk: Every clue gained here comes under Elias's pacing instead of hers.
      visibleWithinNodes:
        - n035-portrait-gallery
        - n036-nameplate-audit
---

# Hallway Lead

Route-specific aftermath of letting Elias set the pace.
