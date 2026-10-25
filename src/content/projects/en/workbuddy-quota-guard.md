---
title: "WorkBuddy Quota Guard"
lang: en
summary: "Reverse-engineers each model's 429 limit from local session logs, then warns about remaining quota, generates handoff documents, and renders a dashboard."
tags: ["Python", "Quota Management", "Tooling"]
cover: /covers/workbuddy-quota-guard.png
repo: JasonWithMiracle/workbuddy-quota-guard
role: "Solo Developer"
year: 2026
featured: true
order: 3
github: "https://github.com/JasonWithMiracle/workbuddy-quota-guard"
stars: 0
language: "Python"
updated: "2026-10-25"
---

The most frustrating moment when running a complex task in WorkBuddy is this: halfway through, the model returns a **429** and everything is cut off — while the client UI never tells you how much quota that model has left. You only find out by hitting the wall.

Rate limited → switch models → rerun → uncontrolled quality and a lot of repeated work. I went through that loop far too many times myself.

## The problem

The issue is not "not enough balance." The limit is a **per-account, per-model quota on a rolling 24-hour window**:

- The client only exposes a total quota, never the remaining amount per model.
- The CLI layer returns no `rate-limit` response headers.
- Without a signal, there is no basis for planning ahead or switching models smoothly.

So before you hit the wall, a human has zero warning.

## The approach

The core idea: **read local session logs only, reverse-engineer each model's historical limit, and estimate the remaining amount using the exact same window semantics.**

Two technical points carry the whole thing:

| Problem | Solution |
| -------- | -------- |
| The per-model limit is unknown | Scan the logs for every 429 event and its window-reset timestamp; for each model, take the consumption of **that model alone** within that window, then take the median across samples → a **lower bound** on the limit |
| The 429 event carries no model field | Attribute by session proximity: the model used by the most recent successful request within 120 seconds before the 429 in the same session, falling back to the session's majority model |

Window semantics is where mistakes happen most easily: the observed median interval between two consecutive resets is **24.01 hours**, which means the quota uses a **rolling window**, not a calendar day. Current status is therefore always computed over `(now - W, now]`, strictly consistent with the window used during reverse-engineering.

> Why a "lower bound"? Being rate limited means you had consumed *at least* enough to exceed the limit, so the sample value can only underestimate the real one.

## What it does today

A read-only, zero-dependency tool (pure Python standard library) covering the full path from early warning to handoff:

- **Limit reverse-engineering**: outputs `limits.json` with global thresholds, per-model limits, and error-code statistics.
- **Live status**: estimates usage ratio and risk level (low / medium / high) per model over the current rolling window.
- **Dashboard**: an adaptive dark-themed HTML file you open directly in a browser.
- **Handoff**: generates a five-part `handoff.md` so the next model can take over immediately after a 429.
- **Hook pre-check**: registered on the `SessionStart` event, quota is checked as soon as a session starts and high-risk models are flagged.
- **Skill-ready**: installable as a WorkBuddy Skill and callable with a single natural-language request.

In the sample run, `hy4-preview` reached a usage ratio of **1.748** over the rolling window (risk: high), and `deepseek-v4.1-flash` reached **1.097** (high) — two numbers that were completely invisible before hitting a 429.

## Known boundaries

The boundaries matter more than the features, because everything is reverse-engineered:

| Limitation | Explanation |
| ---------- | ----------- |
| Limits are statistical lower bounds | Models with few samples are less trustworthy and need calibration after real triggers |
| Real remaining quota is unreachable | The client's login state lives in Electron's DPAPI-encrypted storage, unreadable by an external script — only log-based inference is possible |
| Depends on local logs | Clearing session logs discards the historical samples and they must be accumulated again |
| Platform-specific | Currently targets the WorkBuddy / CodeBuddy desktop client |

## Privacy and safety

- **Read-only** access to local logs; nothing in WorkBuddy's data is modified or deleted.
- No data is uploaded to the network.
- Generated artifacts are gitignored by default and never committed.
- The repository contains no personal identifiers, account IDs, or session content.

> The sister project is the [WorkBuddy Token Audit](/portfolio/en/workbuddy-token-audit/) — that one answers "how much did it cost", this one answers "how much quota is left".
