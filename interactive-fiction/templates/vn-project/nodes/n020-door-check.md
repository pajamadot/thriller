---
id: n020-door-check
kind: condition
title: Door Check
expression:
  all:
    - var: flag.key_found
      op: eq
      value: true
onTrue: n040-secret-room
onFalse: e100-locked-out
---

# Door Check

Logic-only node. No player-facing prose required.
