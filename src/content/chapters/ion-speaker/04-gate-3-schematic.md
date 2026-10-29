---
project: ion-speaker
title: "The schematic: a converter swap and a card-edge rethink"
order: 4
gate: "Gate 3"
date: 2026-10-27
summary: "Six sheets drawn from TI and Espressif reference designs. The flyback converter failed its own math and was replaced by TI's forward-converter design, and the card edge was re-pinned to keep 57 V away from everything else."
status: published
---

Gate 3 is the schematic: every sheet drawn from a reference design, every value with
its calculation, every deviation logged with a reason and a risk, and ERC at zero errors.
It was approved on **October 27, 2026**.

- **Sheets:** amplifiers, PoE and power, forward converter, Ethernet, MCU and connectors.
- **ERC:** 0 errors, 5 cosmetic warnings.
- **BOM:** 298 parts.

## The amplifiers

The sheet follows TI's TAS5825M typical-application figures for BTL and PBTL, with the
symbol checked pin by pin against the datasheet. The deviations:

- **PVDD decoupling uses 22 µF 50 V parts in 1210,** not TI's 35 V 0805. The design
  rules say a ceramic cap must be rated at least twice its working voltage, and 24 V
  needs 50 V.
- **The shutdown pin is pulled down, not up.** The amps stay off until the
  microcontroller is running and has loaded the DSP. That protects the tweeter: it
  never sees full-range signal before its high-pass filter exists.
- **10 µH in the bridged sub stage** instead of the 4.7 µH in TI's PBTL figure, per
  TI's own inductor table.

## The converter that failed its math

At Gate 2 the 24 V supply was a flyback. At Gate 3 it got a full calculation, following
TI's flyback design note SNVA866A, scripted so it can be re-run. With the current
limit set 10 % above the operating peak, and the transformer's saturation current at
least 1.2 times that limit, the Coilcraft transformer supports **only about 45 W** at
305 kHz. Primary ripple would be 75-110 % against a 30-70 % guideline. The Gate 2
figure of "55 W" had ignored current-limit margin.

So the design switched to **TI's PMP20878 reference: a TPS2373-4 PoE controller plus a
UCC2897A active-clamp forward converter, 24 V at 3 A, 92 % efficient.** It brings back
the Class 8 headroom. The price is idle power: about **3.7 W at no load**, against the
spec's 2 W idle target. Expect **4-5 W per speaker** sitting idle, or about 35-40 W for
eight speakers.

Copying a reference design isn't the same as copying a parts list. PMP20878 contained:

- **Obsolete or not-recommended parts,** each replaced with a current equivalent:
  - RF081M2S → MURA120
  - BAS316 → MMDL914
  - HMHA2801A opto → FOD817AS
  - 35TQC15MYF → 35TQC15MD2

  Two of these (the opto and the polymer capacitor) change the control loop, so the
  loop gets measured on the bench.
- **Electrolytic capacitors that wouldn't last in a hot wall.** An Arrhenius-style
  estimate at 70 °C continuous gave the amp bulk cap 2.6 years. A Panasonic hybrid
  polymer (EEH-ZK1V391UP) gives 20.7 years. Caps inside the converter's control loop
  were left alone until the loop is measured.
- **A soft-start sized for a different board.** This board adds about 1.8 mF on the
  24 V rail, so soft-start went from 0.047 µF to 0.22 µF. That changes start-up from
  8 ms to 39 ms, and cuts the charging current from about 5.2 A to 1.1 A, well inside
  the PoE controller's 2.2 A inrush limit.
- **No output over-voltage protection.** If the opto or the TL431 failed, 24 V could
  rise past the amplifiers' 30 V absolute maximum. An SMBJ24A TVS was added as a
  best-effort clamp. Its breakdown range can exceed 30 V, so it's logged honestly as
  "not a guaranteed clamp".

## Ethernet and the MCU

- **PHY changed to the YT8531DC.** The lower-power C variant's switching-regulator
  network isn't specified anywhere in its datasheet, and no reference design for it
  turned up. The DC variant is the one Espressif uses on its own S31 board, so that
  circuit was copied, at a cost of about 0.26 W.
- **Strap pins set for 3.3 V I/O.** The PHY's default strapping would have selected
  2.5 V I/O, which doesn't match the S31.
- **Crystal: Abracon ABM8W-25.0000MHZ-8-D1X-T3,** with the load-capacitance math in
  `calc/crystal.py`. Frequency trim and drive level are bench items.
- **The S31 module footprint was built from the preliminary datasheet,** including
  reconstructing a rotated thermal-pad grid from the drawing's vector geometry.
- **USB-C flashes the board but doesn't power it.** You need PoE or the bench 24 V.

## The card edge

The spec's pinout put the Ethernet pairs, which are on the 57 V cable side of a
1500 Vrms barrier, directly opposite the speaker outputs across a 1.6 mm board, and
3.96 mm from the 24 V input. The new pinout puts Ethernet on positions 1-4 only,
leaves **position 5 empty on both rows with the polarizing key in it**, and puts all
the low-voltage contacts on 6-12. The nearest low-voltage contact is now 7.92 mm away.

The socket changed too. The first choice listed 5 A per contact at distributors, but
its own drawing said 3 A, and its maker publishes no drawing for the mating card.
The **EDAC 305-024-520-201** is rated 5 A per contact and 1800 Vrms between contacts,
and its maker publishes a daughter-board drawing.

Even then, **no one publishes the width of the gold fingers** for a 0.156 in card edge:
not the socket makers, and not KiCad's libraries. It turned up in a 2007 military spec,
**MIL-DTL-21097G**: 2.39 mm wide fingers with a 30° bevel. That was cross-checked
against EDAC's tab width.

## Review

The Gate 3 checklist found one real failure: the 1-wire and sled-present lines at the
card edge had no ESD protection, so it was added. Accepted deviations were logged with
reasons, including the unfused bench 24 V input and the best-effort TVS.

## Files

The board repo holds a six-sheet `schematic.pdf` and a `calc/` folder with a script
for every non-obvious value: the converter, crystal, I2C pull-ups, heatsink, TVS,
optocouplers and socket current.
