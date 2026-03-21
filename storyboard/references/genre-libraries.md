# Genre-Specific Shot Libraries v1.0

> 6 genre-specific pattern libraries expressed as delta overlays on the base storyboard system.
> Each library provides idiom modifications, rhythm signatures, evaluation weight overrides,
> genre-defining shots, color/light profiles, and integration notes.
> Band 7 (r061-r070) of the storyboard 100-round evolution.
>
> Sources: Naremore "More Than Night", Olney "Horror Film Aesthetics", Bordwell "Film Art",
> Bong Joon-ho spatial design (Parasite production notes), Tarkovsky "Sculpting in Time",
> Hitchcock/Truffaut interview, Salt "Film Style and Technology", Katz "Shot by Shot"

---

## Zero: Genre Delta Architecture

### Core Principle

A genre library is a **DELTA** applied on top of the base system (shot-logic.md, shot-grammar.md,
visual-rhythm.md, evaluation.md, composition-staging.md, montage-theory.md). The base system
defines universal rules; the genre delta modifies, adds, or suppresses specific elements.

```
base_system + genre_delta = genre-specific_system

The base system is NEVER replaced — only adjusted.
A delta that contradicts a safety rule (e.g., "every cut must have a reason") is INVALID.
```

### Delta Format Specification

```
genre_delta:
  id: <genre_id>                          # unique machine key
  name: <human-readable name>
  description: <one-sentence essence>

  idiom_overrides:                         # modify existing Idioms 1-6
    <idiom_name>:
      <param>: <new_value>                 # override specific parameters
      notes: <why this override>

  added_idioms:                            # new idioms unique to this genre
    - name: <idiom_name>
      state_machine: <FSM definition>
      logic: <why this idiom exists>
      examples: [<film references>]

  removed_patterns:                        # base patterns to suppress
    - pattern: <pattern_name>
      reason: <why suppress>

  rhythm_override:
    avg_duration: <seconds>                # target ASL
    sigma: <seconds>                       # duration variance
    signature: "<time_signature>"          # musical metaphor
    tempo_modifier: <description>          # rubato, accelerando, etc.
    hold_rules: <special duration rules>

  evaluation_weight_override:              # multipliers on base 6-dimension system
    LOGIC: <float>                         # see evaluation.md
    NARR: <float>
    VIS: <float>
    RHYTHM: <float>
    SOUND: <float>
    CRAFT: <float>
    emphasis_note: <what this genre prioritizes>

  color_override:
    base_temp: <warm|cool|neutral|shifting>
    palette: <description>
    light_key: <high-key|low-key|mixed|natural>
    light_source: <description>
    threat_curve: <how color/light changes with tension>
    signature_look: <one-sentence visual identity>

  sound_profile:                           # genre-specific sound design defaults
    music: <approach>
    silence: <usage>
    sfx_emphasis: <description>
    voice: <treatment>

  spatial_tendencies:                      # default staging preferences
    preferred_blocking: <A-I-L preference>
    depth: <flat|deep|variable>
    symmetry: <symmetric|asymmetric|evolving>
    confinement: <open|confined|contrasting>
```

---

## One: Psychological Thriller Library

### Identity

```
id: psych_thriller
name: Psychological Thriller
description: Interior horror externalized through framing — the camera as unreliable witness.
essence: "The mind is the crime scene."

Reference films:
  - Black Swan (Aronofsky, 2010)
  - Shutter Island (Scorsese, 2010)
  - Gone Girl (Fincher, 2014)
  - Perfect Blue (Kon, 1997)
  - Caché (Haneke, 2005)
  - The Machinist (Anderson, 2004)
```

### Idiom Overrides

```
Establishing Sequence (Idiom 1):
  override: Delay the establishing shot.
    Default (base): ELS → LS → MS
    Psych-thriller: MS (character in undefined space) → dialogue/action →
                    LS/ELS (only when space becomes narratively relevant)
  reason: Withholding spatial context creates unease. The audience cannot
          orient themselves = the character cannot orient themselves.
  additional_rule: When establishing finally occurs, use a SLOW REVEAL
                   (camera movement, not cut) to make space feel discovered.

Shot-Reverse-Shot (Idiom 2):
  override:
    cu_ratio: +10% (more CU usage in dialogue, fewer OTS)
    ots_reduction: reduce OTS by 15%
    asymmetric_framing: frame one character with more headroom/negative space
                        than the other → visual inequality = psychological dominance
    eye_contact_avoidance: 30% of CU shots should have characters looking
                           slightly off-axis (not directly at conversation partner)
                           → suggests internal distraction or deception
  reason: Tighter framing increases claustrophobia. Asymmetry externalizes
          power imbalance. Off-axis gaze signals unreliable interiority.

Reveal Sequence (Idiom 3):
  override:
    preferred_mode: C (Delayed) — reaction before cause is default
    progressive_mode_frequency: reduce to 20% of reveals
    sudden_mode: reserve for act-ending twists only
    added_beat: after the delayed reveal, add a 2nd CU of the reactor
                showing a DIFFERENT expression than the first reaction
                → was the first reaction genuine?
  reason: Delayed reveals force the audience to read faces before facts.
          The double-reaction-check is the genre's signature move — it
          plants doubt about what the character truly felt.

Voyeur/Surveillance Sequence (Idiom 5):
  override:
    self_surveillance: allow the character to surveil THEMSELVES
                       (mirrors, security footage of self, photos of self)
    remove_framework: 40% of voyeur shots should lack the typical
                      framing device (door crack, binoculars) → ambiguity
                      about whether this is surveillance or self-awareness
  reason: In psychological thrillers, the watched and the watcher are
          often the same person. Removing the voyeur framework blurs
          subjective and objective reality.
```

### Added Idioms

```
Idiom P1: Mirror Shot Sequence
  state_machine:
    [reflection visible] → CU of face WITH reflection visible →
    CU of face WITHOUT reflection → CU of reflection ONLY →
    [divergence point: face and reflection show different states]

  logic: The mirror externalizes psychological duality. When face and
         reflection diverge (different expression, different lighting,
         different action), the audience registers dissociation.

  parameters:
    reflection_medium: mirror, water, glass, phone screen, polished surface
    divergence_timing: never in first 30% of story; gradually increase
    maximum_divergence: reflection acts independently = psychotic break
    framing: both face and reflection must be in sharp focus (split diopter
             or deep focus) — the competition between them is the point

  examples:
    - Black Swan: Natalie Portman's reflection moves independently
    - Perfect Blue: Mima sees her idol self in reflections
    - The Machinist: Bale's reflection shows a healthier version

Idiom P2: The Empty Frame Hold
  state_machine:
    [character in frame] → character exits frame → camera HOLDS on empty space
    (3-8 seconds) → [something in the empty space changes or doesn't]

  logic: Holding on emptiness after a character exits creates anticipatory
         dread. The audience expects something to fill the void. When
         nothing does, the absence itself becomes threatening. When something
         subtle does (shadow shift, door slightly ajar), it's worse.

  parameters:
    minimum_hold: 3s (below this, reads as normal exit)
    maximum_hold: 8s (above this, reads as art-house, not thriller)
    empty_frame_content: the space should contain a meaningful element
                         (the chair they sat in, the door they used, a window)
    post_hold_action: 40% nothing (pure dread), 40% subtle change (terror),
                      20% character re-enters (relief/shock)

  examples:
    - Caché: static wide shot holds for minutes, threat is in the waiting
    - The Shining: Kubrick holds on empty corridors
    - Zodiac: interrogation room after suspect leaves

Idiom P3: Unreliable POV Sequence
  state_machine:
    [subjective POV established] → POV shot shows scene X →
    [time passes, trust builds] → scene X is revisited from OBJECTIVE angle →
    [objective shot contradicts the POV] → CU reaction of character who
    provided the POV → [audience trust in character collapses]

  logic: First show the character's subjective experience as if it were
         objective truth. Later, reveal the objective truth that contradicts it.
         The gap between the two shots IS the psychological thriller.

  parameters:
    trust_building_period: minimum 3 scenes between POV and contradiction
    contradiction_type: factual (different events), perceptual (same events,
                        different details), emotional (same events, different
                        tone — warm vs. cold lighting)
    POV_markers: subtle — do NOT use obvious distortion on the initial POV
                 (that would warn the audience it's unreliable)
    revelation_framing: the objective shot should use a DIFFERENT angle and
                        scale from the POV to maximize cognitive dissonance

  examples:
    - Shutter Island: Teddy's memories are subtly altered
    - Gone Girl: "Amazing Amy" diary sequence vs. reality
    - A Beautiful Mind: Charles exists only in Nash's POV
```

### Removed Patterns

```
- pattern: Standard master-shot coverage
  reason: Full master coverage implies an objective viewpoint exists.
          In psychological thrillers, objective reality is suspect.
          Use master shots sparingly and only when you WANT the audience
          to feel secure (before destroying that security).

- pattern: Symmetrical two-shot framing in dialogue
  reason: Visual balance implies psychological balance. Reserve symmetry
          for moments of false calm; default to asymmetric framing.
```

### Rhythm Signature

```
signature: 4/4 rubato
avg_duration: 4.5s
sigma: 2.5s (high variance)
tempo_modifier: rubato — the beat exists but is constantly stretched and
                compressed unpredictably, like breathing that can't find
                its rhythm.

hold_rules:
  - CU on faces: 5-8s (longer than base system's 2-5s)
    reason: the audience must have time to read micro-expressions and
            doubt what they see
  - revelation bursts: 0.5-1.5s rapid cuts (3-5 shots)
    reason: cognitive overload during truth-collapse moments
  - empty frame holds: 3-8s
    reason: see Idiom P2 above

rhythm_arc_template:
  act_1: measured, slightly slow (ASL ~5s) → build false normalcy
  act_2_rising: variance increases (sigma → 3.0s) → reality fracturing
  act_2_midpoint: single very long hold (10-15s) → the moment truth leaks
  act_3: alternation between very long holds and very short bursts
         → the mind oscillating between denial and acceptance
  climax: rhythm collapses to near-stillness (one long take or very few cuts)
         → there is no more hiding from the truth
```

### Evaluation Weight Override

```
LOGIC:  1.3  (every cut must be narratively justified — loose logic breaks
              the psychological contract with the audience)
NARR:   1.2  (the visual narrative must track the protagonist's internal
              arc precisely; misalignment reads as incompetence, not style)
VIS:    1.0  (standard — visuals serve the psychology, not the other way)
RHYTHM: 1.0  (standard — though the rubato pattern itself is tested within
              this dimension)
SOUND:  1.1  (silence and ambiguous sound are core tools)
CRAFT:  0.9  (craft is valued but should not draw attention to itself;
              the audience should not notice the technique)

emphasis_note: "LOGIC and NARR dominate. Every visual choice must answer
               the question: does this shot make the audience trust or
               doubt the character's reality? If it does neither, it's
               wrong."
```

### Color / Light Profile

```
base_temp: shifting (warm → cool transition as truth approaches)
palette: desaturated warm tones in "safe" scenes, progressing to
         steel blues and sickly greens as reality fractures
light_key: mixed — starts as natural key, degrades to low-key
light_source: single-source side-lighting as default; the lit half
              of the face is the persona, the shadow half is the truth
threat_curve: color temperature drops 200K per act; by act 3, only
              cool sources remain; warm light in act 3 = false safety
signature_look: "A face half-lit, half-shadowed, looking at something
                 the audience cannot see."

specific_techniques:
  - practical_lights: prefer motivated light sources (lamps, screens, windows)
                      that the character can interact with (turning off a lamp =
                      choosing darkness = choosing to hide)
  - color_contamination: as the thriller progresses, introduce one
                         "wrong" color into scenes (a green cast in a warm room,
                         a warm leak in a cold hospital) — subliminal wrongness
  - shadow_independence: in key moments, a character's shadow should
                         behave slightly differently from the character
                         (larger, delayed, pointing a different direction)
```

### Sound Profile

```
music: sparse; diegetic music preferred over score; when score is used,
       it should be uncertain whether it's diegetic or non-diegetic
silence: primary weapon — silence should precede every major revelation
         by at least 3 seconds; sudden silence is more threatening than
         sudden sound
sfx_emphasis: body sounds (breathing, heartbeat, swallowing, footsteps
              on different surfaces) — the body betrays the mind
voice: internal monologue is unreliable; when used, it should occasionally
       contradict what the image shows
```

### Spatial Tendencies

```
preferred_blocking: I-type (parallel, not facing) for characters who
                    are emotionally disconnected; A-type (confrontational)
                    reserved for truth-telling scenes
depth: deep staging — place meaningful objects in background that the
       character ignores but the audience can see
symmetry: asymmetric default; symmetry reserved for false normalcy
confinement: progressively confined — spaces shrink as the thriller
             tightens; ceiling visible in frame = trapped
```

---

## Two: Film Noir Library

### Identity

```
id: noir
name: Film Noir
description: Moral ambiguity rendered in light and shadow — the city as psyche.
essence: "Everyone is guilty; the question is of what."

Reference films:
  - Double Indemnity (Wilder, 1944)
  - The Third Man (Reed, 1949)
  - Chinatown (Polanski, 1974)
  - Blade Runner (Scott, 1982)
  - Sin City (Miller/Rodriguez, 2005)
  - Nightcrawler (Gilroy, 2014)
```

### Idiom Overrides

```
Establishing Sequence (Idiom 1):
  override:
    time_of_day: night exterior default (80% of establishing shots)
    weather: wet streets, rain, fog, or steam as atmospheric default
    lighting: neon reflections, streetlamps with halos, car headlights
    camera: slow downward CRANE or TILT from rooftop/sign to street level
    human_presence: silhouettes, not identifiable figures
  reason: Noir cities are characters. The establishing shot introduces
          the moral landscape, not just the physical one. Rain and
          reflections create a doubled world — nothing is what it seems.

Voyeur/Surveillance Sequence (Idiom 5):
  override:
    framework_type: venetian blinds, car windows, alleyway edges,
                    newspaper with eye-holes, bar mirrors
    voyeur_identity: often the PROTAGONIST is the voyeur (detective,
                     journalist, schemer) — voyeurism is normalized
    moral_weight: voyeur shots carry no shame; they carry professional
                  detachment that is itself morally questionable
    lighting: venetian blind shadow pattern on voyeur's face when
              watching through blinds
  reason: In noir, everyone watches everyone. The private eye is defined
          by the act of watching. The venetian blind motif visually
          "imprisons" the watcher in stripes of light and dark.

Shot-Reverse-Shot (Idiom 2):
  override:
    lighting_asymmetry: one character in harsh light, other in shadow
    smoke: cigarette smoke between characters as visual barrier
    angle_bias: slight LOW angle on the femme fatale / power figure;
                slight HIGH angle on the protagonist / mark
    master_shot: wider than standard, showing the space between characters
                 (the distance is meaningful in noir)
  reason: Noir dialogue is verbal combat. Lighting tells you who has
          power before a word is spoken. Smoke creates visual texture
          and obscures faces = obscures truth.

Reveal Sequence (Idiom 3):
  override:
    preferred_mode: A (Progressive) — the slow burn is noir's tempo
    light_reveal: the reveal itself is often literally a light source
                  (someone turns on a lamp, opens a door to daylight,
                  strikes a match) that illuminates what was in shadow
    post_reveal_beat: after the reveal, cut to a LS showing the full
                      scene in new light — the audience must see how
                      the spatial relationships change with new knowledge
  reason: In noir, truth emerges from darkness literally. The movement
          from shadow to light IS the reveal mechanism.
```

### Added Idioms

```
Idiom N1: Femme Fatale Entrance
  state_machine:
    [door/entrance visible] → LS silhouette in doorway (backlit, features
    invisible) → slow TRACK or DOLLY toward figure → MS reveal (face
    still partially in shadow, body language first) → MCU (partial face,
    one eye lit) → CU (full face, both eyes, direct to camera or to
    protagonist)

  logic: The femme fatale is introduced as a shape before a person,
         a body before a face, a mystery before an identity. Each stage
         reveals more but never everything. The audience and protagonist
         are seduced in the same sequence.

  parameters:
    lighting_at_each_stage:
      LS: complete backlight, silhouette only
      MS: side light, body contours visible, face half-shadow
      MCU: key light on one eye and lips
      CU: full face lit but with shadow pocket under chin or across one eye
    duration: 8-15 seconds total (slow is essential)
    music: entrance should have its own musical motif or silence
    protagonist_reaction: intercut at MS stage — CU of protagonist
                          watching (establishing desire/doom)

  examples:
    - Double Indemnity: Stanwyck on the staircase
    - The Maltese Falcon: Mary Astor's first appearance
    - Body Heat: Kathleen Turner walking toward William Hurt

Idiom N2: The Venetian Shadow Shot
  state_machine:
    [character near window with blinds] → CU of face with striped light/
    shadow pattern from venetian blinds → character moves through the
    pattern (stripes slide across face) → face settles into half-light/
    half-dark division

  logic: The stripes externalize moral ambiguity — the character is
         literally divided into light and dark. This is noir's most
         iconic single shot. The movement through the pattern suggests
         the character moving through moral territory.

  parameters:
    stripe_direction: horizontal (classic) or diagonal (more dynamic)
    face_settling: character's face should settle with the shadow line
                   bisecting it vertically — one eye lit, one in shadow
    accompanying_action: often the character is making a moral decision,
                         confessing, or lying during this shot
    duration: 4-8s minimum — the audience must register the symbolism

  examples:
    - The Killers (Siodmak, 1946): Burt Lancaster in hotel room
    - Blade Runner: almost every interior scene
    - Sin City: Marv in multiple sequences

Idiom N3: Wet Street Reflection Shot
  state_machine:
    [exterior, night, wet surface] → camera LOW angle or GROUND level →
    frame shows the reflection in the puddle/wet street of a character,
    sign, or building → the reflection is INVERTED, distorted by ripples →
    optional: character walks through the reflection, shattering it →
    optional: camera TILTS UP from reflection to actual subject

  logic: The reflected world is the noir world — inverted, distorted,
         unstable. Showing reflection before reality establishes that
         in noir, what you see first is always the distorted version.

  parameters:
    reflection_clarity: partially distorted (ripples, imperfections)
    transition: reflection → reality should use a SLOW TILT (not a cut)
                to maintain the connection between the two worlds
    content: the reflection should show something the direct shot doesn't
             (a second figure, a sign, a detail) — the reflected world
             contains more information than the "real" one

  examples:
    - The Third Man: famous sewer sequences
    - Blade Runner: cityscape reflections
    - Nightcrawler: Los Angeles streets at night
```

### Removed Patterns

```
- pattern: High-key even lighting in dialogue scenes
  reason: Even lighting implies moral clarity. Noir has none.
          All dialogue must have at least one face partially in shadow.

- pattern: Bird's-eye establishing shots in daytime
  reason: The overhead daylight view implies omniscient clarity.
          Noir operates at street level, in darkness.
          BIRD angle is reserved for crime scenes (looking down at
          the body = looking down at consequence).

- pattern: Smooth, balanced two-shots
  reason: Balance implies equality and fairness. Noir characters are
          never equal. One always has power over the other, and the
          lighting/framing must show it.
```

### Rhythm Signature

```
signature: 4/4 slow
avg_duration: 5.0s
sigma: 3.0s (high variance — noir oscillates between contemplative
       stillness and sudden violence)
tempo_modifier: slow burn with staccato interruptions — long tracking
                shots punctuated by sudden cuts to violence or revelation

hold_rules:
  - tracking shots: 8-15s (the camera follows characters through noir
    spaces, showing the environment as they navigate it)
  - violence cuts: < 1s (violence in noir is sudden and brief)
  - post-violence hold: 4-8s (the aftermath is longer than the act)
  - cigarette/drink pauses: 3-6s (ritualistic beats that create
    breathing room and character texture)

rhythm_arc_template:
  act_1: deliberate, almost languid (ASL ~6s) → establishing the trap
  act_2_rising: rhythm tightens but maintains long-shot elegance →
                the net closes slowly
  act_2_midpoint: sudden burst of violence or revelation (3-5 shots
                  at < 2s each) → the world inverts
  act_3: return to deliberate pacing but now it feels oppressive,
         not elegant → the character walks knowingly toward doom
  climax: single long take or slow dissolve → inevitability
```

### Evaluation Weight Override

```
VIS:    1.3  (noir IS its visual language; if it doesn't look like noir,
              it isn't noir — lighting, shadow, composition are paramount)
CRAFT:  1.2  (noir demands stylistic commitment; generic coverage is
              a betrayal of the form)
SOUND:  1.1  (voiceover narration, jazz score, city ambience, silence
              before violence — sound creates the noir mood)
LOGIC:  1.0  (standard — noir plots can be convoluted but shot logic
              must be clean)
NARR:   0.9  (narrative can be deliberately non-linear or confusing;
              this is not a flaw in noir)
RHYTHM: 0.9  (the slow pace is intentional; do not penalize deliberate
              slowness if it serves atmosphere)

emphasis_note: "VIS and CRAFT dominate. The question is not 'does this
               advance the plot?' but 'does this look and feel like a
               world where everyone is damned?' If yes, the shot is
               justified."
```

### Color / Light Profile

```
base_temp: cool (blue-tinted nights, tungsten warm only for trap scenes
           — the warm light in noir is bait)
palette: high-contrast monochrome tendency; if color, desaturated with
         one accent color (red for danger/desire, amber for corruption,
         blue-green for alienation)
light_key: low-key (key-to-fill ratio 8:1 or higher)
light_source: single harsh source — streetlamp, desk lamp, car headlights,
              neon sign, match flame; multiple sources = visual clarity =
              against noir philosophy
threat_curve: darkness deepens as the story progresses; act 1 has some
              ambient light; act 3 is almost entirely single-source;
              the final scene is often the darkest
signature_look: "A face half-swallowed by shadow, lit by a source that
                 could go out at any moment."

specific_techniques:
  - chiaroscuro: extreme light/dark contrast on faces and environments
  - motivated_shadows: every shadow should be cast by a visible source
  - smoke_diffusion: cigarette smoke, fog, and steam used to diffuse
                     light and create depth layers
  - neon_as_character: neon signs provide colored light that contaminates
                       the cool palette — their text often comments on
                       the scene ("VACANCY", "LOANS", "EXIT")
  - rim_lighting: outline characters against dark backgrounds so they
                  exist as luminous edges against void
```

### Sound Profile

```
music: jazz (solo saxophone or piano for contemplation, full ensemble
       for set pieces); score should feel like it's coming from a bar
       down the street — distance and echo are authentic
silence: used before violence; after violence, city sounds return slowly
         (sirens, rain, distant traffic) — the city doesn't care
sfx_emphasis: city sounds (rain on metal, footsteps on wet pavement,
              car engines, doors closing, phone ringing in empty rooms),
              gunshots are LOUD and singular (not movie-gun sounds)
voice: voiceover narration in past tense is genre-canonical; the narrator
       knows how this ends; use sparingly but when used, let it carry
       the scene over visual montage
```

### Spatial Tendencies

```
preferred_blocking: A-type (confrontational) for interrogations and
                    seduction; L-type (adjacent, both facing same
                    direction) for scenes of shared doom
depth: deep — always show the depth of the space; doorways visible
       behind characters, corridors stretching into darkness, windows
       to outside world
symmetry: asymmetric (power imbalance is visual law)
confinement: confined interiors (offices, bars, apartments) vs.
             empty exteriors (streets, docks, parking lots) — both
             feel isolating; there is no safe space in noir
```

---

## Three: Procedural Library

### Identity

```
id: procedural
name: Procedural Thriller
description: The investigation as visual methodology — the camera as evidence collector.
essence: "The truth is in the details."

Reference films:
  - Zodiac (Fincher, 2007)
  - All the President's Men (Pakula, 1976)
  - Spotlight (McCarthy, 2015)
  - Memories of Murder (Bong, 2003)
  - The Silence of the Lambs (Demme, 1991)
  - Sicario (Villeneuve, 2015)
```

### Idiom Overrides

```
Establishing Sequence (Idiom 1):
  override:
    clinical_framing: camera should feel observational, not dramatic
                      — documentary aesthetic for establishing shots
    text_overlays: location/time stamps are genre-canonical
                   (accept text-on-screen as part of the visual language)
    lighting: institutional lighting (fluorescent, overhead, flat) for
              interior establishing; natural/available light for exterior
    movement: STATIC or slow, methodical PAN — no dramatic crane/dolly
  reason: The procedural camera is a neutral observer. Dramatic camera
          work would imply editorial judgment; the procedural reserves
          judgment until the evidence is assembled.

Shot-Reverse-Shot (Idiom 2):
  override:
    framing: frontal — characters speak directly toward camera (Demme style)
             at 40% frequency, vs standard OTS
    eye_contact: direct-to-camera (or near-camera) creates interrogation
                 feeling — the audience is being questioned too
    lighting: even, institutional — no dramatic shadows during interviews
    matching: shot sizes should be precisely matched between characters
              in an interview = visual equality until evidence proves
              otherwise
  reason: Frontal framing (The Silence of the Lambs) puts the audience in
          the position of the investigator. Matched framing implies
          procedural fairness that may be an illusion.

Reveal Sequence (Idiom 3):
  override:
    preferred_mode: A (Progressive) — evidence accumulates, never arrives
                    suddenly; the procedural reveal is always a MONTAGE
                    of clues assembling, not a single shot
    evidence_accumulation: the reveal sequence should include 3-5 INSERT
                           shots of documents/photos/objects before the
                           conclusion shot
    scale_pattern: INSERT → INSERT → INSERT → MS(reaction) → LS(consequence)
    verbal_component: the reveal is often spoken (a character explains)
                      while inserts show proof — dual-channel delivery
  reason: In procedurals, truth is constructed from evidence, not
          discovered in a single moment. The visual language must
          reflect this methodology.

Reaction Chain (Idiom 6):
  override:
    reaction_type: professional, not emotional — CU reactions should show
                   thinking, not feeling (eye movement, jaw tension, pen
                   tapping, note-taking)
    group_reaction: in briefing/meeting scenes, use a SLOW PAN across
                    faces rather than individual cuts — more efficient,
                    and suggests the institution as protagonist
    information_processing: reactions should be intercut with what's being
                            reacted to (evidence) — the viewer processes
                            alongside the characters
  reason: Procedural characters are defined by competence, not emotion.
          Their reactions are analytical, and the camera reflects this.
```

### Added Idioms

```
Idiom R1: Evidence INSERT Sequence
  state_machine:
    [evidence introduced] → INSERT of document/photo/object (2-3s, sharp
    focus, flat lighting) → TILT or PAN across detail within INSERT →
    second INSERT of different evidence → third INSERT connecting the two →
    CU of investigator's hands or eyes → MS reaction (the synthesis moment)

  logic: Evidence is shown before it's interpreted. The INSERT sequence
         forces the audience to examine the evidence themselves before
         the character tells them what it means. This creates procedural
         engagement — the audience investigates alongside the protagonist.

  parameters:
    INSERT_lighting: flat, even, forensic — like a lab or evidence room
    INSERT_angle: directly overhead (BIRD) for documents, EYE level for
                  physical objects — clinical perspective
    focus: razor-sharp with shallow DoF isolating the evidence from
           background
    hand_presence: investigator's hands (gloved or ungloved) should be
                   visible in 60% of evidence INSERTs — grounding the
                   evidence in the investigation process
    labeling: when text is visible, it should be readable — the audience
              is meant to read it

  examples:
    - Zodiac: the cypher examination sequences
    - All the President's Men: notepad and phone number sequences
    - Spotlight: spreadsheet and document review

Idiom R2: Surveillance Footage Aesthetic
  state_machine:
    [surveillance context] → wide shot with surveillance characteristics
    (fixed angle, slightly degraded, timestamp overlay, single focal
    length) → hold for extended duration → subject enters/exits frame
    without camera acknowledgment → camera does NOT follow

  logic: Incorporating the visual language of actual surveillance (CCTV,
         body cameras, phone recordings) into the film language creates
         authenticity and reminds the audience that the investigation
         exists within a system of institutional observation.

  parameters:
    visual_degradation: slight — not so much that information is lost,
                        but enough that the source is identifiable
                        (grain, compression artifacts, slight color shift)
    camera_behavior: absolutely STATIC; does not pan, tilt, or zoom;
                     does not follow subjects; does not adjust exposure
    timestamp: visible in corner; time may jump (indicating edited footage)
    audio: degraded ambient sound, no music; room tone dominates
    integration: used for 10-20% of total shots in surveillance-heavy
                 sequences; intercut with standard coverage

  examples:
    - Zodiac: basement scene's flat, inescapable framing
    - The Conversation: actual surveillance recordings
    - Sicario: thermal/night-vision sequences

Idiom R3: The Briefing Sequence
  state_machine:
    [team assembled] → MS of speaker + visual aid (board, screen, map) →
    INSERT of visual aid detail → reaction PAN across team → back to
    speaker → INSERT of different detail → specific team member CU
    (the one who will act on this information) → MS of speaker concluding

  logic: The briefing is the procedural's exposition mechanism. It
         delivers information efficiently while establishing team dynamics
         through reaction shots. The final CU singles out the operational
         protagonist.

  parameters:
    visual_aid: always present — map, whiteboard, crime scene photos,
                digital display; the information has been externalized
    lighting: institutional (fluorescent/overhead); the room is a
              workspace, not a dramatic set
    pacing: measured, informational — ASL should be 4-6s within
            the briefing
    team_dynamics: the PAN across faces should reveal who agrees,
                   who doubts, who is distracted

  examples:
    - Sicario: every mission briefing
    - Spotlight: editorial meetings
    - Memories of Murder: police station briefings
```

### Removed Patterns

```
- pattern: Dutch angles
  reason: Tilted framing implies subjective distortion. The procedural
          camera is level, stable, and objective. Emotional destabilization
          comes from content, not camera angle.

- pattern: Slow-motion
  reason: Time manipulation is anti-procedural. Events happen in real
          time; the investigation reconstructs them in real time.
          The only time manipulation is the time JUMP (cutting forward
          past routine work).

- pattern: Dolly zoom / vertigo effect
  reason: Perceptual distortion contradicts the procedural's commitment
          to observational clarity. If the character is disoriented,
          show it through performance, not camera tricks.
```

### Rhythm Signature

```
signature: 4/4 strict
avg_duration: 4.0s
sigma: 1.8s (low variance — procedurals have disciplined, methodical pacing)
tempo_modifier: metronomic with editorial acceleration — the rhythm is
                steady during investigation, compresses during breakthroughs,
                and returns to baseline after each phase.

hold_rules:
  - interview CUs: 3-5s (enough to read the face, not enough to dwell)
  - evidence INSERTs: 2-3s (readable but not lingering)
  - establishing shots: 3-5s (efficient orientation)
  - breakthrough moments: single shot held 6-10s as information lands
  - transition pauses: 1-2s of institutional space (hallway, parking lot)
    between scenes = decompression

rhythm_arc_template:
  act_1: steady, unhurried (ASL ~4.5s) → the investigation begins
  act_2_rising: rhythm tightens slightly (ASL ~3.5s) → leads multiply
  act_2_midpoint: a breakthrough sequence accelerates (ASL ~2.5s for
                  8-12 shots) then immediately returns to steady pace
  act_3: the rhythm DOES NOT accelerate as expected; it becomes
         deliberately steady even as tension rises → the procedure
         continues regardless of emotional pressure
  climax: the procedural's tragedy is often that the rhythm never breaks;
          the machinery continues; the final shot is often a held MS
          of the investigator, alone, still working
```

### Evaluation Weight Override

```
LOGIC:  1.3  (procedurals demand rigorous information delivery; every
              shot must serve the investigation's logic)
NARR:   1.1  (narrative must track the investigation arc precisely;
              evidence must be visually planted before it's referenced)
VIS:    0.9  (visual style is deliberately restrained; penalize
              over-stylization)
RHYTHM: 1.1  (disciplined pacing is essential; penalize erratic rhythm
              unless justified by a breakthrough sequence)
SOUND:  1.0  (standard — ambient and diegetic sound matter but don't
              need to dominate)
CRAFT:  0.9  (craft should be invisible; the camera should not call
              attention to itself; penalize showy technique)

emphasis_note: "LOGIC dominates absolutely. The procedural camera is a
               scientific instrument. Ask: does this shot deliver evidence,
               record a reaction to evidence, or establish the space where
               evidence exists? If none, the shot is unjustified."
```

### Color / Light Profile

```
base_temp: neutral to cool (institutional color palette)
palette: desaturated naturalism — the world of fluorescent offices, gray
         parking structures, beige conference rooms; occasional color
         comes from evidence (blood, photographs, neon crime scenes at night)
light_key: mixed — high-key for office/institutional spaces (overhead
           fluorescents); low-key for field work and crime scenes
light_source: practical and institutional — fluorescent tubes, desk lamps,
              overhead panels, car dashboards; NO unmotivated dramatic
              lighting
threat_curve: minimal color change with tension; the visual world stays
              neutral even when the content is horrifying — the contrast
              between flat visual tone and disturbing content IS the
              procedural's horror
signature_look: "A fluorescent-lit office where someone is quietly
                 assembling proof of the unthinkable."

specific_techniques:
  - flat_fluorescent: the sickly green-white of institutional fluorescent
                      lighting is the procedural's signature color
  - crime_scene_contrast: crime scenes are lit differently from
                          investigation spaces — they intrude visually
  - screen_glow: computer screens, phone screens, projectors as light
                 sources — information delivery as illumination
  - natural_light_decay: as the investigation stretches, scenes move
                         later into the night; the investigator's world
                         becomes darker not for dramatic reasons but because
                         they simply haven't gone home
```

### Sound Profile

```
music: minimal or absent during investigation; score enters only for
       thematic transitions (passage of time, emotional weight of
       consequence); music should feel like a documentary score, not
       a thriller score
silence: used functionally — silence when reading documents, examining
         evidence; the absence of sound = focus
sfx_emphasis: phones ringing, keyboards typing, paper shuffling, pens
              writing, car doors closing, fluorescent hum, distant sirens;
              the soundscape of institutional work
voice: clear, articulate dialogue — no mumbling, no overlap; the audience
       must hear and process information; occasional voiceover for
       document reading
```

### Spatial Tendencies

```
preferred_blocking: L-type (adjacent, both facing the evidence/board/screen)
                    for collaborative scenes; A-type for interrogation only
depth: moderate — offices and conference rooms are typically shallow spaces;
       depth appears in corridors, parking garages, streets
symmetry: symmetric for institutional spaces (the system has order);
          asymmetric when the investigator works alone (the individual
          against the system)
confinement: institutional confinement — not claustrophobic but bounded;
             the investigator is always within walls, within systems
```

---

## Four: Horror-Adjacent Library

### Identity

```
id: horror_adj
name: Horror-Adjacent Thriller
description: The unseen as more terrifying than the seen — negative space as threat.
essence: "What the camera refuses to show is what will destroy you."

Reference films:
  - The Shining (Kubrick, 1980)
  - Hereditary (Aster, 2018)
  - It Follows (Mitchell, 2014)
  - The Wailing (Na Hong-jin, 2016)
  - Rosemary's Baby (Polanski, 1968)
  - Under the Skin (Glazer, 2013)
```

### Idiom Overrides

```
Establishing Sequence (Idiom 1):
  override:
    duration: extend to 150% of base (6-12s for ELS/LS)
    movement: slow, creeping movement preferred — DOLLY IN at barely
              perceptible speed; the camera approaches whether we want
              it to or not
    negative_space: 40%+ of frame should be empty (ceiling, dark corners,
                    deep background) → threat lives in emptiness
    time_manipulation: establish at slightly wrong time of day (dusk,
                       pre-dawn, blue hour) → familiar spaces feel alien
    sound: ambient sound should be slightly wrong (too quiet, wrong
           insects, distant sound that shouldn't be there)
  reason: Horror-adjacent establishing shots must make the familiar
          threatening. The camera lingers because leaving is not an option.
          Negative space is not wasted space — it's where the threat hides.

Shot-Reverse-Shot (Idiom 2):
  override:
    eyeline_mismatch: deliberately break eyeline matching in 20% of
                      reverse shots — characters seem to look past each
                      other, or at something behind the conversation partner
    widening_shots: as conversation progresses, slowly widen the frame
                    (CU → MCU → MS) — pulling back against conversational
                    logic, as if the camera is retreating
    background_intrusion: in 30% of OTS shots, place an ambiguous shape
                          or movement in the deep background — visible but
                          not acknowledged by characters
  reason: Horror-adjacent dialogue must feel infected. The conversation
          is never the only thing happening. The widening frame suggests
          the camera (audience) wanting to keep more of the space visible
          out of defensive instinct.

Reveal Sequence (Idiom 3):
  override:
    preferred_mode: mixed — 50% Delayed (C), 50% ANTI-reveal
    anti_reveal_definition: the reveal sequence progresses normally but
                            at the moment of revelation, the camera LOOKS
                            AWAY (pans to a wall, cuts to a different room,
                            goes to black) — denying the audience the
                            catharsis of seeing
    post_reveal: if the reveal IS shown, hold on it 200% longer than
                 comfortable — force the audience to sit with the horror
    reaction_focus: reaction shots should show the character TRYING to
                    look away but unable to
  reason: Horror lives in what is withheld or held too long. The anti-reveal
          creates a horror that the audience constructs in their imagination
          (always worse than anything shown). The extended hold weaponizes
          duration against comfort.

Chase/Urgency Sequence (Idiom 4):
  override:
    speed: DO NOT accelerate rhythm — horror chases are slow
    pursuer_visibility: the pursuer should be visible in FEWER shots than
                        the base idiom prescribes (30% vs 50%)
    pursuer_speed: the pursuer should appear to move SLOWER than the pursued
                   yet remain at the same distance — this is more terrifying
                   than speed (It Follows)
    environment: the environment should provide no help (doors that lead
                 to more corridors, rooms that connect back to where they
                 started)
  reason: Speed is the language of action, not horror. Horror's chase is
          defined by inevitability, not velocity. The threat that walks
          is more terrifying than the threat that runs.
```

### Added Idioms

```
Idiom H1: Negative Space Threat
  state_machine:
    [scene begins] → frame with 40%+ negative space (dark area, empty
    room, corridor end, ceiling corner) → character occupies 30% of frame
    in one area → negative space HOLDS ATTENTION because something might
    be in it → nothing appears (tension through absence) →
    [optional: much later, something IS in that space, in the same framing]

  logic: Train the audience to fear empty space. Once the pattern is
         established (empty space = potential threat), every frame with
         significant negative space becomes a fear delivery mechanism,
         regardless of whether anything appears.

  parameters:
    negative_space_ratio: 40-60% of frame area
    character_position: push to frame edge, NOT center — centering a
                        character provides psychological stability
    space_consistency: use the SAME composition repeatedly — the audience
                       recognizes the setup and fears it more each time
    payoff_frequency: only 20-30% of negative space setups should pay off
                      with actual threat → the uncertainty is the weapon
    payoff_timing: never in the first half of the story; the first payoff
                   should come late enough that the audience has relaxed

  examples:
    - Hereditary: corners of ceilings, dark backgrounds
    - The Shining: corridors with symmetry and depth
    - It Follows: backgrounds with distant figures

Idiom H2: Off-Screen Horror
  state_machine:
    [horror event occurs] → camera is on the WITNESS, not the event →
    CU of witness face (registering horror) → sound design delivers the
    event information (screams, impacts, wet sounds, silence) →
    camera PANS to aftermath (not the act) → hold on aftermath 5-10s

  logic: What happens off-screen is constructed by the audience's
         imagination and is always worse than anything that could be
         shown. Sound design does the work that the image refuses to do.
         The aftermath shot forces the audience to reconstruct what
         happened, which is a more deeply disturbing cognitive process.

  parameters:
    witness_CU_duration: 4-8s (long enough to watch horror register
                         on the face, phase by phase: confusion → recognition
                         → denial → horror)
    sound_specificity: high — sound must be detailed enough that the
                       audience can construct the visual from audio alone
    pan_to_aftermath: slow, reluctant — the camera moves as if it doesn't
                      want to see either
    aftermath_composition: clinical, still — the horror is over; what
                           remains is evidence
    usage_limit: maximum 2-3 per story — overuse trains the audience
                 to stop imagining

  examples:
    - Hereditary: the car scene — all on the driver's face
    - The Wailing: ritual scenes — partially shown, partially off-screen
    - Rosemary's Baby: the climactic revelation is almost entirely
      denied visually

Idiom H3: Temporal Dread Shot
  state_machine:
    [time feels wrong] → static WIDE shot of a familiar space →
    hold for extended duration (10-30s) → nothing visible changes but
    TIME PASSES (light shifts subtly, clock visible, shadows move) →
    cut to character who was previously in that space → they're not there
    → cut back to the space → it has changed (an object moved, a door
    opened, something is different)

  logic: Horror manipulates time perception. By holding a shot long
         enough that the audience begins to doubt their own memory of
         what the frame contained, the film creates cognitive instability.
         "Did that move? Was that there before?" This is the camera's
         version of the unreliable narrator.

  parameters:
    duration: 10-30s (this is deliberately uncomfortable)
    change_subtlety: the change should be BARELY perceptible — audiences
                     who notice it are rewarded with dread; those who
                     don't will feel unease without knowing why
    light_shift: practical — a cloud passing over the sun, a light
                 flickering — provides cover for the subtle change
    maximum_frequency: once per act — this technique loses power rapidly

  examples:
    - The Shining: long static shots of the hotel
    - Under the Skin: farmhouse scenes
    - Paranormal Activity: the static camera setup
```

### Removed Patterns

```
- pattern: Jump scares via sudden cuts + loud sound (cheap scare)
  reason: This is a horror-ADJACENT library for thriller contexts, not
          a horror film. Jump scares are a reflex, not dread. We want
          sustained psychological tension, not startled reactions.
          If a scare must happen, it should come from WITHIN the frame
          (something appearing in the background), not from the edit.

- pattern: Rapid montage during horror sequences
  reason: Fast cutting fragments the horror and makes it digestible.
          Horror-adjacent sequences should be uncomfortably WHOLE — long
          takes that refuse to cut away, or deliberate refusal to show.

- pattern: Shaky handheld during terror
  reason: Handheld chaos is found-footage language. Horror-adjacent
          thriller uses locked-off or Steadicam — the camera's stability
          contrasted with the character's instability creates unease.
          A perfectly smooth camera following someone who is terrified
          is more disturbing than shaking with them.
```

### Rhythm Signature

```
signature: 3/4 adagio (waltz-like — elegant, off-balance, unhurried)
avg_duration: 5.5s
sigma: 3.5s (very high variance — extreme holds and sudden cuts coexist)
tempo_modifier: adagio with fermata — the rhythm is slow and regular
                until it ISN'T, and the irregularity is the terror.
                Fermata (held notes) appear as extended static shots.

hold_rules:
  - establishing shots: 6-12s (uncomfortable duration)
  - negative space holds: 5-15s (training the audience to watch emptiness)
  - character CU during horror: 4-8s (witness the face, not the event)
  - aftermath holds: 5-10s (forced contemplation)
  - transition between scenes: NO quick cuts; dissolves (2-3s) or
    hard cuts with 2s of black between

rhythm_arc_template:
  act_1: slow, lullaby-like (ASL ~6s) → false security through
         gentleness; the rhythm is soothing, which makes the content
         more disturbing when it begins to shift
  act_2_rising: rhythm stays slow but holds get LONGER → 15-20s shots
                appear; the audience begins to dread these holds
  act_2_midpoint: a single moment of rapid cutting (4-6 shots at < 1s)
                  then IMMEDIATE return to slow pace → the violence was
                  a disruption, not a pattern
  act_3: rhythm becomes erratic in a specific way — shots are either
         very long (10s+) or very short (< 1s) with nothing in between →
         the "normal" rhythm is gone
  climax: one continuous shot (15-60s) or near-darkness → there is
          no cutting because there is no escape
```

### Evaluation Weight Override

```
SOUND:  1.3  (sound is the primary horror delivery mechanism; off-screen
              horror, ambient wrongness, silence-as-threat — all auditory)
RHYTHM: 1.2  (temporal manipulation is the genre's core technique;
              the rhythm must create dread through duration and disruption)
LOGIC:  1.1  (horror must follow its own internal logic to be disturbing;
              random horror is just noise)
VIS:    1.0  (standard — negative space and composition matter but serve
              the horror, not the other way around)
NARR:   0.9  (narrative can be ambiguous or incomplete by design; horror
              does not owe the audience full understanding)
CRAFT:  0.9  (technique should be invisible; if the audience admires
              the filmmaking during a horror sequence, the horror failed)

emphasis_note: "SOUND and RHYTHM dominate. Horror is experienced temporally
               and aurally before it's experienced visually. Ask: does
               this shot make the audience dread what they might hear or
               how long they'll have to watch? If not, it's not
               horror-adjacent."
```

### Color / Light Profile

```
base_temp: cool progressing to sickly warm (the warmth of decay, fever,
           or infection — not comforting warmth)
palette: muted natural tones that slowly become contaminated; greens
         become too green, flesh tones become too pink or too gray;
         color itself begins to feel unreliable
light_key: low-key with natural motivation — the darkness is real, not
           dramatic; characters simply don't have enough light
light_source: practical sources that are inadequate — a single lamp in
              a large room, a flashlight with a dying battery, moonlight
              through curtains; the lighting conveys vulnerability
threat_curve: warm → sickly warm → desaturated → near-monochrome;
              the color drains from the world as the horror takes hold;
              the final scenes should feel almost colorless
signature_look: "A dimly lit room where something is wrong but you can't
                 tell what, and looking closer won't help."

specific_techniques:
  - slow_saturation_drain: reduce color saturation by 5-10% per act;
                           audiences won't notice consciously but will
                           feel the world becoming less alive
  - wrong_color_temperature: mix warm and cool sources in ways that
                             create unflattering, sickly light on skin
  - practical_light_failure: lights flicker, dim, or die as a visual
                             motif — unreliable light = unreliable safety
  - daylight_horror: 30% of horror-adjacent scenes should be in daylight
                     — proving that darkness is not required for dread;
                     daylight horror is more disturbing because there's
                     nowhere to hide
```

### Sound Profile

```
music: atonal, textural, or absent; when present, music should be
       difficult to distinguish from ambient sound (is that a drone or
       wind?); sudden silence is more effective than any score
silence: the primary tool — true silence (no ambient, no room tone)
         should appear at least once, for 3-5 seconds, before the
         worst moment; the absence of ALL sound is deeply unnatural
sfx_emphasis: organic sounds slightly wrong (too loud, too wet, too
              resonant); house settling, breath in an empty room,
              something moving in another room, insects stopping suddenly
voice: sparse; when characters speak in horror contexts, their voices
       should sound too loud for the space (breaking the silence feels
       like breaking protection)
```

### Spatial Tendencies

```
preferred_blocking: characters should be improperly spaced — too close
                    in open spaces, too far apart in enclosed spaces;
                    the spacing itself feels wrong
depth: extreme deep staging — the threat should always be possible in
       the deep background; keep backgrounds in soft focus but visible
       (something COULD be back there)
symmetry: enforced symmetry (Kubrick) for institutional/supernatural
          spaces; asymmetry for character spaces — the contrast between
          the ordered space and the disordered human is the tension
confinement: progressive — spaces that seemed large become small;
             ceilings lower, walls close; familiar rooms feel unfamiliar
             upon return
```

---

## Five: Korean Thriller (K-Thriller) Library

### Identity

```
id: k_thriller
name: Korean Thriller
description: Geometric precision meets emotional eruption — class warfare as spatial design.
essence: "The architecture tells you who will survive."

Reference films:
  - Parasite (Bong Joon-ho, 2019)
  - Oldboy (Park Chan-wook, 2003)
  - A Bittersweet Life (Kim Jee-woon, 2005)
  - Burning (Lee Chang-dong, 2018)
  - The Handmaiden (Park Chan-wook, 2016)
  - I Saw the Devil (Kim Jee-woon, 2010)
```

### Idiom Overrides

```
Establishing Sequence (Idiom 1):
  override:
    vertical_emphasis: establishing shots should emphasize VERTICAL space
                       (stairs, floors, hills, basements vs. penthouses)
                       → class is expressed vertically
    geometric_precision: framing should be ruler-straight; horizon lines
                         are level, vertical lines are plumb; the frame
                         is a GRID of social order
    environmental_contrast: cross-cut establishing shots between two
                            spaces (rich and poor, clean and dirty, light
                            and dark) → the comparison IS the establishment
    weather_as_class: rain falls on everyone but affects them differently;
                      show the same rain from above (penthouse window) and
                      below (flooded basement)
  reason: K-thrillers use architecture and geography as class metaphor.
          The vertical axis (up = wealth, down = poverty) is the genre's
          primary spatial language (Parasite). Geometric precision in
          framing creates the order that violence will shatter.

Shot-Reverse-Shot (Idiom 2):
  override:
    spatial_inequality: in cross-class dialogue, the wealthy character
                        has MORE SPACE in the frame (wider framing, more
                        headroom, visible room behind them); the poorer
                        character is COMPRESSED (tighter framing, walls
                        behind them, less breathing room)
    angle_shifts: low angle on wealthy (looking up = aspiration) from
                  poor character's perspective; high angle on poor (looking
                  down = contempt) from wealthy character's perspective;
                  these reverse when power dynamics shift
    tone_matching: DO NOT match color temperature between the two
                   characters' shots — each exists in their own visual
                   world even within the same room
  reason: K-thriller dialogue visualizes class through every framing
          parameter. Two people in the same room exist in different
          visual worlds. When the framing equalizes, it signals that
          the class barrier is about to break (violently).

Reveal Sequence (Idiom 3):
  override:
    structural_reveal: reveals should often be SPATIAL — a door opens
                       to reveal a hidden room, a floor is found beneath
                       a floor, a character descends to a level we didn't
                       know existed → the architecture has secrets
    multiple_reveals: K-thrillers use NESTED reveals — the first reveal
                      leads to a second that recontextualizes the first;
                      plan reveal sequences in pairs
    tonal_shift: the reveal often triggers a GENRE SHIFT — comedy becomes
                 thriller, thriller becomes horror, drama becomes violence;
                 the visual language should shift with the tone
  reason: K-thrillers are architecturally structured; their reveals
          are literal discoveries of hidden spaces (Parasite's basement,
          Oldboy's apartment). The nested reveal structure reflects the
          genre's narrative complexity.

Chase/Urgency Sequence (Idiom 4):
  override:
    long_take_violence: K-thriller action often uses EXTENDED takes
                        (10-30s) rather than rapid cutting — the violence
                        is geographical and choreographed, not fragmented
    corridor_fights: single-axis movement through confined spaces
                     (hallways, stairwells) — the frame becomes a
                     horizontal or vertical tunnel
    class_space_destruction: violence should damage the space itself
                             (breaking furniture, doors, walls) → the
                             class barrier is physically destroyed
  reason: K-thriller violence is not impressionistic (rapid cuts) but
          architectural (long takes showing bodies moving through space).
          Oldboy's corridor fight is the paradigm: one take, one axis,
          sustained brutality that the camera refuses to look away from.
```

### Added Idioms

```
Idiom K1: Vertical Axis Transition
  state_machine:
    [class transition occurring] → character moves VERTICALLY (stairs,
    elevator, hill, ladder) → camera follows or leads in continuous shot →
    as character ascends/descends, the visual world CHANGES (lighting,
    color, set dressing, sound) → character arrives in new class space →
    new establishing shot within the continuous movement

  logic: Vertical movement is class movement. The camera's continuous
         following through the transition forces the audience to experience
         the class difference as a physical journey, not an abstract concept.
         The gradual visual change during the movement is more powerful than
         a hard cut between two worlds.

  parameters:
    direction_meaning:
      ascending: aspiration, infiltration, deception (going where you
                 don't belong)
      descending: truth, consequence, return to reality, punishment
    visual_gradient: lighting should shift from warm-to-cool (ascending
                     into wealth's artificial comfort) or cool-to-warm
                     (descending into poverty's harsh reality)
    sound_gradient: ascending → refined sounds replace coarse ones;
                    descending → mechanical/organic sounds replace clean ones
    shot_type: Steadicam or gimbal; the movement must be smooth regardless
               of the space's roughness — the camera has its own class
    duration: 15-45s for the full transition

  examples:
    - Parasite: every movement between the Park and Kim houses
    - The Handmaiden: transitions between floors of the mansion
    - Snowpiercer: movement through train cars

Idiom K2: Geometric Symmetry / Break
  state_machine:
    [order established] → static shot with strong geometric symmetry
    (centered subject, parallel lines, visible grid) → hold (4-8s) →
    symmetry is BROKEN by an element (person entering off-center, object
    falling, stain appearing) → camera HOLDS on the broken symmetry →
    [optional: cut to character who broke it]

  logic: Symmetry represents social order, propriety, the way things
         should be. The symmetry break is the inciting incident in visual
         form — the moment the perfect system begins to fail. The camera's
         refusal to reframe (holding on the broken symmetry rather than
         finding new balance) tells the audience that the disruption is
         permanent.

  parameters:
    symmetry_precision: must be exact — use center framing, one-point
                        perspective, visible architectural lines
    break_element: should be small relative to the frame — a person in
                   a doorway, a stain on a perfect surface, a single
                   object out of place
    post_break_duration: hold 3-5s on the broken frame — the audience
                         must register both the original order and its
                         violation
    frequency: establish symmetry in act 1 (3-5 symmetric shots); first
               break at end of act 1; increasing breaks through act 2;
               act 3 has no symmetric shots remaining

  examples:
    - Parasite: the Park house in perfect order → the flood
    - Oldboy: the corridor (symmetric, then filled with bodies)
    - A Bittersweet Life: restaurant and office symmetry

Idiom K3: Class Contrast Cross-Cut
  state_machine:
    [two social realities coexist] → shot of wealthy space/action →
    matched cut to poor space/action (same composition, different content) →
    wealthy again → poor again → the rhythm establishes COMPARISON →
    eventually the two sequences COLLIDE (characters from both spaces
    enter the same frame)

  logic: Parallel editing between class-separated spaces forces the
         audience to compare and judge. The matched compositions
         (identical framing applied to different worlds) make the
         inequality visceral. When characters finally share the frame,
         the accumulated visual contrast makes their coexistence explosive.

  parameters:
    composition_matching: framing, angle, and movement should be as
                          similar as possible between the two spaces;
                          ONLY the content differs
    content_contrast: the contrast should be specific and pointed
                      (eating the same meal differently, sleeping in
                      different beds, the same rain seen from different
                      shelters)
    collision_timing: the cross-cut sequences should occur 2-3 times
                      before the characters share a frame; each
                      cross-cut builds the pressure for the collision
    collision_framing: when characters from both spaces share the frame,
                       use WIDE framing that shows BOTH their visual
                       worlds — the frame itself becomes a battlefield

  examples:
    - Parasite: the Kim and Park families in parallel
    - Burning: Jong-su's farm and Ben's apartment
    - Snowpiercer: front and tail of the train
```

### Removed Patterns

```
- pattern: Chaotic handheld during violence
  reason: K-thriller violence is choreographed and geometric, not chaotic.
          The camera observes violence with the precision of an architect
          documenting demolition. Handheld chaos would obscure the spatial
          logic that gives K-thriller violence its meaning.

- pattern: Montage-compressed investigation
  reason: K-thrillers prefer to show the PROCESS in real time or near-real
          time. Compressing investigation into montage removes the texture
          of Korean procedural patience. Show the work.

- pattern: Safe wide-shot violence
  reason: K-thrillers do not retreat to safe distance for violence. The
          camera stays close enough to be uncomfortable but wide enough
          to see the full choreography (MS-MLS range, not LS).
```

### Rhythm Signature

```
signature: mixed meter (4/4 + 7/8) — a regular pattern that periodically
           adds an unexpected beat, creating a lurching quality
avg_duration: 4.0s
sigma: 2.8s (moderate-high variance)
tempo_modifier: controlled acceleration with explosive release — tension
                builds through disciplined pacing, then erupts in sustained
                violence or revelation sequences that refuse to cut away.

hold_rules:
  - symmetric compositions: 4-8s (let the geometry register)
  - cross-class cuts: matched duration (3-4s each) for rhythm of comparison
  - violence long takes: 10-30s (refuse to look away)
  - post-violence: 5-10s static hold on aftermath (consequence has weight)
  - vertical transitions: 15-45s continuous movement
  - tonal shift moments: preceded by 2-3s of stillness (the breath before
    the genre changes)

rhythm_arc_template:
  act_1: precise, almost metronomic (ASL ~4s) → geometric order
  act_2_rising: rhythm begins to include longer holds and shorter cuts
                within the same sequence → the meter is destabilizing
  act_2_midpoint: a long-take violence or revelation sequence (15-45s
                  continuous) → the system breaks
  act_3: rhythm oscillates between extremes — very long holds for
         consequence and very short cuts for violence → no middle ground
  climax: often a return to order/symmetry that is deeply wrong — the
          final frames echo act 1's geometric precision but the content
          has been transformed; same rhythm, different meaning
```

### Evaluation Weight Override

```
VIS:    1.3  (geometric precision, spatial class design, and compositional
              meaning are essential; if the framing doesn't express class,
              it's not K-thriller)
NARR:   1.2  (K-thrillers are structurally complex narratives; the visual
              must track multiple timelines, reveals, and tonal shifts)
LOGIC:  1.0  (standard — shot logic must be clean even when the narrative
              structure is complex)
RHYTHM: 1.0  (standard — the mixed meter is evaluated within this dimension)
SOUND:  0.9  (sound serves the visual design, not the other way around)
CRAFT:  1.0  (precision IS the craft; sloppy framing is a failure)

emphasis_note: "VIS and NARR dominate. K-thriller is defined by the marriage
               of geometric visual precision and narrative complexity. Ask:
               does this shot tell you something about class, power, or
               spatial hierarchy? Does this sequence advance a structurally
               complex narrative? If yes to both, the shot is K-thriller."
```

### Color / Light Profile

```
base_temp: cool (steel blue, clinical green) for poor spaces;
           warm (golden, amber) for wealthy spaces — temperature = class
palette: high-saturation for wealthy spaces (color = abundance);
         desaturated for poor spaces (muted = deprivation); when characters
         cross class boundaries, the color follows the SPACE not the person
light_key: high-key for wealthy (everything visible = nothing to hide);
           low-key for poor (shadows = what the system doesn't want seen)
light_source: wealthy spaces use abundant, soft, diffused light (as if
              light itself is a luxury); poor spaces use harsh single
              sources (bare bulbs, streetlights, phone screens)
threat_curve: the color worlds BEGIN to contaminate each other in act 2;
              warm light appears in poor spaces (false hope) and cool tones
              invade wealthy spaces (the truth seeping in); by act 3,
              both spaces share the same sick middle-ground color
signature_look: "A geometrically perfect frame where the left half is
                 warm and the right half is cold, and a person stands
                 on the dividing line."

specific_techniques:
  - vertical_light_gradient: lighting gets warmer as you go UP and cooler
                             as you go DOWN within the same building
  - clean_vs_textured: wealthy surfaces are smooth and reflective; poor
                       surfaces are rough and absorptive — this affects
                       how light behaves and is a subtle class marker
  - rain_as_equalizer: rain introduces the same cool, flat lighting to
                       all spaces — it's the weather of consequence
  - explosion_of_color: a single moment of extreme color (blood, fire,
                         neon) against the controlled palette = the
                         system's breaking point
```

### Sound Profile

```
music: orchestral or classical for wealthy spaces; silence or ambient
       noise for poor spaces; music crossing class boundaries is a
       significant narrative event (hearing the wealthy family's music
       from the basement = aspiration or torment)
silence: the sound of poverty — not true silence but the ABSENCE of
         curated sound; traffic noise, plumbing, neighbor sounds replace
         designed soundscapes
sfx_emphasis: environmental contrast sounds — marble echoing vs.
              linoleum squeaking; automatic doors vs. manual locks;
              elevator chimes vs. stairwell echoes; food preparation
              sounds (expensive cooking vs. cheap heating)
voice: wealthy characters speak softly (they don't need to be loud);
       poor characters speak louder (competing with noise); the volume
       dynamics of dialogue express class
```

### Spatial Tendencies

```
preferred_blocking: hierarchical — characters above (standing on stairs,
                    seated on elevated furniture) always have visual
                    dominance; blocking should make vertical relationships
                    visible even in horizontal spaces
depth: extreme depth in wealthy spaces (rooms have depth, windows show
       views, corridors extend); shallow depth in poor spaces (walls
       close, no views, no escape routes)
symmetry: high symmetry for wealthy/ordered spaces; broken symmetry for
          poor/chaotic spaces; symmetry breaking marks narrative turns
confinement: class-determined — wealthy characters have volume (high
             ceilings, open plans); poor characters have compression
             (low ceilings, cramped rooms); when a poor character enters
             a wealthy space, the volume should feel overwhelming
```

---

## Six: Art-House / Auteur Library

### Identity

```
id: art_auteur
name: Art-House / Auteur Thriller
description: Minimalism as maximum intensity — the sustained gaze as confrontation.
essence: "The camera will not help you. It will only watch."

Reference films:
  - Caché (Haneke, 2005)
  - A Separation (Farhadi, 2011)
  - No Country for Old Men (Coen Brothers, 2007)
  - Burning (Lee Chang-dong, 2018)
  - Anatomy of a Fall (Triet, 2023)
  - The Secret in Their Eyes (Campanella, 2009)
```

### Idiom Overrides

```
Establishing Sequence (Idiom 1):
  override:
    duration: 200% of base (8-20s for establishing)
    movement: STATIC preferred (70%); when movement is used, it should
              be a single slow PAN that takes 10-15s to complete
    cut_to_action: DO NOT cut to characters entering — let them enter
                   the frame within the establishing shot; the space
                   existed before the character and will exist after
    composition: wide, observational, democratic — the camera does not
                 choose what to emphasize; the entire frame is equally
                 important
    sound: ambient only — no score, no artificial enhancement; the sound
           of the space as it actually sounds
  reason: Art-house establishing shots declare the camera's relationship
          to the material: observational, not participatory. The long
          duration tells the audience "this is the pace; adjust your
          expectations." Characters entering the frame within the shot
          (rather than being cut to) establishes that the camera has
          its own presence independent of the characters.

Shot-Reverse-Shot (Idiom 2):
  override:
    long_take_priority: prefer long two-shots over cutting between
                        singles — let dialogue play out in a single
                        frame where possible
    cut_to_singles: only when a character says something that changes
                    the power dynamic — the CUT ITSELF is the event
    matching: when cutting between singles, shot sizes must be
              EXACTLY matched — the visual equality is philosophical
    duration: dialogue CUs hold 6-12s (the audience watches the face
              think between lines, not just during lines)
  reason: Art-house dialogue values the SILENCE between lines as much as
          the lines themselves. Long takes create real-time performance
          where the actor's face does work that editing would replace.
          Cutting is an editorial judgment; art-house delays editorial
          judgment as long as possible.

Reveal Sequence (Idiom 3):
  override:
    preferred_mode: anti-climactic — the reveal happens within a longer
                    shot that DOES NOT change its framing to accommodate it;
                    the camera was already watching when the truth emerged
    scale_restriction: DO NOT push to CU/ECU for reveals; maintain MS or
                       wider — refusing to zoom in is refusing to editorialize
    reaction_shot: OPTIONAL — art-house may deny the audience the
                   character's reaction; the audience must generate their
                   own reaction
    post_reveal: no music sting, no rhythm change; the shot continues
                 as if nothing happened — the weight is carried by the
                 audience, not the camera
  reason: Art-house reveals refuse to tell the audience "this is important."
          The camera's neutrality makes the revelation more powerful
          because the audience must do the work of recognizing significance.
          The denied reaction shot forces internalization.

Voyeur/Surveillance Sequence (Idiom 5):
  override:
    remove_framework_entirely: the camera itself IS the voyeur; no diegetic
                               framing device (binoculars, windows); the
                               audience's act of watching IS the surveillance
    moral_implication: the camera's gaze should make the audience
                       uncomfortable about watching — "why am I seeing this?"
    duration: voyeur shots hold for uncomfortable duration (15-60s)
    static: absolutely static — the camera does not acknowledge or respond
            to what happens in front of it
  reason: Art-house implicates the audience directly (Cache). The surveillance
          footage that cannot be attributed to any character suggests that
          the camera (audience) is the guilty party. The static long take
          refuses to protect the audience with cuts.
```

### Added Idioms

```
Idiom A1: The Sustained Gaze
  state_machine:
    [significant moment] → camera DOES NOT CUT → holds on a single
    composition for 30-120s → action, dialogue, and emotion play out
    within the frame → characters enter and exit → the camera remains →
    [the shot ends when the CAMERA decides, not when the action ends]

  logic: The long take is the art-house's fundamental unit. By refusing
         to cut, the camera creates real time, demands real performance,
         and gives the audience no editorial guidance. What matters is
         determined by what the VIEWER chooses to watch within the frame.

  parameters:
    minimum_duration: 30s (below this, it's just a long shot, not a
                      sustained gaze)
    camera_behavior: static or slow movement only; if movement, it
                     should feel autonomous (the camera moves for its
                     own reasons, not following character action)
    frame_density: multiple elements of interest must coexist in the
                   frame — foreground, midground, background all contain
                   narrative-relevant information
    audio: diegetic only; ambient sound and dialogue; no score;
           the sound perspective matches the camera's distance
    ending: the shot should end with a CUT (not a fade or dissolve)
            and the cut should feel sudden — after 60s of continuous
            observation, ANY cut is violent

  examples:
    - Cache: the opening shot (static, several minutes, the horror
      is in the watching)
    - A Separation: domestic arguments in single takes
    - Burning: barn-watching sequence
    - No Country for Old Men: hotel rooms, waiting

Idiom A2: Democratic Frame
  state_machine:
    [multiple characters in scene] → WIDE or MEDIUM-WIDE framing that
    includes all characters simultaneously → NO SINGLES — the camera
    refuses to isolate any character → characters move within the frame,
    creating their own blocking → audience must choose who to watch →
    cuts only for spatial necessity (new room, time jump)

  logic: The democratic frame refuses to tell the audience who is
         important. By including everyone in a single composition,
         the film democratizes attention. The audience's choice of
         where to look becomes part of the film's meaning — what you
         watch reveals what you value.

  parameters:
    framing: MS or wider — never tighter than MS; all relevant characters
             visible simultaneously
    blocking: characters must be blocked so that the audience CAN see
              everyone but must CHOOSE who to focus on; no character
              should be obviously more prominent
    duration: 15-60s minimum — the audience needs time to explore the frame
    exception: a cut to a SINGLE is an editorial intervention and should
               be used only 1-2 times per scene as a deliberate choice
               with maximum narrative weight ("THIS person matters now")

  examples:
    - A Separation: family arguments with all family members visible
    - Anatomy of a Fall: courtroom scenes with democratic framing
    - The Secret in Their Eyes: the sustained stadium sequence

Idiom A3: Ambient Transition
  state_machine:
    [scene ending] → camera stays on the space after characters leave →
    ambient sound continues → time passes within the static frame
    (light changes, sounds shift) → [new scene begins in the same frame,
    or CUT to new space with matching ambient sound bridging the transition]

  logic: Art-house transitions blur scene boundaries. Time passes within
         shots rather than between shots. The ambient sound bridge
         (L-cut extended to its extreme) creates a continuous experiential
         timeline even when the visual content changes.

  parameters:
    empty_space_duration: 5-15s of space without characters before
                          transition
    sound_bridge: ambient sound from scene A continues 3-5s into scene B
                  (or the reverse — scene B's sound begins 3-5s before
                  scene B's image)
    visual_transition: preferably NO transition effect — hard cut from
                       empty space A to establishing shot B; the cut is
                       minimal, the sound bridge carries continuity
    time_indication: if significant time passes, show it through the
                     frame (light moving, shadows shifting) rather than
                     text overlays

  examples:
    - Burning: transitions between locations through sustained ambience
    - Cache: transitions between the video footage and "real" footage
    - A Separation: time compression through sustained compositions
```

### Removed Patterns

```
- pattern: Non-diegetic score during dialogue
  reason: Score tells the audience what to feel. Art-house requires
          the audience to determine their own emotional response from
          performance, composition, and ambient sound alone.

- pattern: INSERT shots for emphasis
  reason: Cutting to a detail INSERT tells the audience "look at this."
          Art-house shows details within the wider frame and trusts the
          audience to find them. If the detail is important enough, it
          should be visible without editorial intervention.

- pattern: Coverage-based editing (master + singles + inserts)
  reason: Coverage editing is industrial filmmaking (shoot everything,
          decide in the edit). Art-house editing is planned in advance;
          each shot is a complete unit. If you need coverage, the scene
          isn't designed yet.

- pattern: Flashbacks / memory sequences
  reason: Art-house presents events in their temporal order (or a single
          order). Flashbacks are an editorial crutch. If past events
          matter, integrate them through dialogue, objects, or behavior
          in the present tense.
```

### Rhythm Signature

```
signature: free time (unmeasured) — no regular pulse; each shot finds
           its own natural duration based on content, not template
avg_duration: 8.0s (highest of all genres)
sigma: 5.0s (extreme variance — but the variance feels organic, not jarring)
tempo_modifier: rubato extremis — the concept of a regular beat does not
                apply; the rhythm is the rhythm of real life, which is
                to say irregular, unpredictable, and occasionally boring
                on purpose.

hold_rules:
  - sustained gaze: 30-120s (this IS the genre)
  - establishing: 8-20s (patient orientation)
  - dialogue in two-shot: 15-60s (real-time performance)
  - reaction-as-absence: when no reaction shot is given, the HOLD on
    the speaker's face after they've stopped speaking serves as the
    reaction space (5-10s)
  - transitions: 5-15s of empty space or ambient bridge

rhythm_arc_template:
  act_1: slow, patient, observational (ASL ~9s) → the audience calibrates
         to the pace; impatience is expected and is itself part of the
         experience
  act_2: the pace does NOT change significantly; what changes is the
         CONTENT within the sustained shots — the same formal treatment
         applied to increasingly tense material creates a gap between
         form and content that generates meaning
  act_3: the rhythm may contract slightly (ASL ~6s) as the only concession
         to dramatic convention, but the fundamental approach (long takes,
         static camera, ambient sound) remains unchanged
  climax: often the LONGEST shot in the film — a sustained gaze of
          60-120s that refuses to end, refuses to cut, refuses to help
```

### Evaluation Weight Override

```
NARR:   1.3  (the visual must serve a profound narrative purpose despite
              — or because of — its formal restraint; every shot must be
              narratively essential, since there are so few)
VIS:    1.2  (composition is paramount; with fewer cuts, each composition
              carries more weight and must be more carefully designed)
CRAFT:  1.2  (the restraint IS the craft; it takes more skill to hold
              one perfect shot than to assemble many adequate ones)
SOUND:  1.0  (ambient sound design is crucial but should feel effortless)
LOGIC:  0.9  (logic can be associative rather than causal; connections
              between shots can be thematic, not just narrative)
RHYTHM: 0.8  (rhythm is deliberately unconventional; do not penalize
              slowness or irregularity if it is intentional and earned)

emphasis_note: "NARR, VIS, and CRAFT dominate equally. Art-house is the
               genre where EVERY dimension is elevated by restraint. Ask:
               does this shot need to exist? If you can remove it without
               loss, it shouldn't be there. If it must exist, is it as
               perfectly composed as possible? The art-house standard is:
               fewer shots, each one essential."
```

### Color / Light Profile

```
base_temp: natural (whatever the actual light of the location provides;
           no artificial warming or cooling; the camera photographs
           reality's light)
palette: naturalistic — the color palette is the palette of the actual
         location; art design controls color, not post-production;
         what you see is what was there
light_key: natural key — motivated by real sources (windows, practicals,
           sky); the lighting looks effortless because the locations
           are chosen for their light, not lit for the camera
light_source: available light preferred; supplemental lighting should
              be invisible (bounced, diffused, undetectable); the audience
              should never think about lighting
threat_curve: minimal shift — the same neutral observation applied to
              mundane and horrifying content alike; the REFUSAL to change
              the visual treatment for horror is itself disturbing
signature_look: "A lived-in space, naturally lit, observed with patience
                 and without judgment."

specific_techniques:
  - window_light: daylight through windows is the primary source;
                  scenes should be scheduled/designed around natural light
  - available_darkness: night scenes should be genuinely dark, lit only
                        by sources that would exist in the space
  - color_realism: no color grading beyond exposure correction; the
                   film should look like the world looks
  - weather_as_given: accept the weather; if it rains during shooting,
                      it rains in the film; weather is not controlled,
                      it is accepted (Farhadi, Kiarostami)
```

### Sound Profile

```
music: absent or diegetic only (a radio, a street musician, a ringtone);
       non-diegetic score appears at most once (often the final scene)
       as a rare emotional release; its rarity gives it overwhelming power
silence: not a weapon but a natural state — the quiet of a room where
         nobody is speaking; the quiet of a car between cities; silence
         is not designed, it is accepted
sfx_emphasis: ambient reality — traffic patterns change, birds are
              seasonal, mechanical sounds are specific to the location;
              the soundscape is a documentary of the space
voice: natural volume, natural overlap, natural pauses; actors speak
       as people speak — sometimes unclear, sometimes over each other,
       sometimes trailing off; the sound mix does not favor any voice
```

### Spatial Tendencies

```
preferred_blocking: naturalistic — characters move as people actually
                    move in spaces; no staged groupings; blocking should
                    feel observed, not designed
depth: dictated by the actual space; what you see is what's there;
       no artificial depth creation through foreground elements
symmetry: incidental — if the location is symmetric, the shot is
          symmetric; the camera does not impose order on the space
confinement: determined by the story's spaces — if the story takes place
             in a small apartment, the film feels confined not through
             technique but through reality
```

---

## Seven: Genre Hybridization Rules

### Core Hybridization Protocol

```
To combine Genre A (primary) + Genre B (secondary):

Step 1: Designate Primary and Secondary
  - Primary genre determines: rhythm signature, evaluation weight base,
    spatial tendencies, overall pacing philosophy
  - Secondary genre contributes: added idioms (selectively), color
    influence, specific shots/techniques, sound elements

Step 2: Merge Rule (70/30)
  - Quantitative parameters (avg_duration, sigma, evaluation multipliers):
    result = (0.7 × primary_value) + (0.3 × secondary_value)
  - Qualitative parameters (idiom additions):
    include all primary added idioms;
    include secondary added idioms ONLY if they don't conflict with
    primary rhythm or evaluation priorities

Step 3: Conflict Resolution
  - Rhythm conflicts: PRIMARY always wins
    (rhythm is the heartbeat; you can't have two heartbeats)
  - Color conflicts: SECONDARY has more influence
    (color is texture; the secondary genre's color adds flavor
    to the primary's structure)
  - Idiom conflicts: if both genres modify the same base idiom,
    use primary's override and note the secondary's as an
    "[optional variant]" that can be applied per-scene
  - Evaluation conflicts: use the weighted merge (70/30) for all
    six dimensions; round to one decimal place

Step 4: Validate
  - Check that the hybrid doesn't create contradictions
    (e.g., "static camera" + "dynamic tracking" can't both be defaults)
  - Resolve contradictions by letting primary win on camera movement
    and secondary win on lighting/color
  - Document all resolution decisions in the hybrid profile

Step 5: Name the Hybrid
  - Format: {primary}-{secondary} (e.g., "noir-procedural")
  - The primary genre name comes first
```

### Hybridization Matrix (Compatibility)

```
                 psych    noir    proced   horror   k_thr   art_aut
psych_thriller    --      HIGH    MED      HIGH     MED     HIGH
noir              HIGH     --     HIGH     MED      LOW     MED
procedural        MED     HIGH     --      MED      MED     HIGH
horror_adj        HIGH    MED     MED       --      MED     HIGH
k_thriller        MED     LOW     MED      MED       --     MED
art_auteur        HIGH    MED     HIGH     HIGH     MED      --

HIGH = natural affinity, minimal conflicts
MED  = workable with some conflict resolution
LOW  = significant tension, requires careful handling
```

### Worked Example 1: Noir-Procedural Hybrid

```
Primary: noir
Secondary: procedural

Rhythm:
  avg_duration = (0.7 × 5.0) + (0.3 × 4.0) = 4.7s
  sigma = (0.7 × 3.0) + (0.3 × 1.8) = 2.64s
  signature: 4/4 slow (noir primary — deliberate, not metronomic)
  note: noir's languid tracking shots with procedural's methodical
        INSERT sequences create a unique pace — elegant investigation

Idioms:
  From noir (all): Femme Fatale Entrance, Venetian Shadow, Wet Street
                    Reflection
  From procedural (selected):
    Evidence INSERT Sequence — INCLUDED (does not conflict with noir rhythm;
      modify lighting to be more dramatic/single-source than standard
      procedural flat lighting)
    Surveillance Footage — INCLUDED (fits noir's voyeurism theme; the
      degraded footage aesthetic adds texture to noir's visual world)
    Briefing Sequence — EXCLUDED (too institutional/clinical for noir's
      lone-wolf detective aesthetic)

  Base idiom conflicts:
    Establishing (Idiom 1): noir override wins (night, wet, atmospheric)
      with procedural's clinical time-stamping as [optional variant]
    Shot-Reverse-Shot (Idiom 2): noir override wins (lighting asymmetry,
      smoke, angle bias) with procedural's frontal framing as [optional
      variant] for interrogation scenes specifically
    Reveal (Idiom 3): noir's progressive/light-reveal with procedural's
      evidence accumulation merged — the reveal is progressive AND
      involves evidence, but the evidence is discovered in dramatic
      lighting, not clinical lighting

Evaluation weights:
  LOGIC:  (0.7 × 1.0) + (0.3 × 1.3) = 1.09 → 1.1
  NARR:   (0.7 × 0.9) + (0.3 × 1.1) = 0.96 → 1.0
  VIS:    (0.7 × 1.3) + (0.3 × 0.9) = 1.18 → 1.2
  RHYTHM: (0.7 × 0.9) + (0.3 × 1.1) = 0.96 → 1.0
  SOUND:  (0.7 × 1.1) + (0.3 × 1.0) = 1.07 → 1.1
  CRAFT:  (0.7 × 1.2) + (0.3 × 0.9) = 1.11 → 1.1

Color:
  Base: 70% noir (high-contrast, low-key) + 30% procedural (clinical)
  Result: high-contrast but with occasional flat fluorescent interludes;
          crime scenes lit like noir, offices lit like procedurals;
          the TRANSITION between the two lighting worlds IS the character
          moving between their romantic self-image (noir) and institutional
          reality (procedural)

Films in this hybrid: Chinatown, Zodiac, Nightcrawler, L.A. Confidential
```

### Worked Example 2: Psychological Thriller + Art-House Hybrid

```
Primary: psych_thriller
Secondary: art_auteur

Rhythm:
  avg_duration = (0.7 × 4.5) + (0.3 × 8.0) = 5.55s
  sigma = (0.7 × 2.5) + (0.3 × 5.0) = 3.25s
  signature: 4/4 rubato (psych primary) with art-house extension —
             holds are longer than pure psych-thriller, creating even
             more discomfort during face-reading sequences

Idioms:
  From psych (all): Mirror Shot, Empty Frame Hold, Unreliable POV
  From art-house (selected):
    Sustained Gaze — INCLUDED (extends the psych-thriller's face holds
      to full sustained-gaze duration; the unreliable face gazed at for
      60s+ is deeply unsettling)
    Democratic Frame — INCLUDED with modification (used specifically
      in scenes where the protagonist's reality is questioned — the
      democratic frame implies no single perspective is reliable)
    Ambient Transition — INCLUDED (blurs the line between real and
      imagined scenes)

  Base idiom conflicts:
    Shot-Reverse-Shot (Idiom 2): psych override wins (asymmetric,
      off-axis gaze, tight framing) but art-house's long two-shot
      is available as [optional variant] for scenes of false normalcy
    Reveal (Idiom 3): psych's delayed reveal in art-house's
      anti-climactic framing — the revelation happens in a sustained
      gaze where the camera refuses to editorialize the twist;
      NO push to CU, NO music sting; the twist happens in a held MS
      and the audience must recognize it themselves

Evaluation weights:
  LOGIC:  (0.7 × 1.3) + (0.3 × 0.9) = 1.18 → 1.2
  NARR:   (0.7 × 1.2) + (0.3 × 1.3) = 1.23 → 1.2
  VIS:    (0.7 × 1.0) + (0.3 × 1.2) = 1.06 → 1.1
  RHYTHM: (0.7 × 1.0) + (0.3 × 0.8) = 0.94 → 0.9
  SOUND:  (0.7 × 1.1) + (0.3 × 1.0) = 1.07 → 1.1
  CRAFT:  (0.7 × 0.9) + (0.3 × 1.2) = 0.99 → 1.0

Color:
  Base: 70% psych (shifting warm→cool, single-source) + 30% art-house
        (natural, unmanipulated)
  Result: the color shift exists but is MORE SUBTLE than pure psych-thriller;
          the art-house naturalism grounds the psychological distortion;
          the audience can't tell if the color change is psychological
          or simply the time of day changing — which is the point

Films in this hybrid: Cache, Burning, A Separation, Mulholland Drive
```

### Worked Example 3: K-Thriller + Horror-Adjacent Hybrid

```
Primary: k_thriller
Secondary: horror_adj

Rhythm:
  avg_duration = (0.7 × 4.0) + (0.3 × 5.5) = 4.45s
  sigma = (0.7 × 2.8) + (0.3 × 3.5) = 3.01s
  signature: mixed meter (K-thriller primary) with horror's fermata —
             the geometric precision of K-thriller punctuated by
             held moments of horror-adjacent dread

Idioms:
  From K-thriller (all): Vertical Axis Transition, Geometric Symmetry/Break,
                          Class Contrast Cross-Cut
  From horror-adjacent (selected):
    Negative Space Threat — INCLUDED (class spaces have threatening
      emptiness — the wealthy home's unused rooms, the basement's dark
      corners; negative space = the space where the oppressed are hidden)
    Off-Screen Horror — INCLUDED (K-thriller violence shown in long
      takes, but the WORST violence happens off-screen per horror-adj
      rules — this creates a hierarchy of violence: what you see is bad,
      what you don't see is worse)
    Temporal Dread Shot — EXCLUDED (conflicts with K-thriller's
      precise temporal structure)

Evaluation weights:
  LOGIC:  (0.7 × 1.0) + (0.3 × 1.1) = 1.03 → 1.0
  NARR:   (0.7 × 1.2) + (0.3 × 0.9) = 1.11 → 1.1
  VIS:    (0.7 × 1.3) + (0.3 × 1.0) = 1.21 → 1.2
  RHYTHM: (0.7 × 1.0) + (0.3 × 1.2) = 1.06 → 1.1
  SOUND:  (0.7 × 0.9) + (0.3 × 1.3) = 1.02 → 1.0
  CRAFT:  (0.7 × 1.0) + (0.3 × 0.9) = 0.97 → 1.0

Color:
  Base: 70% K-thriller (class-divided color) + 30% horror
        (contaminated naturalism)
  Result: the class color division (warm wealthy / cool poor) PLUS
          the horror contamination (sickly warmth invading cool spaces);
          the basement doesn't just look poor — it looks infected;
          the penthouse doesn't just look wealthy — it looks too clean,
          antiseptic, as if hiding something biological

Films in this hybrid: Parasite, The Wailing, The Handmaiden (partially),
                       I Saw the Devil
```

---

## Eight: Integration with /style Command

### /style Command Extension

```
When /style is invoked with a genre library, the system applies the delta:

/style --genre <genre_id>
/style --genre <primary_id>+<secondary_id>    # hybrid mode

Examples:
  /style --genre psych_thriller
  /style --genre noir+procedural
  /style --genre k_thriller+horror_adj

Behavior:
  1. Load base system (all reference files)
  2. Load specified genre delta from genre-libraries.md
  3. If hybrid, compute merged delta per hybridization rules
  4. Apply delta to active session:
     - idiom_overrides → modify idiom behavior in shot-logic.md context
     - added_idioms → make available as additional patterns
     - removed_patterns → flag for suppression warnings
     - rhythm_override → update baseline expectations in visual-rhythm.md context
     - evaluation_weight_override → adjust /score weights
     - color_override → inform composition and lighting decisions
  5. Display active genre profile summary

Compatibility with existing /style presets:
  /style --reference hitchcock  ≈  /style --genre psych_thriller (closest match)
  /style --reference noir       =  /style --genre noir
  /style --reference korean     =  /style --genre k_thriller
  /style --reference asghar     ≈  /style --genre art_auteur (closest match)
  /style --reference fincher    ≈  /style --genre procedural+noir (hybrid)
  /style --reference kubrick    ≈  /style --genre horror_adj+art_auteur (hybrid)
  /style --reference wong       =  (no direct genre library; use custom delta)
  /style --reference anime      =  (no direct genre library; use custom delta)
```

### /score Integration

```
When /score is invoked with a genre-active session:

  1. Use the genre's evaluation_weight_override instead of the base
     weight table in evaluation.md
  2. Add genre-specific scoring criteria:
     - For each genre-defining shot present in the sequence:
       +0.5 to CRAFT dimension (max +1.5 for 3 genre-defining shots)
     - For each removed pattern that appears in the sequence:
       -0.5 to the most relevant dimension (with warning)
     - For idiom overrides: check that the override parameters are
       respected; deduct 0.3 from LOGIC for each violated override
  3. Add a "Genre Fidelity" section to the score report:

     ### Genre Fidelity: [genre_name]
     | Criterion | Status | Notes |
     |-----------|--------|-------|
     | Rhythm within genre σ | PASS/FAIL | actual σ vs. target σ |
     | Genre-defining shots present | X/3 | which are present |
     | Removed patterns absent | PASS/WARN | which appeared |
     | Idiom overrides respected | X/Y | which were violated |
     | Color/light profile match | PASS/WARN | assessment |
     | Genre Fidelity Score: X/10 |
```

---

## Nine: Application Notes

### Applying Genre Libraries During /decompose

```
When decomposing with an active genre:

  PARSE step: no change
  BEAT step: no change (beats are genre-agnostic narrative units)
  BLOCK step: apply spatial_tendencies from genre delta
  SHOOT step:
    - Use idiom_overrides when selecting idiom patterns
    - Check added_idioms for genre-specific patterns that fit the beat
    - Apply color_override to lighting/color annotations
    - Apply sound_profile to sound annotations
  VERIFY step:
    - Use evaluation_weight_override to prioritize verification checks
    - Flag removed_patterns if they appear
    - Verify genre-defining shots are used where opportunities exist
  CONNECT step: apply rhythm_override to duration planning
  RHYTHM step: verify against genre's rhythm_signature (avg, sigma)
  ANNOTATE step: add genre tag to output metadata
```

### Genre Transition Within a Story

```
Some stories shift genre mid-narrative (comedy → thriller, thriller → horror).
This is especially common in K-thriller.

Protocol for genre transition:
  1. Identify the transition beat (the moment the genre shifts)
  2. Before the beat: active genre = Genre A
  3. During the beat (1-3 shots): apply NO genre delta — use base system
     only, creating a "genre-neutral" moment of disorientation
  4. After the beat: active genre = Genre B
  5. The transition should be visible in:
     - Rhythm change (immediate — the heartbeat changes)
     - Color change (gradual — over 3-5 shots)
     - Idiom change (immediate — new genre's idioms become available)
     - Sound change (leading — sound should shift BEFORE the visual genre
       changes, via J-cut or pre-lap, by 1-2 shots)
```

### Genre Fidelity vs. Creative Freedom

```
Genre libraries are GUIDES, not LAWS. The evaluation system uses them
to provide informed feedback, not to enforce conformity.

Fidelity scoring interpretation:
  9-10/10: Textbook genre execution. May lack originality.
  7-8/10:  Strong genre identity with personal flourishes. Ideal target.
  5-6/10:  Genre elements present but inconsistent. May indicate a hybrid
           that should be formally declared.
  3-4/10:  Genre barely recognizable. Either intentional subversion
           (document why) or a mismatch between declared and actual genre.
  1-2/10:  Wrong genre library selected. Re-evaluate.

The goal is not 10/10 genre fidelity but INFORMED DEVIATION — knowing
what the genre convention is, choosing to follow or break it, and being
able to articulate why.
```

---

## Version History

```
v1.0 (Band 7, r061-r070):
  - Initial creation with 6 genre libraries
  - Genre delta architecture defined
  - Hybridization rules with 3 worked examples
  - /style and /score integration specified
  - Application protocol for /decompose documented
  - Genre transition protocol established

Planned evolutions:
  - v1.1: Additional genres (action, comedy-thriller, sci-fi thriller)
  - v1.2: Per-scene genre tagging (different scenes, different deltas)
  - v1.3: Director-specific sub-deltas within genres
  - v1.4: Historical period deltas (1940s noir vs. neo-noir, etc.)
```
