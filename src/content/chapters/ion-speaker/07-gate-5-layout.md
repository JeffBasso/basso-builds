---
project: ion-speaker
title: "Layout and verification"
order: 7
gate: "Gate 5"
summary: "Picking a Quilter candidate, or finishing the routing by hand, and then checking timing, thermals, EMC and noise before anything is sent to the fab."
status: planned
---

Gate 5 takes the routed board from "it connects" to "it's right". DRC at zero is only
the start: this gate checks timing, heat, emissions and the noise you can hear.

## Planned work

- **Pick or reject the run 2 candidates** from Quilter, against the checks listed in
  the Gate 4Q chapter.
- **RGMII skew** between the S31 and the PHY within 1.25 mm across each group.
- **Power-plane pull-back:** keep the inner power copper at least 1 mm back from the
  board edges and the card tang, per TI's EMC note for the TAS5825M (SLAA856A).
- **Continuous ground under the amps,** with stitching vias around the output stages.
- **Thermal pad:** choose the gap-pad between amp heatsink and board, and log its thermal
  resistance.
- **Thermal vias** under the PoE controller per its datasheet.
- **Bottom-side height check** against the 2 mm limit.
- **Silkscreen cleanup** and footprint descriptions.

## Junction temperatures still to check

At 50 °C ambient with the real copper, the converter FETs, the PoE controller, the PHY and
the bucks still need numbers. The amps are done: **118-131 °C at full sub load with the
heatsink**, against about 176 °C without one.

## The EMC checklist

From TI's *TAS5825M Design Considerations for EMC*:

- 1 nF on every PVDD pin (done before run 2).
- Low-impedance return paths for the speaker outputs, and filtered connector pins.
- **Keep the LC output filter.** The speaker wire inside the bay may run past 1 m, and the
  sub is a 1.6 ohm load, so the ferrite-bead option doesn't apply.
- In firmware: 384 kHz BD modulation with spread spectrum, and a phase offset between the
  two amps to halve the ripple on the 24 V rail.

## The noise checklist

- Quiet bucks: done (the "O" variants stay above 30 kHz).
- Converter hum at bass rates, absorbed by the 1.8 mF bank: listen for it on the bench.
- MLCC "singing" in the 24 V and output-filter caps: if it's audible, rev B moves to film
  or low-acoustic parts.
- Board vibration: an EVA pad under the board, snug rails, and flexible-termination caps
  near the fingers.
