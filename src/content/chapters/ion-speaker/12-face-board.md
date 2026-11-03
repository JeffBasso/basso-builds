---
project: ion-speaker
title: "The sensors board: voice, radar and room air"
order: 12
summary: "A small board at the top of the grille, with a four-mic far-field array, a radar that wakes the amps before you notice, a measurement mic for auto-tune, and now particulate and air-quality sensors. Its Gate 1 requirements were drafted on Nov 2."
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

## Update, Oct 30: the face board becomes the mic board

With the amp board now behind the grille, the temperature and humidity sensor (SHT41) moves onto it, on a slotted
tab at its cool bottom edge. The microphones and the XVF3800 stay on a small board at the top of the grille, as far
from the drivers as possible. The LD2450 radar joins them there: its manual recommends mounting at 1.5 to 2 m,
which the low amp board can't reach. The cover in front of it must be metal-free and, ideally, a whole number of
half-wavelengths thick at 24 GHz (about 3.9 mm in ABS).

The link becomes two ready-made Molex PicoBlade cables bought in fixed lengths (no cable building): a 14-way audio
cable carrying both I2S buses with a ground beside each clock, and a 10-way cable for 5 V, I2C, the XVF3800 reset
and the radar's UART.

## Update, Nov 2: the mic board becomes the sensors board

The board is now its own part of the project, renamed from "mic board" to
"sensors board", with a design spec and a first set of requirements. Two Bosch
sensors join it: the **BMV080**, a laser particulate-matter sensor (PM1, PM2.5,
PM10) on a flex tail with a 13-way ZIF connector, and the **BME690** for
temperature, humidity, pressure and VOC. The amp board keeps the SHT41 for the
cavity air, so every node has two temperature points: inside the wall and in the
room. There is **no microcontroller on this board**: everything is a bus device read
by the amp's ESP32-S31 over the two cables.

### What we decided and why

Jeff answered the Gate 1 interview in the small hours of Nov 3:

- **BME690 on its own 1.8 V LDO**, its optimised supply point, with its I/O at
  3.3 V to match the bus.
- **The LD2450 radar is soldered to the board**, antenna facing the room; the board
  owns the antenna-to-cover gap the enclosure has to provide.
- **The BMV080 sits in a cage on the PCB** (one of Bosch's two mounting concepts),
  so the board owns its position and heat path and the enclosure only provides a
  window.
- **Cloth only over the air sensors,** no slots in the grille frame. The risk is
  written down: PM readings behind cloth are unverified, so a breakout board gets
  tried behind a cloth sample before this board is drawn.
- **One Qwiic expansion port** on the shared I2C bus, 3.3 V only, with ESD and a
  PTC. Top-side assembly only, as on the amp. Five boards fabricated and two
  assembled for rev A. No status LED here; the amp keeps it.

### The numbers

- **Power:** 5 V from the amp over two 1 A cable contacts, with a hard limit of
  1.0 A total. The 28 AWG cable drops about 106 mV at 1 A over 600 mm, so the
  regulators here must accept 4.8 V in. Known so far: radar 120 mA average (its
  supply must deliver over 200 mA), BMV080 under 68 mA continuous, BME690 a few
  milliamps with 15-18 mA peaks. The XVF3800 and its mics are the Gate 2 unknown.
- **Height:** above the tweeter at about 1.5 m or higher, inside the radar's
  1.5-2 m mounting range.
- **What the enclosure must provide:** four mic ports in a line about 33 mm apart;
  a metal-free radar window whose thickness is a multiple of the half wavelength
  at 24 GHz (about 3.9 mm in ABS) within 20 %, at the gap the module specifies; a
  glass window 0.3-0.8 mm thick over the BMV080 lens with 5 mm of free air beyond
  it and nothing reflective within 350 mm; a vent for the BME690.

### What went wrong

Drafting the requirements turned up a stale line on the amp side: its rail table
still said the amp's 3.3 V feeds the mic board. The cable carries 5 V only, and this
board makes its own rails. Raised with the amp, not changed silently.

### What's next

Gate 1 waits for Jeff's approval of the written requirements. Gate 2 picks the mic
parts (the ICS-43434 and ICS-43432 are end of life), sizes the XVF3800's rails
against the 1.0 A limit, works out the I2C address map and bus capacitance with
450-600 mm of cable, and confirms that Bosch's binary libraries (BSEC and the BMV080
SDK) build for the S31 before any part is ordered.

### Files

The board's folder in the project repo holds the design spec, the Gate 1
requirements with the interview answers, and a status file. The Bosch datasheets
are filed with the project.
