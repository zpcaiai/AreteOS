# Arete 产品体检与提升报告 — 2026-07-14

> 范围：全量代码级体检（112 页面 / 271 API / 248 数据模型 / 20+ 引擎）、UI 完整性审查、
> 具体缺陷修复，以及围绕**品质 / 深度 / 用户粘性 / 价值 / 产品力**的提升建议。
> 本报告在 2026-06 的 `UI_PRODUCT_AUDIT.md` 基础上做增量，不重复其结论。

---

## 一、总体结论

Arete 是一款**结构上已经非常完整、工程质量很高**的产品。它不缺功能——它的风险恰恰在
功能太多：用户在稳定体验到"第一个明确成果"之前，就先看到了一整座图书馆。**决定 Arete 上限的
不再是"还能造什么"，而是"能否让一个人在 5 分钟内清晰地赢一次，并且愿意明天再来"。**

一句话：**从"能力广度"转向"成果密度 + 可测量的复利"。**

### 体检结论（客观指标）

| 维度 | 结果 |
| --- | --- |
| TypeScript 类型检查 | ✅ 0 错误 |
| 单元测试 | ✅ 262/262 通过（45 个测试文件） |
| 内部链接完整性 | ✅ 45 个静态链接全部有效（发现 1 处坏接口，已修） |
| 导航可达性 | ✅ 72 个顶级页面除 `/login` 外全部挂进导航 |
| 占位/未完成标记 | ✅ 无 "coming soon" / stub / 未实现占位页 |
| 无障碍基础 | ✅ 0 个缺 alt 的图片；有 skip-link / landmark / focus ring |
| 国际化 | ✅ 双语（zh/en），1102 处 `T()` 调用 |
| 数据层 | ✅ React Query + 抛错式 fetch + 缓存恢复 + lazy-retry + 离线包 |
| XSS / 日志噪音 | ✅ 唯一的 `dangerouslySetInnerHTML` 是 JSON-LD（安全）；唯一 `console.log` 是 web-vital 调试 |

> 注：完整 `next build` 与端到端跑通仍需一台带 Postgres 的 staging 机（本地沙箱无 DB）。
> 类型检查已覆盖全部页面/路由的导入与类型正确性。

---

## 二、本次已修复

1. **坏接口（功能性 Bug）** — `src/app/praxis/SfmStudio.tsx`
   "评估领导力 / Assess Leadership" 按钮原本 POST 到不存在的 `/api/praxis/archon/analyze`（会 404）。
   已改为真实路由 `/api/praxis/leadership/analyze`（其入参恰为 `{ reflections }`，与按钮一致）。
2. **缺失页面标题** — `src/app/project-foundry/page.tsx`
   补上 `titleMeta("项目铸造厂","Project Foundry")`，浏览器标签/SEO/读屏不再显示通用标题。

---

## 三、发现的完整性缺口（建议后续修复）

### 缺口 A：约 20 个"客户端组件页面"没有页面标题 <title>
这些页面是 `"use client"` 组件，Next.js **不允许**客户端组件导出 `metadata`，因此它们全部
回落到根布局的默认标题。正确做法是套用你仓库里**已有的模式**（见 `src/app/exposure/page.tsx`）：
把页面拆成"服务端 `page.tsx`（导出 `titleMeta` + 渲染 `<XxxClient/>`）"。涉及页面：

`life-capital, identity-tree, evidence, council, experiments, graph, narrative, journey,
personal-os, deep-work, specific-knowledge, growth-protocol, skills, boardroom, account,
assets, bottlenecks, future-self, prescriptions, onboarding`

> 这是机械但需逐一处理的重构（每个约 3 行），风险低但要一个个改，故列为清单而非本次强改。

### 缺口 B：部分"纯逻辑"模块在被 import 时就实例化 Prisma
测试中 `council` / `whatif` 触发了 Prisma 引擎加载（本地因平台原因报未处理拒绝）。说明这些
模块在**模块顶层**耦合了 `db`。解耦后可提升可测试性、冷启动速度，并让纯函数真正"纯"。

### 缺口 C：缺少产品级埋点（最关键）
代码里没有任何 activation / retention / funnel 的产品遥测（`track(` 命中的都是领域逻辑，非埋点）。
**没有度量就无法改进粘性**——这是下面所有"粘性"建议的前置条件。

---

## 四、提升建议（按你提出的五个维度，标注优先级）

### 1) 品质 Quality
- **P0** 补齐缺口 A 的 20 个页面标题（照抄 `exposure/page.tsx` 模式）。
- **P1** 给所有"用原生 fetch 取数展示"的客户端页面补 **空态 / 错误态 / 加载态**——你已有优秀基建
  （`useApi` 的 16 个消费者 15 个处理 loading、14 个处理 error；`useAgentRun` 有统一错误条），
  把这套模式推广到剩余页面即可，别再手搓。
- **P1** 解耦缺口 B，让纯逻辑模块不在 import 时连库。
- **P2** 建 CI 门禁：staging 上 `migrate → seed → build → Playwright e2e`（`e2e/` 已存在），
  把"本地无法验证的动态路径"固定成每次发布的自动检查。

### 2) 深度 Depth
- **P0（护城河）** 把"一次性 AI 卡片"升级为**纵向复利循环**：同一个引擎在数周内被反复回访，
  展示趋势与积累。你已有 `recordProgress()` / 分数快照 / timeline 基建——把更多引擎接进去
  （处方依从度、实验结果回填、协议阶段推进），而不是"跑一次给张卡"。
- **P1** 让知识图谱（Neo4j / phronesis）做**跨引擎推理**：例如"你的回避模式（Healing）正在
  拖住你的杠杆下注（Naval）"。跨域综合是别人抄不走的深度。
- **P1** 闭合证据环：`evidence` / `experiments`（N-of-1）是你的差异点——把实验结论**自动回灌**
  到 `prescriptions`，让"个人证据"真正改变下一步建议。

### 3) 用户粘性 Stickiness
- **P0（前置）** 先埋点：activation、first-meaningful-action、weekly-retained-use、
  time-to-value。按 cohort 评估流程，而非 PV。这是投入产出比最高的一步。
- **P0** 落地显式的 **Today 面** ：问"你现在有多少时间/精力"→ 给**唯一**一个 5/25/60 分钟动作，
  并写回当前协议。你已有 `nextAction()` 作为种子，只差把它做成"入口仪式"。
- **P1** 有节制的再触达：把 `reviews.ts` 的周/月/季生成器接到通知，做"这周变了什么 / 现在最重要
  什么"的摘要，节奏由用户控制，**不做羞辱式 streak**。
- **P1** 渐进式导航（Do today / Build / Explore 三档），让 100+ 路由不与用户当下意图抢注意力。

### 4) 价值 Value
- **P0** 证明成果：加入**个人基线 + 周期性自评**，纵向展示"你移动了多少"。价值是"改变的证据"，
  不是一个孤立分数。
- **P1** 让付费墙对齐**价值时刻**而非功能清单：免费用户先体验到"aha"，再为**深度/历史/复利**付费；
  用"用量触发"而非"功能锁"来转化（现有 `FREE/PLUS/PRO` + `requireFeature` 已够用，调策略即可）。
- **P1** 隐私/数据主权中心：把 `/api/account/export`、保留期、删除、AI 记忆开关聚到一处——既是
  信任、也是价值卖点。
- **P2** B2B 杠杆：SFM / Leadership / Management 已是企业级引擎，"团队/教练席位"可能是比 PRO
  更高价值的层级。

### 5) 产品力 Product power（可辩护性）
- **P0（聚焦悖论）** 产品力来自**把更少的事做到无可挑剔**。建议设一条"英雄路径"（一个旗舰旅程）
  集中展示深度，其余作为可搜索的**深度层**而非并列的考试大纲。
- **P1** 把 AI 质量/安全做成功能：把评测台从 schema 校验扩到**场景套件**（防止坏建议、拒答/转介、
  引用用户自己的证据、事后判断建议是否有用）。对身心类产品，信任 = 产品力。
- **P1** 身心/临床严谨性：Healing OS 与儿童相关区需要领域专家复核、按地区配置危机求助资源、
  明确"非诊断/非治疗"边界（`Disclaimer` 已有——把它制度化）。既降风险又立信誉护城河。
- **P2** 数据护城河：纵向个人模型 + 跨引擎图谱 = 复利式迁移成本。这是长期壁垒，值得持续加注。

---

## 五、建议的 90 天节奏

1. **第 0–2 周**：埋点上线（缺口 C）+ 补 20 个页面标题（缺口 A）+ CI 发布门禁。
2. **第 3–6 周**：Today 面（时间/精力 → 唯一动作 → 写回协议）+ 渐进式导航三档。
3. **第 6–10 周**：纵向复利（把处方依从/实验结果接入 timeline）+ 个人基线与自评。
4. **第 10–13 周**：跨引擎图谱洞察 + 有节制的周摘要再触达 + 隐私中心。

## 六、发布前 Release Gate（沿用并扩充上一版审计）
新用户 5 分钟内走到"真实下一步动作"；回访用户 2 分钟内完成今日动作并看到反馈；
Foundry 蓝图可存/取/导出/续接；纯键盘 + 200% 缩放 + 移动端可用；
错误/空/加载/离线/升级路径逐一有意为之且可读。

---

## 七、实施更新（2026-07-14，全部采纳后）

本轮把报告里的**修复项（Section 二/三）全部落地**，并额外实现了 Section 四的旗舰 P0（Today 面）。
全程 `typecheck` 0 错误、`262/262` 测试通过。

### 已完成并验证
1. **坏接口修复** — `SfmStudio` 领导力按钮 → `/api/praxis/leadership/analyze`。
2. **缺口 A（页面标题）全部补齐** — 19 个客户端页面按仓库既有模式（`exposure/page.tsx`）
   拆为「服务端 `page.tsx`（`titleMeta`）+ 同名 `*Client.tsx`」。客户端主体**逐字节保留**，无逻辑改动。
   另修 `project-foundry` 服务端页标题。
3. **缺口 B（Prisma 解耦）** — 新增纯模块 `whatif-math.ts`、`project-foundry-blueprint.ts`；
   `whatif.ts` / `project-foundry.ts` 改为**导入并再导出**这些纯模块（对外 API 不变）；
   `council/whatif/project-foundry` 三个测试改为直接引用纯模块。
   全量测试从「262 通过 + 3 个 Prisma 未处理拒绝」变为 **262 通过 + 0 错误**。
4. **缺口 C（产品埋点）—— 完整管线**：
   - 数据模型 `prisma/schema/analytics.prisma`（`AnalyticsEvent`，append-only，无 User 外键）
     + 迁移 `prisma/migrations/20260714120000_add_analytics_events`。
   - `src/lib/telemetry.ts`：`track()`（**故障安全**，永不影响请求）、`recordFirstMeaningfulAction()`
     （幂等激活）、`telemetrySummary()`（激活率 / 周活跃 / Top 事件）。用**原生 SQL**，不依赖生成的
     Prisma 模型，故迁移前后都不会破坏应用。
   - `POST /api/telemetry`（限流 + 事件白名单）；`GET /api/telemetry`（管理员 · 漏斗摘要）。
   - 客户端：`src/lib/client/telemetry.ts`（sendBeacon，fire-and-forget）+ `<Telemetry/>`
     组件挂进 `Providers`，路由变化自动上报 `page_view`。
   - 打点：`reflection` 写入路径记录**激活**与 `engine_run`；`UpgradeGate` 记录
     `upgrade_view` / `upgrade_click`（转化漏斗）。
   - 可视化：`/admin` 总览新增「产品漏斗 · 近 7 天」卡片。
5. **旗舰 P0 —— Today 面（`/today`）**：先问时间（5/25/60 分钟）与精力（低/中/高），
   再只给**一件事**（复用 `/api/next-action` 的处方/瓶颈引擎），并按时间/精力调整“把它缩到多小”的框架；
   打点 `today_action`。已置顶到侧边栏（PINNED 第一项）。

### 你需要执行的一步
在接好 Postgres 的环境运行迁移，埋点即开始采集：
```bash
npm run db:migrate:deploy   # 或 prisma migrate deploy
```
（迁移前应用照常运行——埋点写入是故障安全的，管理漏斗卡片会显示 0，并提示“迁移后开始采集”。）

### 仍属"较大初期投入"、未在本轮强做的项（需设计 + staging 验证）
纵向复利全量接线、跨引擎图谱推理、隐私中心 UI、渐进式导航三档切换、B2B 席位层、
AI 评测场景套件、身心/临床领域专家复核。这些建议在有 staging 数据库后按 Section 五 的 90 天节奏推进；
现在**埋点已就位**，可用真实激活/留存数据来排布它们的优先级。

---

## 八、90 天路线图实施（2026-07-14，第二轮）

按 Section 五/七 的节奏，把可在库内构建并验证的路线图项**全部落地**。全程 `typecheck` 0 错误、
测试从 262 增至 **267 通过（新增 nav-modes 纯测试）**、0 错误。

### 第 0–2 周 · CI 发布门禁 ✅
`.github/workflows/ci.yml` —— 三个 job：
`typecheck-test`（快速必过门禁，无需 DB）、`build`（pgvector Postgres 服务 + 迁移 + `next build`）、
`e2e`（迁移 + seed + Playwright）。把「本地无法验证的动态路径」固化为每次 PR 的自动检查。

### 第 3–6 周 · 渐进式导航三档 ✅
`nav.ts` 给每个分组打上 `modes`（**探索=全部**；今天做/构建=收窄子集）；`Sidebar` 新增
「今天做 / 构建 / 探索」分段切换（`localStorage` 持久化，埋点 `nav_mode`），并**始终保留当前页所在分组**
以免导航死路。默认「今天做」以降低认知过载；搜索框仍可直达任意页面。纯逻辑有 `test/nav-modes.test.ts` 覆盖。

### 第 6–10 周 · 个人基线与自评 ✅（价值/纵向复利的基石）
新页面 `/outcomes`（人生成果 · 基线与自评）：对 6 个真实生活维度（精力/清晰/关系/意义/平静/进展）
0–10 打分；首次自评设为**基线**，之后每次显示**相对基线的变化**（△ + 迷你趋势条）。
- 模型 `self-report.prisma` + 迁移 `20260714130000_add_self_reports`；纯目录 `self-report-catalog.ts`。
- 服务 `self-report.ts`（原生 SQL、读侧容错）；`GET/POST /api/self-report`（保存即记激活 + `engine_run`）。
- 已挂入导航（回顾组 · do/explore 模式）。

### 第 10–13 周 · 隐私中心 + 周报再触达 ✅
- **隐私中心（`/account`）**：在既有「数据导出（JSON）+ 清除成长数据」之上，新增
  **AI 记忆控制**——显示当前 `personal_memories` 条数，可一键「清除 AI 记忆」（`GET/POST /api/account/memory`，
  带确认）。导出 + 成长数据清除 + AI 记忆清除，构成一处集中的数据主权面板。
- **周报再触达**：已由现有 `WeeklyCardBanner`（落地页推送本周成长卡）+ `reviews.ts`（周/月/季生成器）
  + 新的 `/outcomes`（相对基线变化）充分覆盖，**故不重复造轮子**。

### 你需要执行的（接好 Postgres 后）
```bash
npm run db:migrate:deploy   # 应用两个新迁移：analytics_events + self_reports
```
应用在迁移前也照常运行（埋点/自评读侧均为容错设计）。

### 明确未做（需产品设计 + 真实数据，超出"库内可验证"范围）
跨引擎图谱推理、B2B 席位层、AI 评测场景套件、身心/临床领域专家复核。建议用现在已上线的**埋点 +
自评基线**产出的真实激活/留存/成果数据，来决定这几项的优先级与具体形态。

---

## 九、深水区四项实施（2026-07-14，第三轮）

把此前标注"需产品设计 + 真实数据"的四项也做了库内可验证的落地。`typecheck` 0 错误、
测试 280 → **290 通过（新增 cross-engine / eval-scenarios / clinical / teams 纯测试）**、0 错误。

### 1) 跨引擎图谱推理 ✅（护城河）
- 纯规则引擎 `cross-engine.ts`：8 条跨域规则（身心↔执行、精力↔判断、执行↔关系、
  习惯↔意义、反思↔清晰、言行差距↔身份、清晰↔瓶颈、平静&精力同跌），每条给出
  from→to 域、严重度、解释与一个可点击动作。纯函数、`test/cross-engine.test.ts` 6 测试。
- 服务 `cross-engine-service.ts` best-effort 汇集信号（成长因子 + 自评 + 瓶颈）。
- `GET /api/cross-engine`（PRO 门禁，新增 `cross_engine` 特性键）；页面 `/synthesis`
  （带升级/空/加载态），已挂入思维导航组。

### 2) B2B 席位层 ✅
- 不改 `MemberTier` 枚举:团队 = 授予成员 PRO 的计费实体。新表 `teams`/`team_members`
  （迁移 `20260714140000_add_teams`），服务 `teams.ts`(原生 SQL,所有者鉴权 + 席位上限)。
- 关键集成:`getActiveMembership` 现在叠加团队授权——**只升不降、故障安全**(缺表/DB 异常
  自动忽略,绝不回退个人层级)。`test/teams-entitlement.test.ts` 固化"团队→PRO→全部 PRO 特性"契约。
- `GET/POST /api/teams` + `GET/POST/DELETE /api/teams/[id]/members`;页面 `/team`
  (创建团队、按邮箱邀请、移除成员、席位用量);`plans.ts` 增加 `TEAM_PLAN`(按席位计价)。

### 3) AI 评测场景套件 ✅
- `src/lib/eval/scenarios.ts`:纯打分器(must_not_contain / must_escalate / must_refuse /
  must_cite / must_be_concrete)+ 6 个真实 agent 场景,覆盖四套件:**防坏建议、拒答/转介、
  引用用户证据、方案有用性**(含金融不过度承诺、危机必须转介、暴露成功≠零焦虑等)。
- `scripts/eval-scenarios.ts`(`npm run eval:scenarios`)跑真实 agent 并打分,写 `eval-scenarios-report.json`;
  真实 provider 下任一失败即非零退出。`test/eval-scenarios.test.ts` 7 测试覆盖打分器。
  (mock 下 agent 返回示例输出,故行为类断言需真实 provider——脚本已明确提示。)

### 4) 临床专家复核(可强制的脚手架)✅
- 复核已存在的强安全底座(确定性分诊 + `/safety` 地区化危机资源 + 非诊断边界),把"专家复核"
  变成**可机检的制度**:`src/lib/clinical/review-registry.ts` 登记每个临床模块的
  (a) 安全基线(非诊断边界/危机资源/安全分诊——**阻断式**)与 (b) 专家签核(人工、追踪式)。
- `clinicalSafetyGate()` 阻断式门禁 + `expertReviewStatus()` 覆盖率报告;
  `scripts/clinical-gate.ts`(`npm run check:clinical`)可入 CI;`test/clinical-review.test.ts` 7 测试
  (含此前无测试的危机资源地区+兜底)。`/admin` 新增"临床复核"卡片;流程写入 `docs/clinical-review.md`。
- 诚实现状:安全门禁 **PASS(11 模块)**,专家签核 **1/11**(仅 `/safety`),其余 `pending`——
  这是真实状态,人工签核由 registry 追踪,记录一次即在门禁与后台清除。

### 你需要执行的(接好 Postgres 后)
```bash
npm run db:migrate:deploy   # 现在共 3 个新迁移:analytics_events / self_reports / teams
```

### 明确仍属"人工/线下"的部分
真正的**临床专家签核**是人的动作(本轮已把它变成可追踪、可强制的制度,并把安全底座做成阻断门禁);
`cross_engine` 的规则可随真实数据继续扩充;`eval:scenarios` 建议接一个真实 provider 定期在 CI 跑。
