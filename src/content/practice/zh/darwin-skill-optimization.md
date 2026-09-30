---
title: "用 darwin-skill 优化收尾总编 Skill"
lang: zh
summary: "把一个「能用」的编排型 Skill，用 8 维评分卡 + 棘轮机制迭代到「出版级」。核心是：优化前先建客观基线，改版只留升分、降分一律回滚。"
project_category: "工具链开发"
project_category_en: "Toolchain Development"
work_type: "Skill开发"
date: "2026-08-06"
tags: ["Skill开发", "darwin-skill", "编排设计", "经验沉淀"]
has_diagrams: true
order: 3
status: "published"
draft: false
---

「收尾总编 Skill」是我知识库收官流程的总控编排器——项目做完之后，它负责把散落的产出收敛成四类资产。它一开始只有三件套，能跑，但我心里清楚它不够扎实。这篇文章记录的，是我怎么把它从「能用」推到「出版级」的。

关键不是「改了哪些地方」，而是**先建立客观基线，再用棘轮机制锁住不退步**。这套方法后来被我复用到多个 Skill 的优化上。

## 一、背景：三件套漏掉了最关键的一环

原始 Skill 的编排范式是三件套：经验沉淀 → 术语抽取 → 科普生成。跑起来没问题，但每次收尾之后，我总要手动补一件事——**写产品文档**。

问题就出在这里。术语是「内部沉淀」，文档是「对外交付物」。当编排顺序是「先抽术语、后补文档」时，术语表里会大量引用还没定稿的概念。等文档终于写完，术语表已经悬空了。

临界点出现在一次项目收尾：术语表里 40 多条条目引用的模块名，和最终 PRD 里的命名对不上。返工比重做还累。

<div class="callout callout-warning">
<p class="callout-title">问题的本质</p>
<p>不是「忘了写文档」，而是<strong>编排时序错了</strong>。文档阶段没有位置，就只能靠人兜底；靠人兜底的事，一定会漏。</p>
</div>

## 二、关键决策：为什么先建评分卡，而不是直接改

第一个决策，也是整件事的分水岭：**用 darwin-skill 的 8 维评分卡做客观基线，而不是凭感觉改。**

理由很朴素——主观改版最大的风险是自满。你改完觉得「顺眼多了」，但根本不知道差在哪、好了多少、有没有在某个维度上偷偷退步。

评分卡把这个过程变可量化了：先评基线，看清短板分布；再针对性改版；然后重评，**只 keep 升分的改动，降分的一律 revert**。这条规则叫棘轮（ratchet），它保证整个过程单调不退化。

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 236" width="100%" role="img" aria-labelledby="ratchet-title ratchet-desc" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="ratchet-title">darwin-skill 棘轮迭代流程</title>
  <desc id="ratchet-desc">从基线评分 64.7 出发，经一轮改版提升至 92.7，通过棘轮判定后保留改动并达标。</desc>
  <defs>
    <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <g>
    <rect x="24" y="52" width="140" height="88" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="94" y="82" font-size="12.5" fill="#86868b" text-anchor="middle" dominant-baseline="central">基线评估</text>
    <text x="94" y="110" font-size="26" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">64.7</text>
  </g>

  <line x1="164" y1="96" x2="196" y2="96" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar)"/>

  <g>
    <rect x="196" y="52" width="140" height="88" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="266" y="82" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">Round 1 改版</text>
    <text x="266" y="110" font-size="26" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">92.7</text>
  </g>

  <line x1="336" y1="96" x2="368" y2="96" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar)"/>

  <g>
    <rect x="368" y="60" width="128" height="72" rx="10" fill="#fff8e6" stroke="#c98f00" stroke-width="0.5"/>
    <text x="432" y="86" font-size="12.5" fill="#96690a" text-anchor="middle" dominant-baseline="central">棘轮判定</text>
    <text x="432" y="108" font-size="12.5" fill="#96690a" text-anchor="middle" dominant-baseline="central">比基线升分？</text>
  </g>

  <line x1="496" y1="80" x2="524" y2="62" stroke="#2f8f5b" stroke-width="1.5" marker-end="url(#ar)"/>
  <text x="536" y="58" font-size="12.5" fill="#2f8f5b" text-anchor="start" dominant-baseline="central">是 → keep</text>

  <line x1="496" y1="112" x2="524" y2="130" stroke="#c0392b" stroke-width="1.5" marker-end="url(#ar)"/>
  <text x="536" y="134" font-size="12.5" fill="#c0392b" text-anchor="start" dominant-baseline="central">否 → revert</text>

  <rect x="24" y="176" width="632" height="44" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
  <text x="340" y="190" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">keep 条件：评分上升</text>
  <text x="340" y="208" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">且体积不超过原版的 150%</text>
</svg>
</div>

基线 64.7 的短板分布很集中：编排时序缺失、环境约束没固化、人工闸门没显式列出。改版方向因此变得明确，而不是「感觉哪里不对」。

## 三、决策 2：三件套升级为四件套

有了基线指明方向，第二个决策是范式升级——**在 B 位插入「产品文档」阶段，形成 A→B→C→D 四件套**。

文档必须先于术语。这不是经验之谈，是有明确因果的时序依赖：文档定义概念，术语解释概念。上游没定稿，下游必然悬空。

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 300" width="100%" role="img" aria-labelledby="pipeline-title pipeline-desc" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="pipeline-title">收尾编排范式的三件套到四件套演进</title>
  <desc id="pipeline-desc">优化前是经验沉淀、术语抽取、科普生成三阶段；优化后在经验沉淀之后插入产品文档阶段，形成四阶段编排。</desc>
  <defs>
    <marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <text x="24" y="26" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">优化前 · 三件套</text>

  <g>
    <rect x="24" y="46" width="150" height="60" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="99" y="68" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">阶段 A</text>
    <text x="99" y="88" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">经验沉淀</text>
  </g>
  <line x1="174" y1="76" x2="206" y2="76" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="206" y="46" width="150" height="60" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="281" y="68" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">阶段 C</text>
    <text x="281" y="88" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">术语 + 人工闸门</text>
  </g>
  <line x1="356" y1="76" x2="388" y2="76" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="388" y="46" width="150" height="60" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="463" y="68" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">阶段 D</text>
    <text x="463" y="88" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">科普生成</text>
  </g>

  <line x1="24" y1="126" x2="656" y2="126" stroke="#d2d2d7" stroke-width="0.5" stroke-dasharray="4 4"/>
  <text x="340" y="126" font-size="12" fill="#86868b" text-anchor="middle" dominant-baseline="central" style="background:#fff;">缺文档阶段，术语引用未定稿概念 → 悬空</text>

  <text x="24" y="156" font-size="13" font-weight="500" fill="#0071e3" text-anchor="start" dominant-baseline="central">优化后 · 四件套</text>

  <g>
    <rect x="24" y="176" width="144" height="60" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="96" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">阶段 A</text>
    <text x="96" y="218" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">经验沉淀</text>
  </g>
  <line x1="168" y1="206" x2="192" y2="206" stroke="#0071e3" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="192" y="176" width="144" height="60" rx="10" fill="#fff8e6" stroke="#c98f00" stroke-width="0.5"/>
    <text x="264" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">阶段 B · 新增</text>
    <text x="264" y="218" font-size="12.5" fill="#96690a" text-anchor="middle" dominant-baseline="central">产品文档</text>
  </g>
  <line x1="336" y1="206" x2="360" y2="206" stroke="#0071e3" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="360" y="176" width="144" height="60" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="432" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">阶段 C</text>
    <text x="432" y="218" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">术语 + 人工闸门</text>
  </g>
  <line x1="504" y1="206" x2="528" y2="206" stroke="#0071e3" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="528" y="176" width="128" height="60" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="592" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">阶段 D</text>
    <text x="592" y="218" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">科普生成</text>
  </g>

  <text x="24" y="264" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">文档定义概念 → 术语解释概念；上游定稿，下游才不悬空。</text>
  <text x="24" y="284" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">新增阶段 B 后，40+ 条术语条目全部落在已定稿的命名上。</text>
</svg>
</div>

### 阶段 B 的模板固化

光有阶段位置还不够，模板不固化，每次收尾结构都会漂移。「模板化」的隐含要求是：结构自己长出来。

**PRD — 七节**

1. 产品定位
2. 目标人群
3. 系统架构
4. 模块与字段
5. 非功能铁律
6. 设计范式
7. 验收标准

**Roadmap — 四节**

| 节 | 内容 | 关键约束 |
|---|---|---|
| 里程碑 | 分阶段目标与交付物 | 每项必须可验收 |
| 状态 | 当前进展快照 | 与代码仓库同步 |
| Backlog | P0 / P1 / P2 分级 | P0 必须写明阻塞原因 |
| 风险 | 已识别风险与应对 | 每项要有责任人与触发条件 |

**MOC — 四段式**

概述 → 核心文档 → 关联经验 → 关联术语科普，并**挂接到 `生成工作/MOC.md` 的上级索引**。这一步不能省——项目 MOC 不挂上级索引，就是一个孤岛，Dataview 汇总时拿不到它。

## 四、决策 3：把沙箱踩过的坑写进 Skill

第三个决策最不起眼，但收益最直接：**把本机环境的实测坑固化成「环境约束表」**。

不固化的后果是每次重蹈。这些坑我已经踩过不止一次：

| 现象 | 根因 | 应对 |
|---|---|---|
| 目录删不掉，反复 `rm` 无效 | safe-delete 沙箱拦截，回收站不可用，fail-closed | 不硬删，`mv` 重命名为 `_stale_` 前缀隔离 |
| 科普脚本建目录失败，术语全盘悬空 | 维度标题含 `/`（如「Apple 设计 / 动效」），脚本把它当路径分隔符 | 标题禁用 `/`，改连写或「与」 |
| 索引页手工维护必漏 | 条目增长后人工汇总不可靠 | OPA MOC 用 Dataview 自动汇总 `type: opa-entry`，不手改 |

第二行那个坑尤其典型——`/` 在文件名里是合法的，在路径语义里是分隔符。脚本按路径解析时，一个看起来很正常的标题就把整个目录树建歪了。

## 五、决策 4：人工闸门的显式化

第四个决策：**加检查点清单，把「必须人确认的点」显式写进编排**。

编排类 Skill 自主跑的时候，最容易出的问题不是能力不足，是**跳过该停下来问人的地方**。所以闸门不能靠「记得」：

- **阶段 0** — 状态判定（项目到底完没完）
- **阶段 A** — 分类确认（这份经验属于哪个项目类别）
- **阶段 B** — 文档验收（PRD/Roadmap/MOC 是否达标）
- **阶段 C Step 4** — 人工闸门（术语入库前必须过）
- **阶段 D Step 5** — 抽检（科普产出抽样核对）

<div class="callout callout-tip">
<p class="callout-title">闸门的设计原则</p>
<p>闸门要写在<strong>流程的必经路径</strong>上，而不是写在附注里。写在附注里的规则，等于没有规则。</p>
</div>

## 六、实施过程与遇到的三类问题

实施链路：加载 darwin-skill → 读取 `SKILL.md` 与 `references/subskill-contracts.md` → 备份 `SKILL.md.bak` → 基线评估（64.7）→ 改版升四件套 → Round 1 重评（92.7）→ 棘轮 keep。

三类问题，各有对策：

| # | 问题 | 对策 | 结果 |
|---|---|---|---|
| 1 | 术语表维度标题含 `/` 导致建目录失败 | 标题禁用 `/`，改连写或「与」 | 建目录恢复正常 |
| 2 | safe-delete 拦截，残留目录删不掉 | 改用 `mv` 重命名为 `_stale_` 前缀 | 隔离成功，不再卡死 |
| 3 | 改版可能体积膨胀、稀释可读性 | 设 150% 体积红线作为 keep 条件之一 | 11,473 字节 < 红线 11,553 |

第三个问题的对策值得展开。**评分卡只管质量，不管成本**——如果只看分数，Skill 会越改越臃肿，最后可读性反而下降。所以我在 keep 条件里加了体积红线：最终 11,473 字节落在红线 11,553 之内，达标且没膨胀。

## 七、结果

| 指标 | 优化前 | 优化后 |
|---|---|---|
| 编排范式 | 三件套 A→C→D | 四件套 A→B→C→D |
| darwin-skill 评分 | 64.7 | **92.7**（≥90 达标） |
| 环境约束固化 | 无 | 3 条实测坑写入 Skill |
| 人工闸门 | 隐含 | 5 个检查点显式列出 |
| 体积 | 11,473 字节 | 11,473 字节（红线 11,553） |

产出物三件：`收尾总编skill/SKILL.md`（v2）、`test-prompts.json`（4 条用例）、`results.tsv`（优化轨迹）。

## 八、可复用的四条结论

<div class="callout callout-tip">
<p class="callout-title">沉淀下来的方法论</p>
<p>1. <strong>Skill 优化先建客观评分卡 + 棘轮</strong>，比凭感觉改更可控、可复现、不退步。</p>
<p>2. <strong>编排类 Skill 必须把「子 Skill 调用时序 + 人工闸门 + 落点映射」写死</strong>，否则自主跑时必漏环节。</p>
<p>3. <strong>文档先于术语</strong>（A→B→C→D 时序）：文档是外部交付物，术语是内部沉淀，上游定稿下游才不悬空。</p>
<p>4. <strong>沙箱坑必须固化进环境约束表</strong>，否则每次重蹈。</p>
</div>

<div class="callout callout-warning">
<p class="callout-title">四个踩坑预警</p>
<p>术语表维度标题用 <code>/</code> → 建目录失败，全盘悬空。</p>
<p>反复 <code>rm</code> 被拦截的残留目录 → fail-closed 卡死；改用 <code>mv</code> 隔离。</p>
<p>跳过阶段 C 人工闸门直接写术语 → 噪声污染术语表。</p>
<p>优化只看分数不看体积 → 膨胀稀释可读性；必须加体积红线兜底。</p>
</div>

第 4 条尤其值得强调。棘轮保证的是「不退步」，但「不膨胀」是另一条独立的约束——两者要同时成立，Skill 才能长期维持在一个健康的状态上。
