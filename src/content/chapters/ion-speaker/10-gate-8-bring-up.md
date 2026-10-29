---
project: ion-speaker
title: "Bring-up and first sound"
order: 10
gate: "Gate 8"
summary: "Powering the first board one rail at a time from a bench supply, then PoE, then the amps, with a list of measurements written before the boards arrive."
status: planned
---

Gate 8 is the bench. The board comes up one stage at a time, starting with a
current-limited bench supply rather than PoE.

## The bench list (rev A)

**Power**
- The converter's loop phase margin. TI measured 4.2 kHz and 59° on its reference, but
  the hybrid capacitors and the substitute opto change the loop, so it gets measured again.
- What happens if the feedback path opens, and whether the 24 V TVS holds.
- Ringing on the PoE input at turn-on and on load steps.
- Real idle power at the switch port (expected 4-5 W).

**Clocks and buses**
- Trim the PHY crystal to within ±3 ppm, and check its drive level.
- I2C rise time with the face-board cable attached.
- The PHY reset held low for at least 10 ms (firmware).

**Audio**
- The sub limiter loads before the sub is unmuted (firmware).
- Overcurrent behaviour at 1.6 ohms. If the sub channel trips, the fallback is rewiring
  the subs to 8 ohms and running that channel in BTL.
- Listen for coil and capacitor noise with bass playing.

**Network**
- PoE class granted (Class 6), and LLDP power requests and grants with the switch.

## On camera

First PoE power-up with the class readout, the switch's allocated-versus-used power,
a thermal camera on the amps, and the first crossover measured at -6 dB.
