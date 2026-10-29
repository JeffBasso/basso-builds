---
project: ion-speaker
title: "AI layout with Quilter: what it can and can't be trusted with"
order: 6
gate: "Gate 4Q"
date: 2026-10-28
summary: "Quilter's first run came back overnight with six candidates at 90-91 % routed, and 14 parts on the wrong side of the isolation barrier. For run 2, everything safety-related was placed and routed by hand first."
status: draft
---

Boards with 101 to 999 parts go to **Quilter**, an AI placement-and-routing service, after
the critical parts are placed and locked by hand. Gate 4Q is reviewing what comes back
and deciding whether any candidate is good enough to carry forward. This one is
**in progress**: run 1 is done and rejected, and run 2 is running.

## Run 1

Submitted on the evening of October 27 on the free tier. It was the 140 x 90 board with
64 parts locked. Quilter parsed 325 components, 261 of them to place, and 976 connections to route.

The settings that matter:

- **Inner planes kept.** The stackup comes from the file, with the ground planes and the
  PoE ground island preserved.
- **Differential pairs:** 2 USB pairs at 90 ohms; 4 Ethernet pairs and 4 PHY pairs at
  100 ohms. The PHY pairs had to be added by hand, because their names don't end in P/N.
- **37 power nets** with their real currents. The bucks had to be marked as switching
  converters by hand.

Some quirks showed up along the way:

- Its pair detector flagged the amplifier bootstrap nets as differential pairs.
- It doesn't import KiCad's design rules (only Altium's).
- It routes everything to the fab minimum, with no per-net clearance.
- RGMII timing constraints are listed as "coming soon".

**The result:** it finished after 4 hours 14 minutes, with the first candidate at about
two hours. There were **six candidates, all 90-91 % routed, none complete.**

Running the best candidate through the project's own design rules:

- 225 unrouted connections
- 499 clearance errors, **343 of them against the 0.6 mm rule for 57 V nets**
- 33 hole-to-copper errors, plus starved thermals and dangling vias

The good news: **no copper crossed the moat**, the locked parts hadn't moved, and the
inner planes were intact.

The bad news: **14 parts landed on the wrong side of the isolation barrier.** Six
secondary-side parts were placed inside the PoE island, and eight PoE-side parts were
placed outside it. Quilter treats the moat as a copper keep-out, but it doesn't know
which side of the barrier a part belongs to. It places by proximity, so those parts'
connections became impossible to route.

**Decision:** no candidate picked.

## What we learned

1. **Anything safety-related is done by hand and locked before the AI pass.**
   Quilter can't be told which side of a barrier a part belongs on, and it can't apply
   a 0.6 mm clearance to the 57 V nets.
2. **Give it room.** The 180 x 70 re-cut helped, and so did moving the PHY next to the
   magnetics and spreading the amps apart.
3. **Free-tier runs are cheap experiments.** Run 1 was allowed to finish even after
   the outline was known to be wrong, because the review taught more than stopping
   it would have.

## Run 2: the PoE island done by hand first

Before run 2, the whole PoE island was placed and routed, then locked:

- **Ethernet pairs and center taps** routed by script at 0.2/0.2 mm (about 101 ohms).
- **The finger order on the card edge was changed** so the pairs don't cross. Gigabit
  PHYs correct pair polarity automatically, and the dock board maps fingers to RJ45 pins,
  so the order on the cable side is free. The dock has to follow the new map.
- **The island itself:** Freerouting got most of it with 0.6 mm clearances on an
  island-only copy of the board. A script stitched the PoE ground to its inner-layer
  island with 32 vias. The last few nets were boxed in by 57 V copper on every side, so
  **a small grid A\* router was written for this one job.** It uses a 0.1 mm grid, both
  layers, and the per-net clearances from the rules file, and it rips up only
  autorouted copper, never hand-routed copper.
- **One exception, approved by hand:** the PoE controller's own pins are at 0.65 mm
  pitch, so a 0.6 mm clearance can't reach them. Inside that chip's courtyard only,
  clearance drops to 0.2 mm.

Result: **DRC 0 errors, 0 open connections in the island**. 965 tracks and vias and
127 parts are locked. Quilter gets only the secondary side: 206 parts and 499
connections. Eight more 1 nF capacitors went on the amplifier supply pins, per TI's
EMC application note for the TAS5825M (SLAA856A).

Run 2 was submitted on October 28 at 18:56.

## What's next

Each run 2 candidate gets the same checks:

- DRC against the PCBWay rules and the 57 V rules file.
- Nothing from the secondary side inside the island, on any layer.
- Locked parts unmoved.
- RGMII skew checked by hand.

Then comes a review with renders of the top two, and the Gate 4Q decision.
