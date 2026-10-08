---
title: "Shooting Plan Workbench"
lang: en
summary: "A single-file, offline planning workbench for photography studios. Open the file and start working — no backend, no build step, no installation."
tags: ["HTML", "Workbench", "Tooling"]
repo: JasonWithMiracle/shooting-plan-workbench
demo: "https://jasonwithmiracle.github.io/shooting-plan-workbench/online/"
detail_external: true
role: "Solo Developer"
year: 2026
featured: true
order: 2
github: "https://github.com/JasonWithMiracle/shooting-plan-workbench"
stars: 0
language: "HTML"
updated: "2026-10-05"
---

In photography, planning has long lived in an awkward place: one Word document plus a stream of chat messages. Dates, locations, wardrobe, props, and client expectations end up scattered across tools, and when the shoot day arrives, a human still has to hold it all in their head.

This workbench is meant to fix exactly that: **pull everything that needs alignment before a shoot into a single page.**

## The problem

The pain points in a photography studio are concrete:

- Plans, shot lists, and call sheets live in separate files and chat threads; handoffs rely on word of mouth.
- Commercial clients expect deliverables and retrospectives, yet the planning process leaves no structured trace.
- Photographers are rarely technical users. Installing an environment or running a build ends the conversation immediately.

So the constraints were strict: **it must open with a double-click, run offline, and require zero installation.**

## The approach

The key decision was a deliberate trade-off — **drop the framework and the build chain, go back to a single file:**

- The entire workbench is one standalone HTML file. Double-click it and it opens in a browser.
- No backend, no network, no npm, no runtime of any kind.
- Data stays in the browser's local storage, owned by the studio, never routed through a third-party server.

The cost is giving up componentization and engineering convenience. What it buys is the one thing that matters most to a photographer: **send it to any computer and it just opens.**

## What it covers

The workbench is organized around the full planning pipeline:

- **Creative plan**: structure the theme, client requirements, and style references into a deliverable brief.
- **Shot list and scenes**: organize shots, camera positions, and composition intent by scene, with export.
- **Call sheet**: consolidate timing, locations, crew, and equipment into a sheet you can take on set.
- **Export**: PDF output for client delivery and retrospectives.

## Status

The project has reached a sustainable stage of execution. It follows semantic versioning and is under active iteration, currently at `v1.0.14`. Core conventions, cloud sync, and preview capabilities are done; export precision and additional planning templates are next.

> The online version is a long-running demo site — you can try the full feature set right away.
