---
project: ion-speaker
title: "Placement: a board that grew twice and an isolation moat"
order: 5
gate: "Gate 4"
date: 2026-10-27
summary: "Fitting 306 parts on one side of a board that drops into a slot in the wall: the outline went from 100 x 70 to 140 x 90 to 180 x 70 mm, with an L-shaped moat keeping the PoE side apart."
status: published
---

Gate 4 is placement: the outline, the connectors, then the parts whose position
matters, such as switching loops, crystals, the antenna and the isolation barrier. The
rest of the layout follows from it. It was approved on **October 27, 2026**, and the
outline was re-cut the next day.

![The amp board in KiCad's 3D view during placement](/images/ion-speaker/cover.jpg)

## The outline, three times

1. **The spec said about 100 x 70 mm.** The part footprints alone add up to
   7,460 mm². Single-sided, with the moat and keep-outs, the board needs about
   12,500-13,500 mm². At 100 x 70 there would have to be parts on the bottom too.
2. **140 x 90 mm plus an 8 mm card tang.** This is the version sent to Quilter run 1.
3. **Then the sled was checked.** The board drops into the wall standing on edge, so
   its short side has to fit the roughly 70 mm of height above the dock socket. The
   stud bay is 14.5 in wide, so the board went long instead: **180 x 70 mm plus the tang.**
   It's still single-sided.

The lesson is in the order. The mechanical limit that mattered most, the sled height,
was written in the spec's enclosure section and wasn't checked until after the first
layout run. Run 1 was left to finish anyway, as a way to learn how Quilter handles the design.

## The isolation barrier

Both sides of the barrier are low-voltage by IEC 62368-1's definitions (57 V and 24 V),
so this is functional insulation. The real requirement is IEEE 802.3's port isolation
test: 1500 Vrms, or 2250 V DC.

- **Clearance** from IEC 62368-1 Table 14 at 2250 V: 1.3 mm.
- **Creepage** from Table 17 at 57 V working, pollution degree 2: 1.25 mm.
- The spec asked for 2.5 mm. The safety capacitors that straddle the moat set the
  actual minimum copper gap at **2.7 mm**. The copper-free strip is about 4 mm wide.

The moat is **L-shaped**, and the PoE island is the bottom-left corner, 82 x 40 mm. The
moat is a keep-out on all four copper layers: no tracks, vias or pours. The only things
that cross it are the parts designed to: the converter transformer, the Ethernet
magnetics, three optocouplers and the safety capacitors.

## The floor plan

- **Above the moat:** the converter's secondary side, hugging the transformer's pins.
- **PHY:** right next to the Ethernet magnetics, with its crystal beside it.
- **ESP32-S31 module:** top center-right, with its antenna overhanging the top edge and
  no copper under it.
- **Top edge:** USB-C, buttons and the debug header, where you can reach them on the bench.
- **Bottom:** both amplifiers side by side, directly over the speaker fingers.
- **Edges:** a 3 mm copper-free strip down each short edge, where the printed sled
  rails grip the board.

127 parts were placed by hand and locked, including all 63 parts on the PoE side,
placed by a script.

## Stackup and impedance

4 layers, 1.6 mm, from PCBWay's standard stackup. Layer 1 signal, layer 2 ground (with
a separate ground island under the PoE side), layer 3 power, layer 4 signal.

The Ethernet pairs need 100 ohms differential and USB needs 90 ohms. A hand calculation
(the IPC-2141 closed-form equations) for 0.2 mm traces with a 0.2 mm gap gave
**101 ohms**. Quilter's own impedance solver later agreed: 100 ohms at
0.20/0.158 mm and 90 ohms at 0.256/0.158 mm.

## Rules that had to be written by hand

- **0.6 mm spacing on every 57 V net** (IPC-2221, external uncoated, 31-150 V).
- **Trace widths from current** at a 10 °C rise: 24 V at 2.3 A needs 0.95 mm, and the
  sub at 2.5 A peak needs 1.06 mm.
- The 0.6 mm rule is enforced by a custom KiCad rules file rather than a net-class
  setting, because the net-class version flags the fine-pitch QFN pads on its own parts.

## Tooling surprises

- The KiCad MCP server rewrote the project file from its defaults on every save, so a
  script re-applies the fab rules after every edit.
- Net classes were created without their net patterns. Every net was in Default, so the
  first DRC ran at the minimum spacing everywhere and missed the 57 V rule.
- A KiCad library footprint for one MOSFET broke the fab's minimum spacing, so it was
  rebuilt from the manufacturer's recommended land pattern. DRC then came back with
  **0 errors**.

## Surface finish

**ENIG** instead of HASL: flat pads for the 0.4 mm-pitch QFNs, and gold for the
card-edge fingers, with hard gold and a bevel specified on the order.
