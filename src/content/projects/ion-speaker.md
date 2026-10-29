---
title: Project Ion
tagline: An in-wall, tri-amped smart speaker powered by a single PoE++ Ethernet cable, with the amplifiers, DSP crossover and a room sensor hub built into the wall.
status: in design
order: 1
started: 2026-09-01
target: End of 2027
tags: [PoE++, ESP32-S31, TAS5825M, KiCad, ESPHome, Sendspin, Dayton drivers]
stats:
  - { label: Power, value: "One PoE++ (802.3bt) cable per speaker" }
  - { label: Amplification, value: "Tri-amped: sub, woofer, tweeter" }
  - { label: Crossover, value: "DSP in firmware" }
  - { label: Controller, value: "ESP32-S31" }
  - { label: Amplifiers, value: "TI TAS5825M class-D" }
  - { label: Fits in, value: "A 4-inch stud bay" }
  - { label: Layout path, value: "KiCad + Quilter" }
---

Ion is a speaker that disappears into the wall. One Ethernet cable from a PoE++ switch carries both
power and audio. Everything else lives inside the stud bay: an isolated PoE power supply, two
class-D amplifiers, a DSP crossover that splits sub, woofer and tweeter in firmware, and an ESP32
that streams over the network with ESPHome and Sendspin.

The same board doubles as the room's sensor hub, with temperature, microphone, radar presence,
Bluetooth and Matter, so each room gets audio and sensing from one install.

## Where it started

The design derives from Sonocotta's open-source **Dual-DAC Audio Brick (rev D)**. Ion moves the
power supply onto the board, swaps in a newer controller, and fits the electronics on a slide-out
sled so a board can be serviced without cutting drywall.

## What you'll learn

- Budgeting PoE power across a whole house of speakers
- Designing an isolated PoE powered-device supply, and the clearance rules that come with it
- Laying out class-D amplifiers on a 4-layer board without noise problems
- Designing a stud-bay enclosure, including a long internal baffle for deeper bass
- Running the whole board design with AI: KiCad driven by Claude Code, with layout by Quilter

The chapters below follow the build in order. They fill in as each stage is built and filmed.
