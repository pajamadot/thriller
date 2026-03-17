---
id: n010-foyer-arrival
kind: scene
title: Foyer Arrival
location: loc.foyer
thriller:
  promise: The house may already know why Mara came, and Elias is controlling what she sees first.
  mysteryQuestion: Why is the side door recently used if the estate is supposed to be sealed for the storm?
  pressure: medium
  introducesClues:
    - clue.rain_cut_road
    - clue.side_door_fresh_scratches
  suspicionTargets:
    - char.host
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
    text: The foyer smells of rain, old varnish, and something hotter underneath, like film left too close to a lamp.
  - kind: dialogue
    speaker: char.host
    expression: calm
    text: Welcome. The storm cut the road behind you ten minutes ago, so whatever brought you here is staying the night.
choices:
  - id: inspect-door
    text: Test the scratched side door before Elias can redirect you.
    to: n020-door-check
    effects:
      - op: decrement
        target: trust.host
        value: 5
    thriller:
      intent: investigate
      costs: [trust, time]
      reveals:
        - clue.side_door_fresh_scratches
      risks:
        - Elias sees that Mara is already looking for a hidden room.
  - id: follow-host
    text: Let Elias choose the route and study what he avoids mentioning.
    to: n030-hallway-led
    effects:
      - op: set
        target: flag.followed_host
        value: true
      - op: increment
        target: trust.host
        value: 10
    thriller:
      intent: comply
      costs: [access, information]
      reveals:
        - clue.host_controls_route
      risks:
        - The player gives up immediate access to the side door.
---

# Foyer Arrival

Use `scene` for most visual novel moments.
