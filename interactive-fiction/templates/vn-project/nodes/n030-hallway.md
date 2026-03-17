---
id: n030-hallway
kind: scene
title: Hallway
location: loc.hallway
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
    text: The portraits seem to watch Mara as she walks.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: My family had a habit of keeping secrets in plain sight.
choices:
  - id: press-host
    text: Ask what he means.
    to: e110-curious-ending
  - id: stay-silent
    text: Keep the thought to yourself for now.
    to: e120-silent-ending
---

# Hallway

Example of a standard prose node with local choices.
