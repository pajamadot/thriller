# 变更日志

## v5.0.0 — 分镜100轮进化完成 (2026-03-20)

### 100轮进化结果: 4,800行 → 17,576行

| 指标 | 进化前 | 进化后 |
|------|--------|--------|
| 总行数 | 4,800 | 17,576 |
| 参考文件 | 9 | 17 |
| Idiom FSM | 6 | 18 |
| 认知科学源 | 2 | 10+ |
| 质量指标 | 6 | 12 |
| 类型库 | 0 | 6 |
| 导演解剖 | 0 | 10+ |
| 提示词模板 | 0 | 5 |
| 视觉隐喻 | 0 | 28 |
| 跨模块桥 | 概念级 | 3个完整映射 |

### 10个Band完成
- Band 1 (r001-r010): 镜头逻辑基础 — 形式化谓词, 多通道DAG, 第4切理由
- Band 2 (r011-r020): Idiom扩展 — 18个FSM, 决策树, 复合记法
- Band 3 (r021-r030): 认知深化 — cognitive-perception.md(1522行, 10+源)
- Band 4 (r031-r040): 节奏精化 — 时长函数D(), 时间记号, 组合代数
- Band 5 (r041-r050): 空间智能 — visual-metaphor.md(28条M01-M28), 色温/景深规则
- Band 6 (r051-r060): LLM优化 — prompt-templates.md(5模板), 输出验证器, 上下文预算
- Band 7 (r061-r070): 类型库 — genre-libraries.md(6类型+混合规则+检测启发)
- Band 8 (r071-r080): 跨模块集成 — integration-maps.md(3座桥, 10+字段映射)
- Band 9 (r081-r090): 导演解剖 — technique-library.md(10+解剖, 技法提取)
- Band 10 (r091-r100): 验证与编纂 — 最终v5.0规格锁定

### 新增6个参考文件
- `cognitive-perception.md` — 认知知觉规则(注意力/认知负荷/情感启动/凝视预测/Kuleshov)
- `visual-metaphor.md` — 视觉隐喻词典(28个编号条目M01-M28)
- `prompt-templates.md` — LLM提示词模板(5个完整可用模板+输出验证器)
- `genre-libraries.md` — 类型镜头库(6类型+Delta Overlay+混合规则)
- `integration-maps.md` — 跨模块集成映射(3座桥+端到端管线)
- `technique-library.md` — 导演技法库(10+部电影解剖+参数化技法)

### 重大技术演进
- **Duration Function**: D(shot) = D_base(size) × G(gravity) × B(beat_type) × S(style)
- **Rhythm Composition Algebra**: CONCAT, NEST, INVERT, SCALE, ACCENT, INTERLEAVE
- **Time Signatures**: 6种场景类型记号(4/4, 3/4, 6/8, free, var, rubato)
- **Cognitive Load Limits**: ECU≤2, CU≤3, MCU≤4, MS≤5, LS≤8 信息单元/镜头
- **Genre Delta Overlay**: primary(70%) + secondary(30%) 混合公式
- **12项可计算质量指标**: 原6项 + ASL + r(1) + D_MAE + phrase_CV + climax_align + cog_load

### GEP进化资产
- 新增Gene: gene_sb_100_round_loop
- 100轮进化事件记录到 events.jsonl
- 进化计划基础设施: storyboard/specs/storyboard-plan/ (manifest + 10 slots + 10 bands)
- 运行器脚本: scripts/lib/storyboard-plan.js + scripts/record-storyboard-evomap.js

---

## v4.0.0 — 分镜拆解模块 (2026-03-20)

### 新增模块：`storyboard/`（10文件，4600+行）
- `SKILL.md` — 10个命令, 5层元认知框架, 8步分解算法
- `QUICKREF.md` — 速查卡
- `references/shot-grammar.md` — 景别/角度/运动完全分类, 连贯性编辑规则
- `references/montage-theory.md` — Eisenstein五级蒙太奇, 转场完全手册, Murch优先级
- `references/visual-rhythm.md` — 镜头时长体系, 6种节奏模式, 张力弧线模板
- `references/composition-staging.md` — Katz A-I-L调度, Hall人际距离学, 深度分层, 色彩/光线叙事
- `references/shot-logic.md` — **核心创新**: 镜头逻辑系统(信息DAG, 6个Idiom FSM, 认知连贯性法则, 8种逻辑错误)
- `references/llm-guidance.md` — LLM执行指南(5个已知陷阱, 强制思维链, 5步自审计, 6项质量指标)
- `references/decomposition-algorithm.md` — 8步算法(含VERIFY逻辑验证门禁)
- `references/evaluation.md` — 六维度加权评分 + 导演解剖法
- `specs/sb-evomap.md` — EvoMap进化追踪规范

### 核心创新
- **镜头逻辑系统**: 每个切必须有因果理由(信息/反应/强调), 信息依赖图(DAG), 6种Film Idiom状态机
- **认知验证**: 基于 Magliano(2011) 事件分割 + Liao(2023) ERP scale asymmetry 的神经科学规则
- **LLM执行优化**: 基于 R²(2025), DSR(2025), Intelligent Cinematography Review(2024) 的分步生成策略
- **VERIFY门禁**: 8步算法中的关键步骤, 确保镜头序列具有因果逻辑而非仅"看起来专业"
- **6项可计算质量指标**: 信息效率, 切理由覆盖率, 依赖完整度, 节奏方差, Idiom覆盖率, 景别分布熵

### GEP 进化资产
- 4个新Gene: `gene_sb_shot_logic_system`, `gene_sb_llm_execution_guide`, `gene_sb_evaluation_scoring`, `gene_sb_cross_module_bridge`
- 1个Capsule: 模块创建记录
- 1个EvolutionEvent: v2创建事件

### 方法论来源新增(12个)
Eisenstein, Katz, Lumet, Murch, Bordwell, Hall, Kurosawa, StudioBinder, R²(2025), DSR(2025), Magliano(2011), Liao(2023)

---

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
