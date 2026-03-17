# 变更日志

## v2.1.0 — Retro 修正 + GEP 本地进化 (2026-03-17)

### 修正（来自 /retro mirror-visitor ch1 测试）
- `/start` 短篇模式（≤5万字）：允许与 `/theme` 合并执行
- `/characters` 嫌疑人矩阵：新增极简模式（2-3人，适用于心理悬疑/短篇）
- `/audit` 公平性检查：按子类型过滤 Knox 十诫适用条目（心理悬疑不检查全部10条）
- `/check` 评分权重：按子类型加权（心理悬疑加重人物+文学，本格加重线索+逻辑）

### 新增
- `assets/gep/` — GEP 本地进化基础设施（genes.json, capsules.json, events.jsonl）
- 4 个 Gene 定义：methodology-gap-fix, benchmark-integrate, innovate-new-technique, autopsy-extract
- 2 个 Capsule 记录：retro 修正 + v2.0 研究整合
- `memory/` — 进化状态和 session 信号文件
- EvoMap 节点已注册（node_2f9e46c279dc3f87）

---

## v2.0.0 — 全网研究整合 (2026-03-17)

基于 30+ 学术论文、42 个开源项目、15+ 专业编剧方法论的系统性升级。

### 新增
- `knowledge-state.md` — 知识状态追踪系统（Dynamic Epistemic Logic + 竞争叙事 + 反派引擎 + 双读者验证）
- `advanced-if.md` — 高级互动叙事设计（Accept/Reject/Deflect + QBN + 垂直钻探 + Storylet系统）
- `meta/benchmark-2026-03-research.md` — 全网研究综合报告

### 重大方法论升级
- **对抗式悬念设计**（Xie & Riedl, EACL 2024）：系统化"逼角"法，迭代摧毁主角的逃脱计划
- **Yes-but/No-and 调查场景**（Brandon Sanderson）：每个调查行动必须成功带并发症或失败加恶化
- **MICE 嵌套结构**（Sanderson）：故事线程像括号一样嵌套关闭
- **反主题架构**（Craig Mazin）：第二幕先强化错误信念再瓦解
- **角色罗盘**（David Corbett）：Lack/Yearning/Resistance/Desire 四维动机
- **伪盟友对手**（John Truby）：嫌疑人矩阵必须含"看似盟友实为对手"
- **反派引擎法**（James Frey）：反派计划 IS 情节骨架
- **竞争叙事**（John Truby）：侦探与凶手争夺"哪个版本是真相"
- **空间谜题设计**（绫辻行人/新本格）：建筑即诡计
- **双读者公平性模型**（Wagner et al. 2025）：天真读者(惊奇) + 侦探读者(原来如此)

### 新增方法论来源
James Frey, John Truby, Craig Mazin, David Corbett, Brandon Sanderson, 岛田庄司, 绫辻行人, Sam Barlow, Failbetter Games, Xie & Riedl, Wagner et al., Eger

---

## v1.2.0 — 自我进化系统 (2026-03-17)

### 新增
- `meta/SKILL.md` — 自我进化框架（三环进化模型）
- 6 个进化命令：`/retro`、`/evolve`、`/benchmark`、`/autopsy`、`/blindspot`、`/pulse`
- `meta/references/retrospective-method.md` — 复盘方法论
- `meta/references/evolution-patterns.md` — 进化模式（填充/修正/重构/蜕变）
- `meta/references/blind-spot-detection.md` — 认知盲区检测
- `meta/references/reverse-engineering.md` — 作品逆向工程方法
- `meta/references/benchmarking-protocol.md` — 外部方法论对标协议
- `meta/VERSION.md` — 版本追踪
- `meta/CHANGELOG.md` — 变更日志

## v1.1.0 — 重大迭代 (2026-03-17)

### 新增
- `/theme` 命令（Egri 前提法）
- `/revise` 命令（四种改稿模式）
- 倒叙推理、日常推理两个子类型
- `unreliable-narrator.md` — 不可靠叙述者系统
- `setting-atmosphere.md` — 场景与氛围设计
- `export-formats.md` — 导出格式规范（Twine/ink/ChoiceScript/JSON）
- `interactive-prose.md` — 互动叙事文本写作
- 公平性光谱（Fair Play Spectrum）

### 变更
- 工作流从固定顺序改为按子类型选择路线（诡计/角色/结构优先）
- 新增跨技能产物映射（thriller-writing → interactive-fiction）
- 新增 Egri、Booth、Highsmith 到方法论来源
- 子类型从 7 种扩展到 9 种

## v1.0.0 — 初始发布 (2026-03-17)

### 新增
- `thriller-writing/SKILL.md` — 悬疑剧本创作系统（9 个命令）
- `interactive-fiction/SKILL.md` — 互动悬疑小说系统（9 个命令）
- 8 份悬疑创作参考资料
- 5 份互动叙事参考资料
