---
project: ion-speaker
title: "Architecture and parts: what goes on the board, and why"
order: 3
gate: "Gate 2"
date: 2026-10-26
summary: "The block diagram, the power tree with real currents, and every chip chosen with a reason and an alternate. It also caught two things the spec assumed that the datasheets said weren't true."
status: published
---

Gate 2 turns the requirements into a block diagram, a power tree with the current on
every rail, and a part for every job. Each part comes with a reason, an alternate, and a
datasheet saved to the board's repo. It was approved the same day as Gate 1, **October 26, 2026**.

## The block diagram

The board splits in two at an **isolation barrier**, because IEEE 802.3 requires the
cable side of a powered device to be isolated from the rest of it.

- **Primary side (the "PoE island"):** Würth 7490220122 Ethernet magnetics, the
  rectifier bridge and TVS, the TPS2373-4 PoE controller, and the primary of the
  24 V converter.
- **Crossing the barrier:** only the converter's transformer, two optocouplers that
  tell the microcontroller which PoE class the switch granted, a feedback opto, and
  safety capacitors.
- **Secondary side:** 24 V for the amplifiers, two bucks for 5 V and 3.3 V, the
  Ethernet PHY, the ESP32-S31, both amplifiers, and the connectors to the face board.

## The power tree

| Rail | Source | Max current |
|---|---|---|
| PoE in | 802.3bt Class 6, 51 W at the device | ~1.1 A at 48 V (1.85 A controller limit) |
| 24 V amp supply (PVDD) | isolated converter | 1.9 A at Class 6, 2.3 A at the firmware cap |
| 3.3 V | TPS62933O buck (3 A part) | ~1.0 A: S31 0.6 A, PHY ~0.15 A, amps, face board |
| 5 V | TPS62933O buck (3 A part) | 1.5 A for the face board (radar, voice processor, LED) |

## The parts, and why

**Microcontroller: ESP32-S31-WROOM-3 (N16R16V).** 16 MB flash and 16 MB PSRAM, for audio
buffers plus Thread and Bluetooth. It was chosen over the ESP32-S3 because it has its own
gigabit Ethernet MAC and its own 802.15.4 radio, which removes both a WIZnet W5500
Ethernet chip and a separate Thread co-processor. It's a new chip, and all three
Espressif documents (chip datasheet v0.5, module datasheet v0.7, hardware design
guide v0.3) are pre-release. They get re-checked before anything is ordered.

**Amplifiers: 2 x TI TAS5825M,** marked do-not-substitute. The circuit follows
Sonocotta's rev D, with three changes: fault and warning lines go to the
microcontroller instead of only to LEDs; the microcontroller drives the shutdown pin;
and 33-ohm series resistors go on the I2S lines.

- The output inductors are **10 µH,** because TI's datasheet requires at least 10 µH
  above 12 V supply at a 384 kHz switching frequency.
- The bridged sub amp uses a **Coilcraft XAL1010-103** (saturation 17.5 A). It needs more
  than 7 A and must stay out of saturation up to the 7.5 A overcurrent trip. Rev D's part
  was only good for 5.5 A.

**PoE controller: TI TPS2373-4.** The original spec used a Silvertel Ag5800 PoE module.
A discrete controller replaced it because it exposes the class-status pins the
microcontroller needs to read, so firmware can set the amplifier limits to the power
the switch actually granted.

**Ethernet: Motorcomm YT8531 PHY + Würth 7490220122 magnetics.** The magnetics are
rated 10/100/1000 with 1 A per center tap for 4-pair PoE. A gigabit-only sibling part
was rejected because the speaker drops to 100 Mbit/s when idle to save power. TI's
PMP20878 reference design uses this exact magnetics with this exact PoE controller,
so it serves as the reference for that whole corner.

**Bucks: TPS62933O.** The "O" variant keeps switching above 30 kHz at light load. That
matters in an audio product: a buck that drops into the audio band at idle whines.

## Two things the spec got wrong

- **"I2S2" doesn't exist.** The ESP32-S31 has two I2S controllers, not three. The plan
  became: I2S0 transmit drives both amps on a shared bus, I2S0 receive takes a raw
  measurement microphone, and I2S1 receive takes the processed voice stream.
- **Espressif's documents disagree with each other.** The hardware design guide calls
  the Ethernet "fast Ethernet"; the chip datasheet says 1000 Mbit/s. The datasheet
  wins (it's higher in the source rules), and the conflict is logged as a risk.

## A thermal decision made early

At 50 °C ambient, the sub amp delivering 20 W average into 1.6-2 ohms loses about
4.1-4.3 W and would run its junction at **149-173 °C**, past the chip's 160 °C
over-temperature limit. The decision was a **small heatsink on top of each amplifier,
plus firmware foldback**: when the amp raises its over-temperature warning, the
microcontroller lowers the sub's limiter.

## Part count and layout path

The block estimate came to **about 220 parts**; the spec had guessed 150. That's mostly
Ethernet decoupling, series resistors and the converter. The rule in the design kit is that
**101 to 999 parts goes to Quilter**, the AI layout service, on 4 layers. The final count
grew to 306.

## What's next

The converter chosen here was a flyback (TI LM51551 with a Coilcraft POE71F-24ED
transformer). Gate 3 ran the full calculation, and it didn't survive.
