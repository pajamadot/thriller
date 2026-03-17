---
id: n035-portrait-gallery
kind: scene
title: Portrait Gallery
location: loc.hallway
thriller:
  promise: The gallery stops behaving like mood and starts behaving like a ledger.
  mysteryQuestion: Did Elias erase one witness from the gallery so Mara would mistake a substitution for an invitation?
  pressure: medium
  introducesClues:
    - clue.portrait_eyes_scratched
    - clue.missing_nameplate
  suspicionTargets:
    - char.host
  routeMemory:
    - flag.followed_host
    - know.host_is_afraid
  mergeCallbacks:
    - when:
        - flag.followed_host
      callback: Elias arrives in the gallery acting as if the route is still his to control.
    - when:
        - know.host_is_afraid
      callback: Elias is composed again, but the earlier flinch still leaks through the way he watches Mara read the wall.
  payoffs:
    - e110-curious-ending
    - n036-nameplate-audit
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
    text: By the time they reach the portrait gallery, Elias has the lead again, but the house has stopped helping him. Every canvas has the eyes scored away, and one brass mount gleams bare where a nameplate was removed so recently the dust has not settled back in.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: Families remove faces when they cannot bear what those faces witnessed. Names are harder to survive than faces.
choices:
  - id: press-host
    text: Accuse Elias now, before he can recover the missing name into another polite lie.
    to: e110-curious-ending
    effects:
      - op: decrement
        target: trust.host
        value: 15
    thriller:
      intent: accuse
      costs: [trust, certainty]
      reveals:
        - clue.host_knows_about_hidden_room
      risks:
        - Pushing before the gallery yields method or timeline evidence may force Elias into pure performance.
      immediateOutcome: Elias is forced into a polished defense before the evidence sequence is complete.
      delayedRisk: The route contracts into a strong accusation built on a thin causal spine.
      visibleWithinNodes:
        - e110-curious-ending
  - id: inspect-nameplate
    text: Let Elias mistake your silence for hesitation and read the empty mount instead of his face.
    to: n036-nameplate-audit
    effects:
      - op: increment
        target: trust.host
        value: 5
    thriller:
      intent: conceal
      costs: [information, time]
      reveals:
        - clue.missing_nameplate
      risks:
        - Elias gets one more chance to perform innocence while Mara studies the evidence.
      immediateOutcome: Mara trades pressure for a cleaner read of the gallery record.
      delayedRisk: Silence keeps more theories alive but postpones confrontation.
      visibleWithinNodes:
        - n036-nameplate-audit
        - n038-held-breath
---

# Portrait Gallery

Shared pressure scene after the route-specific hallway lead-in.
