---
project: ion-speaker
title: "Ordering from PCBWay"
order: 9
gate: "Gate 7"
summary: "Five boards, two assembled. The assembly quote doubles as the stock check, and the order is placed by a person, not by Claude."
status: planned
---

Gate 7 is the order. In the design kit, Claude prepares the files and the quote request,
and stops. A person reviews the quote and clicks the button.

## Planned work

- **Five boards fabricated, two assembled,** the rev A quantities set at Gate 1.
- **The assembly quote is the stock check** for the parts that aren't in the assembler's
  own library. Two items could force changes: the ESP32-S31 module (new, limited
  stock), and the 22 µF 50 V caps in 1210.
- **Quote ENIG,** and note the difference against HASL.
- **Confirm the 0.18 mm hole-to-copper** on the USB-C footprint with the fab.
- **Uploads are done by hand.** The browser extension refuses to upload files from the
  board folder, so the files get dragged in manually, the same as for Quilter.
