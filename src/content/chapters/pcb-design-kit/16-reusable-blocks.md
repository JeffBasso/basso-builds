---
project: pcb-design-kit
title: "Reusable circuit blocks"
order: 16
date: 2026-11-13
summary: "A public library of circuit blocks, each one a drawn KiCad sheet paired with a Python (SKiDL) module and checked against it. The first is the 802.3bt PoE front end, cut from the Ion amp board."
status: published
---

Some circuits get drawn again on every board: a PoE front end, a buck converter, a USB port. The
blocks library keeps one checked copy of each. A board takes the block, and records which version
it took. It doesn't redraw the circuit from a reference design.

The library is public, under a permissive open-hardware licence:
[github.com/JeffBasso/pcb-blocks](https://github.com/JeffBasso/pcb-blocks) (CERN-OHL-P-2.0).

## What a block is

Each block comes in two forms that have to agree:

| Part | What it is |
|---|---|
| The drawn sheet | A KiCad schematic sheet, also published as a KiCad **design block**, so it can be placed from the Design Blocks panel |
| The Python module | A SKiDL `@subcircuit` with the block's ports as arguments: the checked list of parts and nets |
| A test harness | A small project that wires the ports to named nets, so the two forms can be compared |
| `BLOCK.md` | What it is, its ports and ratings, the sources it draws on and their licences, and where it has been proven |
| `BRINGUP.md` | Measurements from built boards. It stays empty until a board is built and tested |

A parity check compares the drawing's netlist with the Python's, part by part and net by net. A
block only lands when that check reports zero differences, the junction check and KiCad's ERC are
clean, and the drawing and the Python changed in the same commit.

## The first block: an 802.3bt PoE front end

`poe_pd` is the powered-device side of a PoE port, from the magnetics' centre taps to the DC-DC
converter's input. It was cut straight out of the Ion amp board's PoE and power sheet, so it is the
circuit that passed that board's Gate 3 review:

- two Schottky bridges, one per pair set, so both 2-pair and 4-pair switches work;
- an input common-mode choke, a TVS and the bulk capacitance;
- TI's TPS2373-4 for detection, classification and the hot-swap FET, strapped for **Class 8** (up
  to 71.3 W at the PD from a Type 4 switch), per the TPS2373-4 datasheet's classification table;
- the TPH/TPL power-grant pins carried across the isolation barrier by two optocouplers, so the
  firmware can read what the switch actually granted.

`BLOCK.md` has a firmware section that matters as much as the schematic. The block asks for Class 8,
but the switch decides. Whatever reads TPH/TPL has to keep the load inside the grant, because
nothing in the hardware stops the converter from drawing more.

The block's status says it plainly: **drawn and parity-checked, not yet bench-proven**, and no
compliance certification is claimed. It becomes "proven" only when `BRINGUP.md` has measurements from
the built amp board.

## How a board uses a block

The kit installs the library next to the workspace and adds it to KiCad's design-block, symbol and
footprint tables, so a board session can:

1. place the block from the Design Blocks panel as its own sheet;
2. copy the block's Python into the board's own `src/blocks/`, with a first line naming the
   library commit it came from;
3. call it from the board's Python, and run the parity check on that sheet.

Boards pin to a commit. A later change in the library never changes a board that already took the
block. Blocks get version tags once they are bench-proven.

The Ion amp board was the first to do this, when its whole schematic was backported to Python (see
Project Ion's Gate 3 chapter).

## Adding a block

A block starts life on a real code-first board, and the library's rule is that it should be proven
there (bench measurements) before it is cut out. The first block was cut early, from a reviewed but
not yet built board, and says so in its status:

1. A board's sheet is drawn and at parity zero with its Python.
2. A small tool cuts the sheet out of the board's schematic and writes the test project's top sheet.
   It refuses an unclean cut, for example a wire that leaves the sheet without a port.
3. The board's module becomes the block's module, the drawn sheet is copied into the design-block
   library, and the block's check script runs until every block passes.
4. `BLOCK.md` and `BRINGUP.md` are written, and the block lands through a pull request.

## What went wrong

Not much yet, with one block. The useful surprise was the power class. The amp board's drawing was
still strapped for Class 6 when the block was cut. The block moved to Class 8 when its power
negotiation rules were written up, and the board drawing got an issue to match. Parity can't catch a
mistake like that: the drawing and the Python agreed on the wrong value. Writing down what the
switch grants is what showed it.

## What's next

The amp board's other stages (the bucks, the forward converter, the amplifier channels) are
candidates once the board has been built and measured. The first block becomes "proven" at the amp
board's bring-up.
