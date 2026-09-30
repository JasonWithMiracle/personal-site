---
title: "Iteration That Can't Regress: How a Ratchet Works"
lang: en
date: 2026-08-06
summary: "When you revise on feel alone, the real risk isn't making a mistake — it's complacency. You can't tell whether you've gotten worse. A ratchet fixes exactly that: keep only the edits that raise the score, roll back everything else."
tags: [Method, Productivity, Retrospective]
draft: false
---

When we revise something, we assume we know what we're doing. But have you ever had this experience: you finish, think "this reads much better" — then two weeks later you look back and realize some part actually got worse, and you can't say which step broke it.

That's not a competence problem. It's a **missing frame of reference**. And a frame of reference can be built.

## A project I botched first

I built myself a "Closure Orchestrator" tool. After a project wraps, it consolidates scattered output into four kinds of assets: experience, documents, terminology, explainers. Sounds thorough.

In practice, every wrap-up I had to do one extra thing by hand — **backfill the product documents**.

At first I thought the flow just wasn't written clearly. But the problem was more fundamental: the tool's orchestration order was wrong. It extracted terminology first, then backfilled docs. But terminology *explains* concepts and docs *define* them. With the upstream unfinalized, the downstream necessarily hangs in mid-air.

The most awkward instance: 40+ glossary entries referenced module names that all mismatched the final document's naming. Reworking cost more than starting over.

<div class="callout callout-warning">
<p class="callout-title">The nature of the problem</p>
<p>It wasn't "I forgot to write docs." The <strong>sequence was wrong</strong>. With no slot for the document stage, a human has to cover the gap — and anything a human has to remember will eventually be missed.</p>
</div>

## The turning point: don't spend iterations on "feel"

Knowing the problem, the next step should logically be to just fix it. But I paused.

Because I realized: if I start revising on feel right now, I'll probably reproduce the same problem. I'll think "this is much smoother," but I have no way to judge —

- Where exactly was it weak?
- How much did it improve?
- Did I quietly regress on some dimension I wasn't watching?

Three questions, and feel can't answer any of them.

So the first decision wasn't "how to fix it." It was **to build a ruler first**. I used an evaluation tool called darwin-skill with eight assessment dimensions, to quantify the current state before touching anything.

The baseline score was **64.7**.

The number itself doesn't matter. What matters is that it showed me where the weaknesses clustered: missing orchestration stage, uncodified environment pitfalls, unmarked points where I should stop and ask. The revision direction became concrete — no longer "something feels off."

## The ratchet: an agreement not to regress

With a ruler in hand, the rule is simple but crucial:

> Re-score after revising. **Keep only the edits that raise the score. Roll back anything that lowers it.**

That rule is the **ratchet**.

A ratchet is a mechanical thing — a gear that turns one way only, locked against reverse. Applied to iteration, it means: **the process can only move monotonically upward. Regression isn't allowed.**

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 300" width="100%" role="img" aria-labelledby="ratchet-analogy ratchet-analogy-desc" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="ratchet-analogy">The ratchet: only upward movement is allowed</title>
  <desc id="ratchet-analogy-desc">Left: iteration on feel, where scores oscillate. Right: ratcheted iteration, where only upward segments are kept.</desc>

  <text x="24" y="24" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">Iterating on feel · scores oscillate</text>

  <g>
    <line x1="24" y1="160" x2="304" y2="160" stroke="#d2d2d7" stroke-width="0.5"/>
    <line x1="24" y1="40" x2="24" y2="160" stroke="#d2d2d7" stroke-width="0.5"/>

    <polyline points="24,120 68,96 112,132 156,78 200,112 244,64 288,104" fill="none" stroke="#c0392b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="24" cy="120" r="3.5" fill="#c0392b"/>
    <circle cx="68" cy="96" r="3.5" fill="#c0392b"/>
    <circle cx="112" cy="132" r="3.5" fill="#c0392b"/>
    <circle cx="156" cy="78" r="3.5" fill="#c0392b"/>
    <circle cx="200" cy="112" r="3.5" fill="#c0392b"/>
    <circle cx="244" cy="64" r="3.5" fill="#c0392b"/>
    <circle cx="288" cy="104" r="3.5" fill="#c0392b"/>

    <text x="24" y="184" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">start 64.7</text>
    <text x="288" y="184" font-size="12.5" fill="#c0392b" text-anchor="end" dominant-baseline="central">ended 104 · but regressed twice</text>
  </g>

  <text x="376" y="24" font-size="13" font-weight="500" fill="#0071e3" text-anchor="start" dominant-baseline="central">Ratcheted · only upward segments</text>

  <g>
    <line x1="376" y1="160" x2="656" y2="160" stroke="#d2d2d7" stroke-width="0.5"/>
    <line x1="376" y1="40" x2="376" y2="160" stroke="#d2d2d7" stroke-width="0.5"/>

    <polyline points="376,120 420,96 464,78 508,64 552,52 596,44 640,40" fill="none" stroke="#0071e3" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="376" cy="120" r="3.5" fill="#0071e3"/>
    <circle cx="420" cy="96" r="3.5" fill="#0071e3"/>
    <circle cx="464" cy="78" r="3.5" fill="#0071e3"/>
    <circle cx="508" cy="64" r="3.5" fill="#0071e3"/>
    <circle cx="552" cy="52" r="3.5" fill="#0071e3"/>
    <circle cx="596" cy="44" r="3.5" fill="#0071e3"/>
    <circle cx="640" cy="40" r="3.5" fill="#0071e3"/>

    <text x="376" y="184" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">start 64.7</text>
    <text x="640" y="184" font-size="12.5" fill="#0071e3" text-anchor="end" dominant-baseline="central">ended 92.7 · no regression</text>
  </g>

  <rect x="24" y="214" width="632" height="66" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
  <text x="340" y="238" font-size="13" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">The left ends higher, but it fell several times — you can't tell which jump was real progress.</text>
  <text x="340" y="262" font-size="13" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">The right ends lower, but every point was earned and stayed.</text>
</svg>
</div>

Does the left line remind you of revising your resume, your proposals, or yourself? Endless tug-of-war, and at the end you can't say whether you got better or worse.

## Why documents must precede terminology

Back to the specific problem. With the ruler in hand, the change I made was just one thing: **insert a single step into the original three-step flow.**

Before: experience → terminology → explainers.

After: experience → **documents** → terminology → explainers.

One extra step, but the order changed. And that order can't be flipped, for a plain reason: **documents define concepts, terminology explains them.** If the definition isn't written yet, there's nothing to explain.

Think of it like building a house versus writing the floor plan description. You can build the house first, then write the manual. But you can't write the manual first and then build — because you don't yet know what the rooms will be called.

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 268" width="100%" role="img" aria-labelledby="order-title order-desc" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="order-title">Why documents must precede terminology</title>
  <desc id="order-desc">Documents define; terminology explains. If the upstream isn't finalized, the downstream floats — so the document stage must come before the terminology stage.</desc>

  <text x="24" y="24" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">The document's role</text>
  <g>
    <rect x="24" y="44" width="300" height="72" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="174" y="70" font-size="14" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Defines concepts</text>
    <text x="174" y="94" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">what this module is called, where its edges are</text>
  </g>

  <text x="356" y="24" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">The term's role</text>
  <g>
    <rect x="356" y="44" width="300" height="72" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="506" y="70" font-size="14" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Explains concepts</text>
    <text x="506" y="94" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">what it means, how it's used</text>
  </g>

  <path d="M174 116 L174 140 L506 140 L506 116" fill="none" stroke="#86868b" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#ord-ar)"/>
  <defs>
    <marker id="ord-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="158" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">explanation depends on definition</text>

  <rect x="24" y="182" width="632" height="62" rx="10" fill="#fcebeb" stroke="#c0392b" stroke-width="0.5"/>
  <text x="340" y="204" font-size="13" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Flip the order and terminology ends up explaining something that doesn't exist yet — 40+ entries all mismatched.</text>
  <text x="340" y="226" font-size="12.5" fill="#c0392b" text-anchor="middle" dominant-baseline="central">That's not "not being careful enough." The order was wrong.</text>
</svg>
</div>

## Two more unglamorous but valuable changes

**First: write down the pitfalls you've hit.**

I had a few environment pitfalls I kept stepping on. One directory refused to delete — I tried the delete command several times before realizing the sandbox was blocking it. Another time a title contained a slash, which looked perfectly normal but bent a script's directory tree out of shape.

What these have in common: **not hard, but forgettable.** So I wrote them into a table and put it directly in the flow. Next time, no re-thinking required.

**Second: mark the points where you must ask a human.**

Autonomous flows have a hidden problem — not insufficient capability, but that they'll skip the moments where they should stop and ask.

This can't rely on "remembering." So I hard-coded five key checkpoints onto the flow's mandatory path rather than in a footnote. A rule in a footnote is not a rule.

## The results

One revision round, score from **64.7** to **92.7**.

But the number I care about more is another one: **after revising, the size didn't grow at all.**

Because there's a trap here. A scorecard governs quality, not cost — judge by score alone and the thing grows fatter and fatter until readability suffers. So I added a condition to "keep the change": size can't exceed 150% of the original.

The final result landed within the ceiling. **Quality up, cost flat** — only then is it genuinely better.

<div class="callout callout-important">
<p class="callout-title">Three things you can lift directly</p>
<p><strong>1. Build the ruler before you start.</strong> Even a handful of self-defined criteria beats "feel." With a ruler, you know whether you're progressing or spinning.</p>
<p><strong>2. Add a ratchet.</strong> Re-score after revising; keep only what raises the score. Roll back the rest. That rule turns "endless churn" into "continuous accumulation."</p>
<p><strong>3. Put a ceiling on cost.</strong> Chasing quality alone makes things fatter. Quality up with cost flat is what real improvement looks like.</p>
</div>

## In closing

This method sounds like it's for tools, but it isn't picky about its subject.

Resumes, proposals, a work process, even organizing your own knowledge base — anything where you "want it better but fear making it worse" fits.

The core is two sentences: **build the ruler, then set the ratchet.**

The ruler tells you where it's good; the ratchet keeps you from sliding back. With both, iteration becomes accumulation rather than churn.

---

> For the full technical detail — the eight dimensions, the four-stage orchestration design, and the complete pitfall log — see the **[full write-up under Practice](/practice/en/darwin-skill-optimization/)**.
