---
id: n036-nameplate-audit
kind: scene
title: Nameplate Audit
location: loc.hallway
thriller:
  promise: The missing plate, visitor ledger, and projector residue turn atmosphere into method.
  mysteryQuestion: Was Mara invited for herself, or slotted into a role prepared for someone who never arrived?
  pressure: medium
  introducesClues:
    - clue.projector_inventory_gap
    - clue.guest_card_removed
  requiresClues:
    - clue.missing_nameplate
  suspicionTargets:
    - char.host
    - char.housekeeper
    - char.absent_guest
  theorySeeds:
    - suspect: char.host
      reading: dangerous
      basis: Elias staged the substitution and removed the visible traces too late.
    - suspect: char.housekeeper
      reading: dangerous
      basis: A staff hand could have cleared the tray and plate while protecting the house.
    - suspect: char.absent_guest
      reading: dangerous
      basis: The missing guest may have stripped her own trace before turning Mara into the next witness.
  routeMemory:
    - flag.followed_host
    - know.host_is_afraid
  payoffs:
    - e120-silent-ending
    - e130-staged-guest-ending
    - n037-service-landing
presentation:
  background: bg.hallway
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
    text: Mara steps closer to the empty brass mount and sees a clean soot ring beneath it, the shape of something heated and removed in the last hour. On the side table below, a visitor card tray holds one fresh indentation with no card left inside.
  - kind: narration
    text: The same burned-film smell threading the hall clings to the tray, as if a projector case was set there while someone stripped a name from the wall.
  - kind: narration
    text: Too many hands fit the sequence too neatly. Elias could have staged it, a staff hand could have cleared it, or the missing guest could have removed her own trace before Mara ever reached the house.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: You are very good at turning household shame into chronology.
choices:
  - id: bank-theory
    text: Bank the sequence quietly and carry it past Elias instead of forcing the room right now.
    to: n038-held-breath
    effects:
      - op: increment
        target: trust.host
        value: 5
      - op: set
        target: flag.banked_theory
        value: true
    thriller:
      intent: conceal
      costs: [certainty, time]
      reveals:
        - clue.guest_card_removed
        - clue.projector_inventory_gap
      risks:
        - Mara leaves with a theory, not a confession.
      immediateOutcome: Elias relaxes too early and gives Mara one more minute with the pattern.
      delayedRisk: Banking the theory preserves access but forfeits pressure on the room.
      visibleWithinNodes:
        - n038-held-breath
        - e120-silent-ending
  - id: summon-staff
    text: Ring for the staff member who cleared the tray and watch who Elias protects first.
    to: n037-service-landing
    effects:
      - op: decrement
        target: trust.host
        value: 5
    thriller:
      intent: investigate
      costs: [trust, time]
      reveals:
        - clue.projector_inventory_gap
      risks:
        - Bringing a second witness into the scene multiplies theories and burns social cover.
      immediateOutcome: Elias loses the benefit of speaking for the whole house.
      delayedRisk: A wider suspect field makes certainty harder to keep.
      visibleWithinNodes:
        - n037-service-landing
        - e140-housekeeper-ending
        - e150-vanished-guest-ending
  - id: force-admission
    text: "Read the sequence aloud: missing name, removed card, missing projection case."
    to: e130-staged-guest-ending
    effects:
      - op: decrement
        target: trust.host
        value: 15
    thriller:
      intent: accuse
      costs: [trust, safety]
      reveals:
        - clue.guest_card_removed
        - clue.projector_inventory_gap
      risks:
        - If the theory is weak, Elias can still reframe the evening as paranoia.
      immediateOutcome: Elias is forced to correct Mara's theory instead of smoothing over it.
      delayedRisk: A direct accusation collapses the room into a single contested theory.
      visibleWithinNodes:
        - e130-staged-guest-ending
---

# Nameplate Audit

Shared investigation beat that converts atmosphere clues into a causal theory.
