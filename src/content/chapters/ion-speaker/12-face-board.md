---
project: ion-speaker
title: "The face board: voice, radar and room sensors"
order: 12
summary: "A small board behind the grille at mouth height, with a four-mic far-field array, a radar that wakes the amps before you notice, and a measurement mic for auto-tune. Two of its mics went end of life before it was drawn."
status: draft
---

The sensors don't go on the amp board. They go on a small 2-layer board behind the
grille at **mouth height, 4 to 5 ft up,** so readings come from the room and not from the
warm amp compartment. The sensor set can also change without touching the amp board.

## Sensors

- **SHT41** temperature and humidity, on a slotted island at the board edge so the
  board's own heat doesn't reach it.
- **HLK-LD2450 mmWave radar** for multi-target position tracking through the grille
  cloth. It's also the **pre-wake trigger**: it brings the amps out of standby before
  anyone is close enough to hear them wake.
- A status LED with a light pipe for link, fault and presence.
- Footprints only, for later: a light/UV sensor, a VOC sensor and a PIR.

## Far-field voice

Decided in October 2026:

- An **XMOS XVF3800** voice processor with **four MEMS mics in a line, about 33 mm
  apart,** following XMOS's reference spacing.
- It does beamforming, echo cancellation, noise suppression and gain control in
  hardware, and hands the ESP32-S31 one clean audio stream. The S31 only runs the wake word.
- Echo cancellation needs to know what the speaker is playing, so the amps' audio feed
  is looped to the face board. That's why the face connector carries the amp I2S data.
- A separate **measurement mic** goes raw into the S31 for auto-tune sweeps, because the
  processed voice stream isn't flat.
- The array sits at the top of the board, above the tweeter and as far from the
  drivers as it can be, which makes echo cancellation easier.

## The mic problem

On October 28 the distributor listed both planned mics, the ICS-43434 for the array and
the ICS-43432 for measurement, as **last-time-buy, with a date that had already passed.**
The only listed substitute is marked "similar" and hasn't been checked.

- The array mics only affect the face board.
- The measurement mic's replacement **must have I2S output.** A PDM-only mic would need
  the S31's first I2S port in PDM receive mode, which clashes with that same port
  driving the amps, and would force changes to the amp board.

Replacements are still being picked.
