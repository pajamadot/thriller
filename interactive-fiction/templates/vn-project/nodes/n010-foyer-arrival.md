---
id: n010-foyer-arrival
kind: scene
title: Foyer Arrival
location: loc.foyer
presentation:
  background: bg.foyer
  music: bgm.intro
cast:
  - character: char.protagonist
    expression: neutral
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
    text: The foyer smells faintly of rain and old varnish.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: Welcome. The storm cut the road behind you.
choices:
  - id: inspect-door
    text: Inspect the locked side door.
    to: n020-door-check
    effects:
      - op: set
        target: flag.key_found
        value: true
  - id: follow-host
    text: Follow Elias deeper into the house.
    to: n030-hallway
    effects:
      - op: set
        target: flag.followed_host
        value: true
      - op: increment
        target: trust.host
        value: 10
---

# Foyer Arrival

Use `scene` for most visual novel moments.
