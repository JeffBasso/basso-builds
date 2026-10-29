---
project: ion-speaker
title: "Fab outputs"
order: 8
gate: "Gate 6"
summary: "Gerbers, drill and assembly files, a hard-gold card edge, and one more check of the ESP32-S31's preliminary datasheets before anything is generated."
status: planned
---

Gate 6 turns the finished layout into the files a factory works from, and checks each
of them against what was approved.

## Planned work

- **Gerbers and drill files** for 4 layers, 1.6 mm, from the PCBWay standard stackup.
- **Assembly files:** BOM and pick-and-place, with every part's footprint rotation
  checked against the 3D view.
- **Card edge:** hard gold, bevelled fingers, called out on the fab notes.
- **Finish:** ENIG for the 0.4 mm-pitch QFNs.
- **Silkscreen:** a line reserved for the open-hardware mark, for the public release.
- **Re-check the ESP32-S31 datasheets.** All three Espressif documents were pre-release
  when the board was drawn. If any pin, footprint or strapping detail changed, it's
  fixed here, before the order.
