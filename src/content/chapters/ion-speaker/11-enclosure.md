---
project: ion-speaker
title: "The stud-bay enclosure"
order: 11
summary: "A real plywood box in the wall, not a lined cavity. It started as two bays with an amp sled, and is now one 2x6 bay per speaker holding the drivers, a transmission line for the subs, and the amp board on the face. The enclosure's Gate 1 passed on Nov 2."
status: draft
---

The speaker isn't a cavity lined with foam. It's a plywood box built into the stud bay:
1/2 in Baltic birch with a 3/4 in baffle, and the amp compartment below it behind a
solid divider.

## The options that were weighed

| Design | Size | Tuning | F3 |
|---|---|---|---|
| Sealed | about 7 L, about 10 in of a 2x4 bay | Qtc about 0.68 | about 80 Hz before boundary gain and EQ |
| Vented | 15-17 L, 21-24 in of bay | 40-42 Hz port | 45-50 Hz |
| Mass-loaded transmission line | full bay height, about a 2.1 m path | about 40 Hz quarter-wave | low 40s |

A 2x4 bay's cross-section, about 280 cm², is close to the ideal 1.5 to 2 times the
woofer's cone area for a transmission line.

## What was locked (October 2026, 2x4 wall)

**Two adjacent bays per speaker.**

- **Bay 1:** a tweeter in its own small sealed cup at the top, the 7 in woofer below
  it, and the amp compartment at the bottom.
- **Bay 2:** the **sub transmission line**. It's closed at the top plate, the two shallow
  subs sit a fifth to a third of the way down, and the line runs to the floor and exits
  through a slot port at baseboard level.

## The sled

The board doesn't slide in from the front. It **drops in from above, standing on edge
parallel to the drywall,** like a card going into a slot.

- The dock socket lies flat on the floor of the compartment, and the board's fingers
  point down into it. Two printed rails guide it in.
- It uses about 2.75 in of the roughly 3 in of depth available. That **70 mm limit is
  what forced the board re-cut** to 180 x 70 mm.
- There are no screws, with one optional thumbscrew, kept at least 15 mm from the antenna.
- A 2 mm EVA pad sits under the board, plus a printed cable comb. The solid 15 mm sled
  front closes the vent when the board is seated.
- A magnet-held cloth panel below the grille, with vent slots and light pipes, gives
  access. Air comes in at the front, rises and leaves. At normal levels the amps and
  converter put out 5-8 W, which passive convection handles.

## Build notes

- Offset the woofer on the baffle, and keep its magnet 1 in off the back panel.
- Mass-loaded vinyl strips on the stud faces.
- Firestop as the local code requires if the bay spans floors or is a rated wall.
- The box is cut on a CNC as a flat-pack kit from one sheet, with recesses, port profiles
  and joints.
- Printed parts in PETG or ASA: the sled and rails, tweeter cup, driver adapter rings,
  port flare, grommets, grille frame and access panel.

## Open questions

- **The sub's depth.** Dayton lists the SD215A-88 at 95 mm deep; the spec assumed
  about 74 mm. It has to be measured against the bay.
- **Low-visibility options** for some rooms: a plaster-over panel driven by two
  exciters (about 150 Hz up, with the sub below), a mud-in frame with a painted
  perforated grille, or a narrow slot grille. One test panel will be built over the winter.

## Update, Oct 30: no sled after all

The amp board is moving out of the sled and onto the face of the compartment, right behind the main grille,
under an opaque cover. The reasons are in the placement chapter: the sled capped the board at about 3 in tall, and
the board needs more room than that. What it changes here:

- No dock board, card-edge socket or printed rails; the board fixes to standoffs with a few screws.
- The grille over bay 1 grows to cover both the drivers and the board section below them, about 14.5 x 23 in.
- The cover needs vents low and high so air moves up past the amplifiers, nothing metal, and an open window or
  15 mm of clearance in front of the Wi-Fi antenna.
- The RJ45 faces the grille under a shroud, so the board-to-grille gap must fit a right-angle Cat6 plug.

## Update, Nov 1: one bay, subs included

The two-bay layout above is gone. The project requirements (see the Gate 1 chapter)
now say **one stud bay per speaker, with the woofer, tweeter, both subs, the amp board
and the mic board all inside it.** The earlier options, a sealed woofer box of about
7 L, the sub transmission line and a mass-loaded line for the woofer, become inputs to
the enclosure's own Gate 2 rather than decisions.

That Gate 2 has three things to prove:

- **The fit:** volumes, line or port lengths, and the depth stack in a 3.5 in bay.
- **Where the amp board sits** in the bay, and how its heat gets out.
- **The sub-to-woofer crossover** that goes with the chosen alignment.

## Update, Nov 2: the enclosure passes its Gate 1, in 2x6 walls

The enclosure is now its own part of the project, with its own gates, and it
replaces the box that had been planned earlier. Its requirements were written from a
single-bay design spec, checked against the project's shared requirements, and
approved on **November 2, 2026**.

### What we decided and why

- **2x6 walls, interior walls only.** A transmission line needs depth that a 3.5 in
  bay doesn't have. No speaker is installed yet and every wall is open, so all
  eight boxes go into 5.5 in deep bays before the drywall goes up. Exterior walls
  are out, so no insulation gets displaced.
- **The mid-bass is now a Dayton SIG150-4** (5.25 in, 4 ohm). It replaces the RS180-8,
  which had never been ordered. The tweeter (Dayton DC28F-8) and the two Dayton
  SD215A-88 subs stay.
- **The tweeter and mid-bass sit 4 to 5 ft up.** The exact height is set at Gate 2.
- **Each sub gets its own BTL channel on the amp, with no bridging.** Both get the
  same signal, with separate level, delay and EQ kept close to matched. Each sub
  is about 3.2 ohm, right at the TAS5825M's minimum load for BTL, so both channels
  get an output limiter. The amp board's speaker connector goes to 8 positions to suit.
- **5/8 in Type X drywall** on the room side, and mass-loaded vinyl on the far-side
  wall to keep the next room quiet.
- **Fire code:** with no speaker in a garage wall, no rated wall assembly is expected.
  The plan is fireblocking at the plates and sealant where the Cat6 goes through.
  The local code sections still have to be checked against the code text before Gate 3.

### The numbers

The depth stack in a 2x6 bay: 5/8 in drywall, a 3/4 in baffle, a 0.25-0.5 in
isolation gap and a 1/2 in back panel leave **4.375-4.625 in (111-117 mm) inside**.
Every driver's mounting depth has to fit that, which gets checked against the Dayton
datasheets at Gate 2.

The width didn't add up. A 14.5 in clear bay minus two 1/2 in sides leaves **13.5 in
inside**. The spec's 6 in driver chamber, 8 in side channel and 1/2 in divider come to
14.5 in. With a 6 in chamber, the side channel can be 6.5-7 in at most. The line
simulation at Gate 2 settles it.

### What's next (Gate 2)

- Driver datasheets: Thiele-Small parameters and mounting depths against the depth stack.
- A folded-line simulation for the subs, tuned around 40 Hz: where the subs sit, the
  side-channel constriction, stuffing, and the floor chute sized so it doesn't chuff.
- Crossovers: mid-bass to tweeter as an LR4 at 1.5-3 kHz, and the sub hand-off at about 80-100 Hz.
- Where the amp board sits on the baffle, and how tall its parts can be.

## Update, Nov 3: the Gate 2 package

The enclosure's architecture work is done and waiting for review. The five decisions on the table:

- **Chamber width:** keep the 6 in driver chamber and a 6.75 in side channel. A first-pass 1-D line model shows
  under 1 dB difference once the line is stuffed. A Hornresp cross-check is still to be run.
- **Woofer box:** a sealed chamber for the SIG150-4 at Qtc 0.8 and 14 in tall (or 0.707 and 20 in).
- **Heights:** tweeter 58 in, woofer 51 in, subs 69 in, with the amp board centered around 30 in.
- **Sub line:** an 85 in line is the 40 Hz quarter-wave. All three drivers fit the depth stack at worst-case
  depth. The subs can't sit beside the chamber, since their cut-out is wider than the side channel.
- **Crossovers:** a 25 Hz high-pass on the subs (excursion), 90 Hz LR4 to the woofer, 2.0 kHz LR4 to the tweeter.

The line meets the SPL target from about 70 Hz at the 5 A limiter and is about 8 dB short at 40 Hz before room
gain and EQ, which becomes a bench item.

### Files

The enclosure's folder in the project repo holds the approved requirements, design
notes with the depth and width checks, a plan for each open issue, and the source list.
