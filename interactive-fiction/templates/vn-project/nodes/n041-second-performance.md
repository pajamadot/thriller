---
id: n041-second-performance
kind: scene
title: Second Performance
location: loc.service-landing
thriller:
  promise: The note forces Mara to decide whether the missing guest is a warning voice or an absent author.
  mysteryQuestion: Did Clara flee the trap, or did she design the relay that left Mara holding the next cue?
  pressure: medium
  introducesClues:
    - clue.second_performance_expected
  suspicionTargets:
    - char.host
    - char.housekeeper
    - char.absent_guest
  theorySeeds:
    - suspect: char.absent_guest
      reading: dangerous
      basis: The note proves the second performance was expected, not improvised.
  theoryRevisions:
    - from: char.host
      to: char.absent_guest
      reason: The note proves someone beyond Elias knew the timing of the second reel.
    - from: char.housekeeper
      to: char.absent_guest
      reason: Sabine may be preserving order around a plan she did not begin.
  routeMemory:
    - flag.followed_guest_note
  payoffs:
    - n039-cross-accusation
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
    text: The folded note changes the geometry of the room. It is no longer enough to ask what Elias hid. Someone else expected a second performance and wrote for the next witness as if Mara had already been cast.
  - kind: dialogue
    speaker: char.host
    expression: tense
    text: Clara always knew how to turn an exit into a warning. That does not make her truthful. It makes her practiced.
choices:
  - id: read-note-aloud
    text: Read the warning aloud and force Elias to deny the second performance in front of Sabine.
    to: n039-cross-accusation
    effects:
      - op: set
        target: flag.note_read_aloud
        value: true
      - op: decrement
        target: trust.host
        value: 5
    thriller:
      intent: accuse
      costs: [cover, leverage]
      reveals:
        - clue.second_performance_expected
      risks:
        - Publicly naming the relay makes every later answer more performative.
      immediateOutcome: Elias has to argue with the document instead of Mara's tone.
      delayedRisk: A public theory revision may push the room into coordinated denial.
      visibleWithinNodes:
        - n039-cross-accusation
        - e150-vanished-guest-ending
  - id: pocket-note
    text: Pocket the note and watch who panics at your silence.
    to: n039-cross-accusation
    effects:
      - op: set
        target: flag.note_pocketed
        value: true
      - op: increment
        target: trust.host
        value: 5
    thriller:
      intent: conceal
      costs: [certainty, control]
      reveals:
        - clue.second_performance_expected
      risks:
        - Keeping the note private preserves ambiguity but lets Elias keep speaking first.
      immediateOutcome: Sabine starts watching Mara instead of Elias, which is its own answer.
      delayedRisk: A private theory keeps more options alive at the cost of open leverage.
      visibleWithinNodes:
        - n039-cross-accusation
        - e150-vanished-guest-ending
---

# Second Performance

Midgame theory-shift node that reframes the missing guest as an active author candidate.
