---
title: "WorkBuddy Token Audit"
lang: en
summary: "Parses WorkBuddy's local request logs to compute token usage and cost by task and session, with time-of-day and tiered pricing."
tags: ["Python", "Cost Analysis", "Tooling"]
cover: /covers/workbuddy-token-audit.png
repo: JasonWithMiracle/workbuddy-token-audit
role: "Solo Developer"
year: 2026
featured: true
order: 1
github: "https://github.com/JasonWithMiracle/workbuddy-token-audit"
stars: 0
language: "Python"
updated: "2026-09-20"
---

After working with AI for a while, the hardest question to answer is this: **how many tokens did this job actually burn, and what did it cost?** The UI only shows a quota — no breakdown, and certainly no way to attribute it per task.

## The problem

Translate "quota" back into "cost", and answer three questions:

- How many tokens did a single task burn?
- How much of that was cache hits (which are far cheaper)?
- How much goes to automated jobs versus human work?

## The approach

Every data source is local — no third-party service involved:

- Request-level tokens: read `rawUsage` from the session logs to get prompt / completion / cache-hit / reasoning tokens; sub-agent logs are traced back to their parent session by directory.
- Task metadata: read session titles, working directories, models, and the "is this a background automation" flag from the local SQLite database.
- Pricing: three tiers based on each vendor's real rate structure (non-cached / cache hit / cache write), plus peak-and-off-peak tier detection by time and holiday for models that price that way.

## The key finding

In practice, this machine's cache hit rate is above 95%. That means a naive two-tier "input / output" estimate would overstate cost by roughly seventy percent — **tiered pricing is not an optimization, it is a precondition for accuracy**.

## What it does today

Three modes share a single price table, so there is never a second set of numbers:

- Audit: scan historical logs and produce a real consumption report
- Interactive dashboard: browse by session or task
- Step estimation: estimate what a step will cost before you start

> The tool depends only on the Python standard library — clone it and run.
