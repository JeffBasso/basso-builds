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

## Update, Nov 1: a new connector sheet for the face-mount board

Moving the board out of the sled and onto the face of the bay (see the placement
chapter) reopened this gate for the connectors. The card edge is gone, so the
connector sheet was redrawn as a **draft**. It hasn't been reviewed or approved yet.

| Connector | Part | Notes |
|---|---|---|
| Ethernet | Amphenol RJHSE-3380, vertical RJ45 | faces out under a shroud; footprint drawn from Amphenol's drawing |
| Speakers | Phoenix MSTBA 2,5/6-G-5,08 header | sub, woofer and tweeter pairs |
| Mic board | two Molex PicoBlade headers | ready-made Molex 15134 cables |
| Expansion | two Qwiic ports | on a second I2C bus |
| Sensors | 1-wire header, SHT41 on board | SHT41 at the cool edge |

ERC is at zero errors, and a readability pass afterwards left the netlist unchanged.

Two things turned up while reading the connector datasheets:

- **The sub puts about 10 A peak through one speaker contact.** That's exactly the
  terminal block's 10 A rating, with no margin. Those traces need to be about 4 mm wide,
  so they get their own net class. Whether to keep the 6-position block or move to 8
  positions with two contacts per sub wire is open.
- **The ready-made PicoBlade cables are wired reversed** end to end, and they're 28 AWG. The mic board's pinout has to account for that, and its 5 V
  load is held to 1.0 A or less.

## Update, Nov 2: each sub gets its own channel, and a capacitor bank on the baffle

Two changes landed on the schematic in one long evening, both driven by the
enclosure's Gate 1 and the project requirements: the subs no longer share a bridged
channel, and the 24 V rail gets a large capacitor bank for music peaks.

### What we decided and why

- **Each sub on its own BTL channel, no bridging.** Each Dayton SD215A-88 is about
  3.2 ohm, right at the TAS5825M's minimum load for BTL, so the sub amplifier runs
  with its DSP output limiter at about 5 A peak per channel and the chip's
  cycle-by-cycle current limit switched on (allowed in BTL, not in the bridged mode
  we left). Both channels take the same sub signal with their own level and EQ. The
  "PBTL" symbol copy that existed only to let ERC accept tied outputs is gone; the
  amp is the library part again with four independent output filters.
- **The speaker block goes to 8 positions:** Phoenix MSTBA 2,5/8-G-5,08 header with
  the MSTB 2,5/8-ST-5,08 plug, 12 A per contact. Sub 1, sub 2, woofer and tweeter
  pairs in that order.
- **A 40 mF capacitor bank, off the board.** Jeff set the burst case: 50 W for
  50 ms with the rail allowed to sag from 24 V to 20 V. Four Rubycon VXG 35 V
  10,000 µF snap-in capacitors live on the baffle, on a 2-position Phoenix
  connector that is plugged only with the power off. The series is 105 °C, 5000 h
  rated, and must be: the 85 °C, 3000 h class lasts about a year at the board's
  70 °C assumption, this one 6.5 years, or 25.8 years at 50 °C.
- **A precharge circuit, not a slow soft-start.** A 100 ohm, 7 W wirewound resistor
  in the bank's return charges it after power-up, and a FET already on the BOM
  (FDMS86200) shorts the resistor out once the bank is up. The ESP32 closes that
  switch when a divider on the bank return reads under 0.5 V, or on a 20 s timer,
  and only then lets the amplifiers leave standby.
- **A bleeder across the bank,** trimmed from 2.2 kohm to 100 kohm along with the
  gate-supply resistors once the always-on cost was added up: the block went from
  about 0.4 W to about 40 mW on the 24 V rail.
- **The 24 V TVS stays,** even though its surge clamp can exceed the capacitors'
  35 V rating: with 40 mF in parallel a 10/1000 µs surge moves the rail about
  0.4 V, so the TVS never gets there, and the sustained fault (lost feedback) clamps
  at 27-32 V.

### The numbers

- **Bank size:** C = 2Pt / (V1² − V2²) = 2 × 50 W × 0.05 s / (24² − 20²) = 28.4 mF.
  Aluminium electrolytics are ±20 %, so the nominal bank must be at least 35.5 mF:
  four 10,000 µF parts. Three would be short at the tolerance limit. 20 V is not the
  amp's under-voltage limit (that is 4.5 V); it is output headroom, a 1.6 dB loss at
  the bottom of the sag.
- **Sub output inductors:** full-swing peak 24 V / (3.2 + 0.18 + 0.10) ohm = 6.9 A,
  and the derating rule wants saturation current at 1.2-1.3 times that, 8.3-9.0 A.
  The Coilcraft XAL7070-103 (7.5 A) fails it; the XAL1010-103 (17.5 A) takes all
  four sub outputs. The 4 ohm woofer peaks at 5.6 A, so its XAL7070 stays.
- **Trace widths** (IPC-2221, 10 °C rise, 1 oz outer copper): sub 3.5 A rms at the
  limiter needs 1.7 mm, the 4 ohm woofer at 72 W needs 2.2 mm. Both speaker net
  classes are set to 2.5 mm.
- **PoE budget:** the peak audio ceiling is 157 W (two subs at 40 W, woofer 72 W,
  tweeter 5 W). At a 10 dB crest factor a node draws 24.6 W at the port, 197 W for
  eight: inside the 210 W switch. At 8 dB it is 36 W each, over budget, so the
  firmware caps the loudness tier. Idle is about 4.5 W, loud music at the SPL
  target about 19 W.
- **Precharge:** 0.24 A at t = 0, time constant 4 s, 95 % charged in 12 s, 11.5 J
  dissipated per power-up. Eight nodes restarting together after a switch reboot
  draw 86 W at t = 0. A shorted bank leaves 5.8 W on the resistor, inside its rating
  at 50 °C ambient; the firmware raises a fault if the sense line never drops.
- **Bank ripple:** a class-D sine draws its supply current at twice the audio
  frequency. Both subs sustained at the limiter put 0.63 A rms through each
  capacitor, 25 % of its rating.

### What went wrong

- **The first plan was a slow soft-start**, from 0.22 µF to about 10 µF, so the
  converter itself would charge the bank at 0.6 A. It cannot work: the PoE
  controller feeds the converter's bias only for about 50 ms after start-up, and
  with a 1.8 s soft-start the converter's on-time at 50 ms would be shorter than its
  dead time. The auxiliary winding never takes over and the node restarts forever.
  Soft-start stays at 0.22 µF.
- **The precharge resistor started at 39 ohm**, which charges the bank in 5 s but
  leaves 15 W on a 5 W part if the bank is shorted. The fusible variant doesn't
  open until 100 W, so it was no help. 100 ohm at 7 W survives the fault; the cost
  is that full output is available 12-20 s after a power-up, not within the
  controller's boot time.
- **The October review had passed the XAL7070 against a 7 A figure.** Recomputed
  with the datasheet's on-resistance the peak is 6.9 A, and the rule needs 8.3 A of
  saturation margin. Corrected, with the row in the review marked as such.
- **The bank sense line first landed on an ADC2 pin,** which this ESP32 family
  cannot read while Wi-Fi is on. Two GPIO assignments were swapped to put it on
  ADC1.
- **The schematic editor dropped 11 T-junctions on every save** of the connector
  sheet. They were repaired at file level, and a netlist-diff script now runs after
  every edit: 281 nets before the evening, 290 after, every change accounted for.

### What's next

Gate 3 is not closed yet. Left: the review checklist on the amplifier and
connector sheets, the firmware sequence written down (bank enable after the sense
reading, before the amps leave standby), and the citation for the 802.3bt
PSE-side allocations. At Gate 4 the PCB catches up: the 8-position block, the two
new output filters, the bank connector and the precharge parts. A quick length
budget says the top-edge connector strip still has about 60 mm to spare.

## Update, Nov 3: Gate 3 approved again, for the face-mount board

The redone schematic was reviewed against the board's checklists and approved on
**November 3, 2026**.

### What we decided and why

Seven connector decisions closed the draft sheet:

- **RJ45 shield:** tied to ground through a 2 kV capacitor, with the alternative resistor left
  unpopulated.
- **Status LED:** a WS2812B driven through a TI SN74AHCT1G125 buffer at 5 V, with a 4.7 k
  pull-down on the data line, so the 3.3 V GPIO meets the LED's input threshold.
- **Qwiic and 1-wire power:** one shared Bourns MF-USMF035-2 resettable fuse (1210).
- **1-wire probe:** a JST XH 3-pin right-angle header (S3B-XH-A).
- **Qwiic:** two ports, as drawn.
- **Bench 24 V input:** a second Phoenix 1757242 two-position block, the same part as the
  capacitor-bank connector.
- **Cover-present switch:** dropped, which frees one GPIO.

The RJ45 went back to a right-angle jack on the top edge after Jeff saw the draft render
(Amphenol RJHSE-5380).

### What went wrong

- **The schematic editor's tool for pushing the schematic onto the board only half worked** and was
  reverted. The update was run by hand in KiCad instead, and the kit got two issues: a headless
  update, and the junction stripping.
- **Test points lost their "exclude from BOM and position files" flags** in that update. They were
  fixed on the schematic and the board.
- **The WS2812B datasheet in hand is for the V5, but the stock part is the V6.** The V6 sheet has to be
  fetched before the order.

ERC is at zero errors. The review (our own checklist plus the PoE and audio rules, and the
checklists from Wilson, Ott, IPC-2221, Johnson and Graham, and the two cookbooks) left no open
failure. The BOM is 345 parts, 340 of them on the PCB, so the Quilter path stands. The Ritchey and
Montrose checklists run at the layout review, not here.

## Update, Nov 13: the whole board, written as Python

The amp board is now **code-first**. Every one of its 368 parts and 227 nets is also written in
Python with [SKiDL](https://github.com/devbisme/skidl), and a parity check compares that netlist
with the drawn schematic. The drawing itself was not redrawn or changed.

### What we decided and why

- **Backport, don't redraw.** A trial on the PoE and power sheet a few days earlier matched the
  drawing with zero differences. That proved the Python could describe a real sheet. Writing the
  whole board was the next test: if the code-first path works on a 368-part board, the next board can
  start in Python.
- **One function per drawn sheet** (PoE and power, forward converter, MCU, amplifiers, Ethernet,
  connectors). Every part carries its value, footprint, do-not-place flag, BOM flag and part number,
  and every no-connect and power flag is written out. A small generator wrote it part by part from
  the drawn netlist. Cleaning up the converter's output by hand would have taken about an hour a
  sheet.
- **The PoE front end comes from a shared block.** That stage is now the `poe_pd` block in the public
  [pcb-blocks](https://github.com/JeffBasso/pcb-blocks) library. The board's Python calls it, and
  the copy records which commit it came from (see the kit's "Reusable circuit blocks" chapter).
- **The Python is the source of truth.** Where the two disagree and the drawing is wrong, the Python
  keeps the right value. The drawing gets an issue in the board repo, and the parity check keeps
  flagging it until a board session fixes the drawing. From now on, every schematic change goes into
  both sides in the same commit, and Gate 5 needs parity at zero.

### The numbers

| Check | Result |
|---|---|
| Parts / nets, Python | 368 / 227 |
| Parts / nets, drawing | 368 / 227 |
| Differences | 3, all in the drawing |
| SKiDL's own ERC | no errors or warnings |

The three differences:
- **R102.** The TPS2373-4's class-B resistor is 90.9R (Class 8) in the Python, but still 249R
  (Class 6) on the drawing. Class 8 is what the board should ask for, per the TPS2373-4 datasheet's
  classification table.
- **R604.** Its value reads "DNP 1M" on the drawing, but its do-not-place attribute is off, so the
  BOM would still fit it. This counts as two differences: the value and the flag.

### What went wrong

Nothing broke, but the check found two mistakes that every earlier review had passed. A value field
that says "DNP" doesn't make a part do-not-place. And a strap left at the old power class would have asked the
switch for 51 W at the PD instead of 71 W.

### What's next

A board session fixes R102 and R604 on the drawing, and parity reaches zero. After that, the Python
and the drawing move together.

## Files

The board repo holds a six-sheet `schematic.pdf` and a `calc/` folder with a script
for every non-obvious value: the converter, crystal, I2C pull-ups, heatsink, TVS,
optocouplers and socket current, and since Nov 2 the bank sizing, start-up, PoE
budget, capacitor life, bank ripple, precharge and netlist-diff scripts. Since Nov 13 it also holds
the board's Python (`src/`, one module per sheet plus the `poe_pd` block) and the latest parity
report.
