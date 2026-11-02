---
project: ion-speaker
title: "Requirements, and the sub that couldn't be 4 ohms"
order: 2
gate: "Gate 1"
date: 2026-10-26
summary: "Pinning down power, loads, sizes and temperatures before any part is chosen. Reading the datasheets turned up the first surprise: the sub wiring in the spec was impossible."
status: published
---

Gate 1 is the requirements document: what the board must do, what it plugs into, how
much power each rail needs with margin, the environment it lives in, how big it can be
and how many to build. Nothing is drawn until this is approved. It was approved on
**October 26, 2026**.

## What we settled

- **Power class:** 802.3bt **Class 6** (51 W at the powered device), set by two
  resistors. The power stage is sized so that moving to Class 8 (71.3 W) is a single
  resistor change (`RCLSB` from 249 ohms to 90.9 ohms, per the TPS2373 datasheet's
  classification table).
- **Amplifier mapping:** amp A drives the sub in **PBTL** (both channels bridged into one);
  amp B drives the woofer and the tweeter in BTL. The spec's original table also had a
  spare channel and contradicted itself about which amp drove the sub; this fixed both.
- **Ethernet magnetics on the board,** not an RJ45 jack. The RJ45 lives on the dock in the wall.
- **Height limits:** 25 mm on the top side, 2 mm underneath (chip passives only), so the
  board fits its slot.
- **Design ambient: 50 °C** inside the amp compartment. Every thermal number later is at 50 °C.
- **First revision:** 5 boards fabricated, 2 assembled.

## The power budget

A playing node spends most of its life at 5 to 12 W. Music averages about a tenth of its
peaks. At clipping on every channel, it would draw about 70 W.

| PoE class | At the node | After the 24 V converter | Fit |
|---|---|---|---|
| 802.3at (PoE+) | 25.5 W | ~22 W | normal listening, caps peaks |
| 802.3bt Class 6 | 51 W | ~45 W | **the plan** |
| 802.3bt Class 8 | 71.3 W | ~62 W | full headroom on bass-heavy music |

The catch is the switch. It has 8 PoE++ ports and a **210 W** budget, and it reserves
budget by the class each device negotiates, not what it actually draws. By class, 210 W
covers about three Class 6 speakers; by real draw, it covers eight. So the design plans
for **LLDP power negotiation**: each speaker asks the switch for more power only when
it's about to play loud, and Home Assistant hands out power tiers (full, reduced,
background) across the house. Going up, the speaker waits for the grant before raising
its volume limiter. Going down, it lowers the limiter first.

The spec also asked for "Autoclass" on the PoE controller. Reading the TPS2373
datasheet showed the word doesn't appear in it: that chip doesn't have it. LLDP covers
the same need.

## The sub that couldn't be 4 ohms

The spec said the two subs would be wired "for 4 ohms". Each Dayton SD215A-88 has two
voice coils. Its datasheet gives Re = 3.2 ohms with its two coils in parallel, so each
coil is 6.4 ohms. To get the volume, all four coils of both subs go in parallel:

> 6.4 ohms / 4 = **1.6 ohms**

Two dual-coil subs can't make 4 ohms. "4 ohms" was one sub's coils in parallel.

1.6 ohms is exactly the TAS5825M's minimum load in PBTL mode. That would be fine, except
that in PBTL the amp has **no cycle-by-cycle current limiting**. If it hits its 7.5 A
overcurrent threshold, it shuts the channel down instead of limiting. The numbers:

- Full swing at 24 V into the sub: **13.4 A peak total, 6.7 A per channel**, against the 7.5 A trip.
- Capping it at 5 A per channel is a 17 V peak, which is still about 90 W of sine into the sub.
  That's more than PoE can feed anyway, so the cap costs nothing you can hear.

So three requirements came out of it:

1. A **DSP output limiter** on the sub, loaded before the sub is ever unmuted.
2. Output inductors that don't saturate up to the 7.5 A trip.
3. A card edge and socket that carry about **10 A peak**.

There's zero margin on minimum load, and the spread from one sub to the next is unknown.
If bench testing shows trips, the fallback is to rewire the subs series-parallel to
8 ohms and run the sub channel in BTL.

## What's next

Gate 2 picks every part to meet these requirements.

One question from this stage is still open for the enclosure: Dayton lists the sub's
overall depth as 95 mm, while the spec assumed about 74 mm. That has to be checked
against the 2x4 bay.

## Update, Nov 1: requirements for the whole speaker

Ion is now more than one board. There's the amp board, a small mic board, and the
enclosure. So on **November 1, 2026** we wrote one shared requirements document for all
three, plus an interfaces file that holds every number more than one part depends on
(outline, mounting, heights, connectors, the heat path), each with the part that owns it.
The amp board's own requirements carry over unless this changes them.

What it settled:

- **One stud bay per speaker, everything in it, subs included.** That replaces the
  two-bay plan in the enclosure chapter. All eight speakers get subs. The wall is 2x4
  framing with 8 ft ceilings: 3.5 in deep, about 14.5 in between studs. If something
  won't fit, the enclosure's Gate 2 has to show it with numbers.
- **Loudness target: 100 dB peaks at 3 m from a stereo pair.** With a placeholder
  sensitivity of 86 dB, the woofer channel at 24 V gets about 36 W into 8 ohms, which
  works out to roughly 95-98 dB at 3 m in the direct field. That's short, and we wrote it
  down as short instead of hoping. Room gain may close it; if not, the choice is a lower
  target, a higher supply voltage within the TAS5825M's limit, or a different crossover.
  It gets settled at Gate 2 with real datasheet numbers.
- **Heights:** tweeter about 40 in off the floor (seated ear height); mic board about
  1.5 m, which suits both the voice mics and the LD2450 radar's 1.5-2 m mounting range.
- **Power, for the whole house:** the same 210 W switch feeds all eight speakers.
  Home Assistant arbitrates the LLDP power requests. With everything playing at once,
  each speaker has to run on an allocation **below 26 W at the switch**, so the
  negotiated class can never be the plan. Music peaks above the allocation come from
  bulk capacitance on the 24 V rail.
- **Schedule:** eight speakers live by the end of 2027; the enclosures wait for a CNC
  arriving in spring 2027.
