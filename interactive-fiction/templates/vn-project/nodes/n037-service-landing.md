---
id: n037-service-landing
kind: scene
title: Service Landing
location: loc.service-landing
thriller:
  promise: Bringing staff into the scene turns a private theory into a public rupture and breaks Elias's monopoly on interpretation.
  mysteryQuestion: Which explanation panics first once a second witness is standing in the room?
  pressure: spike
  introducesClues:
    - clue.housekeeper_has_gallery_access
    - clue.housekeeper_protects_family
    - clue.absent_guest_left_note
    - clue.absent_guest_knew_schedule
  suspicionTargets:
    - char.host
    - char.housekeeper
    - char.absent_guest
  theorySeeds:
    - suspect: char.host
      reading: dangerous
      basis: Elias lets staff absorb the risk while he manages the script.
    - suspect: char.housekeeper
      reading: dangerous
      basis: Sabine has both access and motive to strip the gallery and visitor tray.
    - suspect: char.absent_guest
      reading: dangerous
      basis: Clara knew enough about the reel change to weaponize her own disappearance.
  theoryRevisions:
    - from: char.host
      to: char.absent_guest
      reason: The warning note implies Clara knew the timing of the second performance before Mara arrived.
    - from: char.housekeeper
      to: char.absent_guest
      reason: Sabine may be containing the fallout of Clara's plan rather than authoring it herself.
  routeMemory:
    - flag.followed_host
    - know.host_is_afraid
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
    text: The service bell barely finishes its note before Sabine Vale appears from the narrow landing beside the gallery, dry-gloved and unstartled, with a linen cloth folded too carefully over one hand.
  - kind: dialogue
    speaker: char.housekeeper
    expression: stern
    text: If Mr. Voss asked you not to touch the tray, he expected to be obeyed.
  - kind: narration
    text: When Sabine shifts the cloth, Mara catches a damp card corner and a note in another hand. The warning is blunt enough to split the room open. If he changes the reel, do not stay for the second performance.
  - kind: dialogue
    speaker: char.host
    expression: tense
    text: Sabine clears what the weather and the family leave exposed. That is not the same thing as authorship.
choices:
  - id: corner-sabine
    text: Corner Sabine on access, timing, and the missing plate before Elias can answer for her.
    to: n039-cross-accusation
    effects:
      - op: set
        target: flag.sabine_cornered
        value: true
    thriller:
      intent: accuse
      costs: [trust, safety]
      reveals:
        - clue.housekeeper_has_gallery_access
        - clue.housekeeper_protects_family
      risks:
        - Sabine may become the cleanest available culprit whether or not she is the architect.
      immediateOutcome: Sabine stops acting like staff and starts defending territory.
      delayedRisk: The room may settle too quickly on the most available culprit.
      visibleWithinNodes:
        - n039-cross-accusation
        - e140-housekeeper-ending
  - id: follow-note
    text: Treat the warning note as a deliberate move by the missing guest, not a piece of housekeeping.
    to: n041-second-performance
    effects:
      - op: set
        target: flag.followed_guest_note
        value: true
    thriller:
      intent: investigate
      costs: [certainty, control]
      reveals:
        - clue.absent_guest_left_note
        - clue.absent_guest_knew_schedule
      risks:
        - The theory turns on an absent actor who cannot be pressured in the room.
      immediateOutcome: Elias loses the benefit of Sabine as a convenient answer.
      delayedRisk: Chasing the absent author keeps the present room unresolved.
      visibleWithinNodes:
        - n041-second-performance
        - n039-cross-accusation
        - e150-vanished-guest-ending
---

# Service Landing

Social rupture node that widens the suspect field past Elias alone.
