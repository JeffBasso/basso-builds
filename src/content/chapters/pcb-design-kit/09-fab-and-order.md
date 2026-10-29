---
project: pcb-design-kit
title: "Fab package and the PCBWay order"
order: 9
gate: "Gates 6-7"
date: 2026-10-24
summary: "Gerbers, drill, BOM and pick-and-place built and tagged, then the PCBWay form filled in through Chrome. Claude stops at the payment page and reports price and lead time."
status: published
---

## Gate 6: the package

- Gerbers (RS-274X/X2) and Excellon drill files, zipped.
- A BOM with part numbers and alternates.
- Pick-and-place per side, with rotation and origin checked against PCBWay's conventions.
- Schematic PDF, renders and an assembly drawing.
- Order notes listing every spec to enter.
- The commit is tagged with the revision.

## Gate 7: the order

- Chrome opens a new tab, already signed in. A login, 2FA or CAPTCHA means Claude stops and asks.
- **One approval covers one submission.**
- Specs are entered exactly as written in the order notes.
- PCBWay's suggested part substitutions are reported, never accepted.

## Where it stops

At a payment page, a place-order or pay button, or a terms-of-purchase checkbox. Claude
reports the price, lead time and options, saves a screenshot of the filled form, and
logs everything. **You click pay.** If OBS is recording, it pauses on the checkout page.

## Conservative fab limits

Built into the rules, to be checked against PCBWay's current capabilities before going
tighter: trace and space 0.15 mm, finished drill 0.3 mm, via pad 0.6 mm, annular ring
0.15 mm, copper to edge 0.3 mm. The default board is FR-4, 1.6 mm, 1 oz, lead-free HASL,
with ENIG for fine pitch after asking.
