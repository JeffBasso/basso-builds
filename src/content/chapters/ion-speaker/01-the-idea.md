---
project: ion-speaker
title: "The idea: one cable, one speaker, one room"
order: 1
date: 2026-10-16
summary: "Why build an in-wall speaker that runs on a single Ethernet cable, and the constraints that shaped everything after: a 2x4 wall, a board you can swap without tools, and no line voltage in the wall."
status: published
---

Every speaker in this project is a self-contained node. A single Cat6 cable from a
PoE++ switch carries both the music and the power. Inside the wall, one custom
amplifier board drives three drivers (a sub, a woofer and a tweeter) with the
crossover done in the amplifier's DSP. A small sensor board behind the grille makes
the speaker the room's presence, climate and voice sensor too. Home Assistant sees
each speaker as one ESPHome device, and Music Assistant streams to it over
Sendspin, so a pair or a whole house plays in sync.

## Why build it at all

Nothing on the market does all of this at once. In-wall speakers (Sonos, Sonance)
need an amplifier somewhere else. Room sensors (Aqara and friends) are separate boxes.
Voice puck devices sit on a table. None of them are local-only with no cloud, open to
Home Assistant, and powered from one cable. So the plan is to build it, publish it
as open hardware, and only think about selling it after four rooms have run for six
months.

## The constraints that drove the design

- **One cable per room.** 802.3bt PoE++ carries data and power on one Cat6 run.
  There is no line voltage anywhere in the wall. That keeps the build safe and leaves
  the door open to certifying it later. "PoE-only" is a rule from the first revision.
- **A 2x4 wall.** The stud bay is only about 3.5 inches deep. The 7-inch woofer's
  motor needs about 3.75 inches behind the baffle face, so in a 2x4 wall the baffle has
  to sit in the plane of the drywall. A 2x6 wall would be easier, but this house has 2x4.
- **Serviceable without opening the speaker.** The amp board rides a sled that plugs
  into a fixed dock through a gold-finger card edge. A failed board is a pull-and-swap
  from behind a cloth access panel. The speaker box itself is never opened.
- **Go-live at the end of 2027.** The enclosures get cut on a CNC machine arriving in
  spring 2027. The board design is well ahead of that plan.

## Where the electronics come from

The amplifier board is derived from **Sonocotta's open-source Esparagus "Audio Brick"
Dual-DAC (rev D)**, which is Apache-2.0 licensed. Its DAC and amplifier section is reused
almost as is. The microcontroller, Ethernet and PoE sections are new. Sonocotta gets
credit on the silkscreen and in the release notes.

## How the build is run

The board is designed by an AI engineer with a human approving each step. Claude Code
drives KiCad 10, every value is traced to a datasheet or a reference design, and the
work stops at eight gates for approval: requirements, architecture, schematic,
placement, layout, fab files, the order, and bring-up. The chapters that follow are
those gates, in order, with what was decided, the numbers behind it and what went
wrong. The tooling itself is its own project:
[The AI PCB Design Kit](../../pcb-design-kit/01-what-it-is/).

## What's in the box

| Part | Role |
|---|---|
| ESP32-S31 module | ESPHome, Sendspin, Bluetooth proxy, Thread/Matter radio |
| 2 x TI TAS5825M | Class-D amplifiers with DSP: sub on one, woofer + tweeter on the other |
| Motorcomm YT8531 | Gigabit Ethernet PHY |
| TI TPS2373-4 | 802.3bt PoE powered-device controller |
| Isolated 24 V converter | Turns 48-57 V PoE into the amplifier supply |
| Dayton RS180-8 | 7 in woofer |
| Dayton DC28F-8 | 1 in soft-dome tweeter |
| 2 x Dayton SD215A-88 | Shallow 8 in subs, in their own transmission line |
