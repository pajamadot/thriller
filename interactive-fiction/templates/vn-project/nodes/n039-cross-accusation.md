---
id: n039-cross-accusation
kind: scene
title: Cross Accusation
location: loc.service-landing
thriller:
  promise: The social cost of the player's theory becomes visible before the route resolves.
  mysteryQuestion: Does pressure make the room tell the truth, or only force everyone to choose the safest lie?
  pressure: high
  suspicionTargets:
    - char.host
    - char.housekeeper
    - char.absent_guest
  routeMemory:
    - flag.sabine_cornered
    - flag.followed_guest_note
  payoffs:
    - e140-housekeeper-ending
    - e150-vanished-guest-ending
presentation:
  background: bg.hallway
cast:
  - character: char.protagonist
    expression: focused
    pose: standing
    position: left
    visible: true
  - character: char.host
    expression: tense
    pose: standing
    position: center
    visible: true
  - character: char.housekeeper
    expression: stern
    pose: standing
    position: right
    visible: true
body:
  - kind: narration
    text: The landing tightens instead of clarifying. Sabine steps closer to the tray; Elias steps closer to Sabine. For the first time all night, Mara can see exactly which theory the room most wants her to accept.
  - kind: dialogue
    speaker: char.housekeeper
    expression: stern
    text: If you want a culprit, choose the one who profits from panic. The house survives panic. People do not.
  - kind: dialogue
    speaker: char.host
    expression: tense
    text: And if you want a witness, choose the note over the nearest servant. That is the more flattering story.
choices:
  - id: hold-on-sabine
    text: Keep the pressure on Sabine and accept the risk of settling on the nearest suspect.
    to: e140-housekeeper-ending
    thriller:
      intent: accuse
      costs: [certainty, fairness]
      reveals: []
      risks:
        - The room gains a convenient culprit before the full system is exposed.
      immediateOutcome: Sabine is forced to answer for what she touched.
      delayedRisk: Mara may leave with a strong theory that is still too local.
      visibleWithinNodes:
        - e140-housekeeper-ending
  - id: hold-on-clara
    text: Follow the absent guest theory and accept that the person in front of you may never fully answer it.
    to: e150-vanished-guest-ending
    thriller:
      intent: investigate
      costs: [control, closure]
      reveals: []
      risks:
        - The room cannot fully pressure an absent suspect into a confession.
      immediateOutcome: Elias loses Sabine as an easy shield.
      delayedRisk: The most dangerous theory may remain the least provable.
      visibleWithinNodes:
        - e150-vanished-guest-ending
---

# Cross Accusation

Immediate social consequence node for the widened suspect field.
