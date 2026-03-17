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
  routeMemory:
    - flag.followed_host
    - know.host_is_afraid
  payoffs:
    - e120-silent-ending
    - e130-staged-guest-ending
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
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: You are very good at turning household shame into chronology.
choices:
  - id: bank-theory
    text: Keep the pattern to yourself and leave with the sequence intact.
    to: e120-silent-ending
    effects:
      - op: increment
        target: trust.host
        value: 5
    thriller:
      intent: conceal
      costs: [certainty, time]
      reveals:
        - clue.guest_card_removed
        - clue.projector_inventory_gap
      risks:
        - Mara leaves with a theory, not a confession.
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
---

# Nameplate Audit

Shared investigation beat that converts atmosphere clues into a causal theory.
