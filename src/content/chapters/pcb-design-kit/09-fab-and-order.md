---
project: pcb-design-kit
title: "Fab package and the PCBWay order"
order: 9
gate: "Gates 6-7"
date: 2026-11-13
summary: "Gerbers, drill, BOM and pick-and-place built, checked and tagged, then the PCBWay form filled in through Chrome. Claude stops at the payment page and reports price and lead time."
status: published
---

Like every gate, GATE 6 is an issue worked on its own branch, and the fab package is handed over
as a pull request for Jeff to review. GATE 7's approval is different: Jeff pays, himself, on the
page Claude stopped at.

## Gate 6: the package

- Gerbers (RS-274X/X2) and Excellon drill files, zipped.
- A BOM with part numbers and alternates.
- Pick-and-place per side, with rotation and origin checked against PCBWay's conventions.
- Schematic PDF, renders and an assembly drawing.
- Order notes listing every spec to enter.
- The commit is tagged with the revision.

## Keeping test points out of the BOM

Before the BOM and pick-and-place are final, a board check confirms that every test
point, mounting hole and fiducial is excluded from both, and the summary states the count
found in each file, which must be zero. A test point left in the BOM is a part PCBWay
would try to source and place. This came from the first real board: updating the board
from the schematic copied the flags from the symbols, took the exclusions off 27 test
points, and nothing complained. The rules now put the exclusions on the symbols, so every
update carries them, and a hook runs the same check whenever a GATE 6 commit is marked
in review.

## Gate 7: the order

- Chrome and its extension are checked first. Then a new tab, already signed in. A login,
  2FA or CAPTCHA means Claude stops and asks.
- **One approval covers one submission.**
- Specs are entered exactly as written in the order notes.
- PCBWay's suggested part substitutions are reported, never accepted.

## Where it stops

At a payment page, a place-order or pay button, or a terms-of-purchase checkbox. Claude
reports the price, lead time and options, saves a screenshot of the filled form, and
logs everything. **Jeff clicks pay.** If OBS is recording, it pauses on the checkout page.

PCBWay's quote form is also used earlier, during the size trials at the start of layout,
to price each candidate outline. That is a quote only: no upload and no order.

## Conservative fab limits

Built into the rules, to be checked against PCBWay's current capabilities before going
tighter: trace and space 0.15 mm, finished drill 0.3 mm, via pad 0.6 mm, annular ring
0.15 mm, copper to edge 0.3 mm. The default board is FR-4, 1.6 mm, 1 oz, lead-free HASL,
with ENIG for fine pitch after asking.
