---
project: pcb-design-kit
title: "What the kit is, and the problem it solves"
order: 1
date: 2026-10-24
summary: "One installer, a short set of engineering rules, and a handful of skills that turn a Windows PC into an AI-assisted board design station. Claude takes a board from requirements to a filled-in PCBWay order, then stops at checkout."
status: published
---

The AI PCB Design Kit is a single PowerShell installer plus a set of rules, skills and
guardrails. Together they make an ordinary Windows PC into a circuit-board design
station where **Claude Code works as the PCB design engineer.** It takes a board from
requirements to a filled-in PCBWay order and stops at checkout. A person pays.

## The toolchain it wires together

- **KiCad 10,** driven through an open-source MCP server (KiCAD-MCP-Server, MIT
  licensed). It handles schematic capture, placement, routing, ERC/DRC and exports.
- **Freerouting** autoroutes small boards.
- **Quilter** does AI placement and routing on boards with **101 to 999 parts.**
- **Claude in Chrome** fills in the Quilter and PCBWay web forms.
- **PCBWay** fabricates and assembles.
- **CadQuery** writes 3D models for parts KiCad's library doesn't have.
- **OBS Studio** films the sessions, and an **OBSBOT Tiny 2** camera can be aimed by Claude.
- A **self-hosted GitHub Actions runner** runs the nightly jobs.
- A **phone dashboard** shows what's happening while you're away from the desk.

## The problem

A language model can produce a plausible circuit from memory, and that's the danger.
A pinout, absolute-maximum rating or footprint remembered "roughly" becomes a dead
board. The kit is built around stopping that:

- **Every decision traces to a source:** a datasheet, reference design, app note or
  standard. The rules say "never from memory alone".
- **The work is cut into eight approval gates,** plus one for Quilter. Claude stops at
  each one, summarizes, and waits.
- **What can be enforced is enforced.** A guard hook and permission rules block the
  dangerous actions. What can't be enforced stays a written rule.
- **Nothing lives only on the desktop.** Every repo pushes on commit, so the PC can be
  rebuilt by running the installer again and cloning.

## The stance

It's a careful senior hardware engineer, scripted. The installer asks before each
change. The rules are short, and longer procedures load only when needed, as skills. Long
jobs report progress to a phone. The person keeps the decisions that matter: approving
gates, approving uploads, picking a Quilter candidate, and paying.

The first real board built with it is [Project Ion](../../ion-speaker/01-the-idea/), an in-wall PoE
speaker amp. A lot of the kit's PoE and audio rules exist because of that board.
