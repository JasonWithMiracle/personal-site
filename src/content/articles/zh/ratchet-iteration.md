---
title: "不许退步的迭代：棘轮机制是怎么工作的"
lang: zh
date: 2026-08-06
summary: "凭感觉改东西，最大的风险不是改错，是自满——你根本不知道自己有没有变差。棘轮机制解决的正是这个问题：只保留让分数变高的改动，降分的一律回滚。"
tags: [方法论, 效率, 复盘]
draft: false
---

改东西的时候，我们都以为自己知道在干什么。但你有没有过这种体验：改完觉得「这下顺眼多了」，过两周回头看，发现某个地方反而退步了，而且说不清是哪一步弄坏的。

这不是能力问题，是**缺少参照系**。而参照系是可以造出来的。

## 先说一个我做砸的项目

我给自己搭了个「收尾总编」的工具。项目做完之后，它负责把散落的东西收敛成四类资产：经验、文档、术语、科普。听起来挺周全。

实际跑起来之后，我每次收尾都得多干一件事——**手动补产品文档**。

一开始我以为是流程没写清。后来发现问题更根本：这个工具的编排顺序是错的。它是先抽术语、后补文档，可术语是「解释概念」的，文档是「定义概念」的。上游还没定稿，下游自然悬在半空。

最尴尬的一次，术语表里四十多条条目引用的模块名，全和最终文档里的命名对不上。返工比重做还累。

<div class="callout callout-warning">
<p class="callout-title">问题的本质</p>
<p>不是「忘了写文档」，是<strong>时序错了</strong>。流程里没有文档阶段的位置，就只能靠人兜底——而靠人记住的事，一定会漏。</p>
</div>

## 转折点：不要在「感觉」上浪费迭代

知道了问题，下一步按理说该动手改了。但我卡了一下。

因为我意识到：如果我现在就开始凭感觉改，我大概率会改出第二个同样的问题。我会觉得「这次顺畅多了」，但我根本无法判断——

- 到底是哪里差？
- 改完好了多少？
- 我有没有在某个没注意的维度上偷偷退步？

这三个问题，感觉一个都答不上来。

所以第一个决定不是「怎么改」，而是**先造一把尺子**。我用了一个叫 darwin-skill 的评分工具，它有八个评估维度，让我先把现状量化出来。

基线分数是 **64.7**。

这个数字本身不重要，重要的是它让我看清了短板集中在哪：编排时序缺失、环境坑没固化、该停下来问人的地方没标出来。改版方向从此变得非常具体，不再是「感觉哪里不对」。

## 棘轮：一个不许退步的约定

有了尺子，接下来的规则就简单了，但很关键：

> 改完之后重新评分。**只有分数变高的改动才保留，分数变低的，一律回滚。**

这条规则叫**棘轮**（ratchet）。

棘轮是机械上的东西——齿轮只能往一个方向转，反方向会被卡住。用在迭代上，它的意思是：**过程只能单调向好，不允许退步。**

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 300" width="100%" role="img" aria-labelledby="ratchet-analogy ratchet-analogy-desc" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="ratchet-analogy">棘轮机制示意：只允许单向上升</title>
  <desc id="ratchet-analogy-desc">左侧是无棘轮的自由迭代，分数会上下波动；右侧是带棘轮的迭代，每一步只保留上升的部分。</desc>

  <text x="24" y="24" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">凭感觉迭代 · 分数会来回波动</text>

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

    <text x="24" y="184" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">起点 64.7</text>
    <text x="288" y="184" font-size="12.5" fill="#c0392b" text-anchor="end" dominant-baseline="central">终点 104 · 但中间退步过</text>
  </g>

  <text x="376" y="24" font-size="13" font-weight="500" fill="#0071e3" text-anchor="start" dominant-baseline="central">棘轮迭代 · 只保留上升段</text>

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

    <text x="376" y="184" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">起点 64.7</text>
    <text x="640" y="184" font-size="12.5" fill="#0071e3" text-anchor="end" dominant-baseline="central">终点 92.7 · 全程未退步</text>
  </g>

  <rect x="24" y="214" width="632" height="66" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
  <text x="340" y="238" font-size="13" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">左边看起来终点更高，但中间掉下来好几次，你无法确定哪一次是「真正的进步」。</text>
  <text x="340" y="262" font-size="13" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">右边终点低一些，可每一分都是攒下来的，不会丢。</text>
</svg>
</div>

左边那条线像不像你改简历、改方案、改自己的时候的样子？反复拉扯，最后说不清自己是变好了还是变差了。

## 为什么必须「先文档后术语」

回到那个具体的问题。有了尺子之后，我做的改动其实只有一个：**在原本的三步流程里，插入一步。**

原来的顺序是：经验 → 术语 → 科普。

新的顺序是：经验 → **文档** → 术语 → 科普。

就多了一步，但是顺序变了。这个顺序不能颠倒，理由也很朴素：**文档定义概念，术语解释概念。** 定义还没写出来，解释的对象就不存在。

打个比方，这就像盖房子和写户型说明。你可以先把房子盖好，再写说明书；但你不能先写说明书，再去盖房子——因为你根本不知道那几个房间最后叫什么。

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 268" width="100%" role="img" aria-labelledby="order-title order-desc" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="order-title">为什么文档必须先于术语</title>
  <desc id="order-desc">文档是定义者，术语是解释者；上游未定稿时下游必然悬空，因此文档阶段必须排在术语阶段之前。</desc>

  <text x="24" y="24" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">文档的角色</text>
  <g>
    <rect x="24" y="44" width="300" height="72" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="174" y="70" font-size="14" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">定义概念</text>
    <text x="174" y="94" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">这个模块叫什么、边界在哪</text>
  </g>

  <text x="356" y="24" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">术语的角色</text>
  <g>
    <rect x="356" y="44" width="300" height="72" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="506" y="70" font-size="14" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">解释概念</text>
    <text x="506" y="94" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">它是什么意思、怎么用</text>
  </g>

  <path d="M174 116 L174 140 L506 140 L506 116" fill="none" stroke="#86868b" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#ord-ar)"/>
  <defs>
    <marker id="ord-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="158" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">解释依赖定义</text>

  <rect x="24" y="182" width="632" height="62" rx="10" fill="#fcebeb" stroke="#c0392b" stroke-width="0.5"/>
  <text x="340" y="204" font-size="13" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">顺序颠倒的后果：术语在解释一个还不存在的东西，40+ 条条目全部对不上最终命名。</text>
  <text x="340" y="226" font-size="12.5" fill="#c0392b" text-anchor="middle" dominant-baseline="central">这不是「不够仔细」，是顺序错了。</text>
</svg>
</div>

## 还有两个不太起眼但很值钱的改动

**第一个：把踩过的坑写下来。**

我有几个环境上的坑，反复踩了好几次。比如有个目录删不掉，我试了好几遍删除命令都没用，最后才发现是沙箱拦截了；又比如某个标题里带了个斜杠，看起来完全正常，结果把一个脚本的目录结构建歪了。

这些坑的共同点是：**不难，但会忘。** 所以我把它们写成一张表，直接放进流程里。下次遇到，不用再想一遍。

**第二个：把「必须问人」的地方标出来。**

自动跑的流程有个隐蔽的问题——不是能力不够，是它会跳过那些本该停下来问人的环节。

这个不能靠「记得」。所以我把五个关键检查点写死在流程的必经路径上，而不是写在附注里。因为写在附注里的规则，等于没有规则。

## 结果

一轮迭代，分数从 **64.7** 到 **92.7**。

但我更在意的其实是另一个数字：**改完之后，体积一点没涨。**

因为这里有个陷阱。评分卡只管质量，不管成本——如果你只看分数，东西会越改越臃肿，最后可读性反而下降。所以我在「保留改动」的条件里加了一条：体积不能超过原来的 150%。

最终落在红线之内。**质量上升，成本不变**，这才算真的改好了。

<div class="callout callout-important">
<p class="callout-title">三个可以直接搬走的做法</p>
<p><strong>一、动手前先造尺子。</strong>哪怕只是给自己定几条评价标准，也比「凭感觉」强得多。有尺子，你才知道自己在进步还是在原地转。</p>
<p><strong>二、加上棘轮。</strong>改完重评，只留下让分数变高的部分。降分的回滚。这条规则能把「反复折腾」变成「持续累积」。</p>
<p><strong>三、给成本设上限。</strong>只追质量会越改越胖。质量上升、成本不涨，才是真的变好。</p>
</div>

## 最后

这套方法听起来像是给工具用的，但它其实不挑对象。

写简历、改方案、优化一套工作流程，甚至整理自己的知识库——只要是「想变好，但又怕越改越差」的事，都可以套进来。

核心就两句话：**先造尺子，再定棘轮。**

尺子让你知道好在哪，棘轮让你保证不倒退。有了这两样，迭代才真正是积累，而不是折腾。

---

> 想看这个项目的完整技术细节，包括八维评分卡的具体构成、四阶段编排的设计，以及全部踩坑记录，可以看 **[实践经验里的完整版](/practice/zh/darwin-skill-optimization/)**。
