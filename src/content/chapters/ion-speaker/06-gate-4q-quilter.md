---
project: ion-speaker
title: "AI layout with Quilter: what it can and can't be trusted with"
order: 6
gate: "Gate 4Q"
date: 2026-10-29
summary: "Run 1 put 14 parts on the wrong side of the isolation barrier. Run 2, with the PoE island done by hand, still went wrong: a capped DRC list hid nine open connections, and Quilter put about 125 parts on the bottom. Run 3 enforces both with keep-outs, and 24 vias came out of SMD pads while it runs."
status: draft
---

Boards with 101 to 999 parts go to **Quilter**, an AI placement-and-routing service, after
the critical parts are placed and locked by hand. Gate 4Q is reviewing what comes back
and deciding whether any candidate is good enough to carry forward. This one is
**in progress**: runs 1 and 2 are done and rejected, and run 3 is running.

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

## Update, Oct 29: run 2 came back, and so did our own mistake

Run 2 finished overnight: first candidate after 3 hours 11 minutes, all six done
by 01:42. Each one was 93-94 % routed. The good part held up: on all six, the 127 locked
parts hadn't moved, the 965 locked tracks and vias were intact, no copper crossed the
moat, and the inner planes were kept.

| Candidates | What went wrong |
|---|---|
| 1.1-3.1 | 14-18 secondary-side parts inside the PoE island: the TL431 and optocoupler feedback network for the isolated converter, placed by proximity again |
| 4.1-6.1 | About 125 parts on the bottom side, 27-29 of them not chip passives (SMB TVS diodes, 7343 polymer capacitors, SOT-89 and PowerDI3333 transistors, ESD arrays) |
| All six | 113-162 tracks and vias plus PoE-return pours added on island nets at 0.15 mm, breaking the 0.6 mm rule for the 57 V nets |

### What went wrong: a truncated list

The last one was our fault. The island was supposed to be finished, and the count
said "0 open". But `kicad-cli` caps its DRC report at 499 unconnected items, and the
board had 622. **Nine open connections at the PoE controller (TPS2373-4) were hidden
past the cap**, so Quilter routed them itself, with its default clearance.

Two lessons came out of it:

1. **Never trust a capped list.** The open count now comes from KiCad's own connectivity,
   through a script that first removes the parts waiting for Quilter, so the island
   list is short enough to read in full.
2. **"Prefer single-sided" is a preference, not a rule.** The board's bottom side is
   limited to 2 mm, chip passives only, so that limit is now a keep-out in the file.

**Decision:** no pick. Candidate 6.1 was the closest (barrier clean, best routed), but it
would have meant bringing about 28 parts back to the top and routing them again by hand.
Fixing the input and running again was cheaper.

## Run 3

Before run 3:

- **The island was finished properly.** The class-set resistor moved next to the
  controller's pins, following the TPS2373-4 layout guidance, and the detection, class,
  return and supply connections were routed by hand. With the full, uncapped count, the
  island has **0 open connections**, and the whole board has **0 DRC errors**.
- **Two new keep-outs:** no footprints anywhere on the bottom layer, and no new footprints
  inside the island.
- 127 parts and 1,080 tracks and vias are locked. Quilter gets 206 parts and 613
  connections, all on the secondary side.

Run 3 went in on October 29 at 11:41 with the same settings as run 2. The hand routing
also left vias inside SMD pads, which has since been fixed (see the evening update below).

We also gave the large parts real 3D models while run 3 runs (the transformers,
inductors, heatsinks, diodes and the converter IC), sized from their datasheet drawings.
That way the renders, and later the enclosure fit check, show true heights.

## Update, Oct 29 (evening): vias out of the pads, run 3 still routing

**Vias in pads.** We first counted 11 vias sitting inside SMD pads, all from the hand
routing of the PoE island. A small script that checks every via against every SMD pad found
**24**: the first count had been picked out by eye. The cause was in our own scripts:
the island router and the stitching script only checked clearance, and a via inside a
pad on the same net passes a clearance check. A via in an open pad wicks solder away from the joint during
reflow, so each one either moves or the order has to pay for filled and capped vias. We
moved them:

| What | Count |
|---|---|
| Vias found inside SMD pads | 24 |
| Moved just off the pad, same net | 22 |
| Dropped as redundant | 1 |
| Rerouted with its trace (the converter feedback net at a decoupling cap) | 1 |

Afterwards: **0 vias in pads, DRC still 0 errors, island still 0 open connections.** The
island router script now refuses to drop a via inside a pad, so this can't come back the
same way. Run 3 was submitted before the fix, so whichever candidate we pick gets the
same fix on top of it.

**Why "nothing on the bottom" at all.** The board stands on edge in its wall slot with
its bottom side against a 2 mm foam (EVA) pad. The requirement is "bottom side 2 mm
maximum, chip resistors and capacitors only". A few of the parts run 2 put underneath
were taller than that: the SMB-package TVS diodes are about 2.3 mm. Bottom-side SMT also
costs a second assembly pass, and anything there has to survive the wave that solders
the through-hole parts. Quilter has no "chip passives only" setting, so for run 3 we
banned bottom-side parts outright. The top side has room: the 206 parts left for
Quilter need about 28 % of the free top area.

**Run 3 progress.** After about seven hours Quilter had six placements, each scoring 77-78
of its checks met, 28-29 unmet and none failed. Its router was 33 of 51 steps in. There
is no routed board to review yet, so Gate 4Q stays open.

## Files

The board repo holds the submission notes and a candidate review for each run, plus the
scripts that check the barrier sides, the bottom-side parts and the island's open connections.
