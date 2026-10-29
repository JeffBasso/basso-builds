---
project: ion-speaker
title: "Installing it, and tuning it to the room"
order: 14
summary: "Cutting in, running one cable, sliding in the sled, and then letting the speaker measure itself at night when the radar says the room is empty."
status: planned
---

The last chapter is the install and the self-tuning that makes an in-wall speaker sound
like it was designed for that room.

## Auto-tune, version 1

1. Home Assistant starts a run at night when the radar reports an empty room, or on demand.
2. Each driver plays a 5-second log sweep, one at a time.
3. The node records on its own measurement mic, for driver-level fixes: the breakup
   notch, baffle step and level matching. It also records on the opposite node's mic,
   for room correction below about 300 Hz.
4. A small numpy/scipy service on the Home Assistant box deconvolves the recordings.
5. It fits the result to a target curve and writes the 15 EQ band gains.
6. It sweeps again to verify, and stores the before and after curves as sensors.

**Guardrails:** sweep levels well below the drivers' excursion limit; EQ held to ±6 dB
with no boost below 40 Hz; and a button that reverts to the last good tune.

## Phase 2

Parametric EQ on the spare biquads, driver time alignment from the impulse arrival
times, and sub-to-woofer phase alignment around 100 Hz.

## After Gate 8

The plan is to release the hardware as open source under **CERN-OHL-W-2.0** and the
docs under **CC-BY-SA-4.0**, with Sonocotta's Apache-2.0 attribution for the amplifier
circuit. It'll be exported from a clean public repo at rev A.
