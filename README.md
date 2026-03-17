# Thriller — 悬疑小说创作与互动化技能包

> 面向 AI 辅助创作的专业悬疑/推理小说剧本创作系统
> 融合经典编剧方法论 + 互动叙事设计，从线性故事到分支体验

---

## 两个技能

### 1. 悬疑剧本创作 (`thriller-writing/`)

系统化的悬疑/推理小说创作流程，基于专业编剧方法论：

| 命令 | 功能 | 输出 |
|------|------|------|
| `/start` | 项目初始化（类型、篇幅、视角、诡计类型、风格、主题） | `.thriller-state.json` |
| `/theme` | 主题前提与立意（Egri 前提法） | `theme.md` |
| `/trick` | 核心谜团架构、线索布局、公平性验证 | `trick-design.md` |
| `/characters` | 角色系统（侦探、犯人、嫌疑人矩阵、受害者） | `characters.md` |
| `/structure` | 三幕结构适配、章节大纲、悬念管理 | `structure.md` |
| `/scene {N}` | 逐章创作（正文 + 线索追踪 + 嫌疑指向） | `chapters/ch{N}.md` |
| `/audit` | 线索一致性审查、Knox十诫检查 | 审查报告 |
| `/check {N}` | 六维质量评估（悬念/线索/characters/节奏/逻辑/文学） | 评分报告 |
| `/revise` | 四种改稿模式（结构/角色/线索/文字） | 修改方案 |
| `/reveal` | 真相揭示场景专项设计 | 揭示方案 |
| `/export` | 完整作品导出 | `export/` |

**支持 9 种悬疑子类型**：本格推理 · 社会派 · 心理悬疑 · 惊悚 · 密室 · 叙述诡计 · 犯罪程序 · 倒叙推理 · 日常推理

**三种工作流路线**：诡计优先（本格/密室） · 角色优先（社会派/心理） · 结构优先（惊悚/犯罪程序）

### 2. 互动悬疑小说 (`interactive-fiction/`)

将悬疑小说转化为带分支选择的互动叙事体验：

| 命令 | 功能 | 输出 |
|------|------|------|
| `/init` | 项目设置（来源、分支深度、结局数、平台） | `.interactive-state.json` |
| `/branches` | 叙事拓扑设计（5种模型选择） | `branch-map.md` |
| `/choices` | 每个决策点的选项设计与质量检查 | `choices/` |
| `/character-paths` | 角色命运矩阵、跨路径一致性 | `character-branches.md` |
| `/state` | 变量设计、条件逻辑、结局触发矩阵 | `state-system.md` |
| `/node {N}` | 逐节点创作（叙事 + 选择 + 状态变更） | `nodes/` |
| `/ending {N}` | 结局创作（触发条件 + 正文 + 重玩引导） | `endings/` |
| `/consistency` | 路径完整性、状态一致性、叙事连贯性审查 | 审查报告 |
| `/export {格式}` | 格式化导出（Twine/ink/ChoiceScript/JSON/Mermaid） | `export/` |

**5 种分支拓扑模型**：瓶颈型 · 平行调查型 · 时间循环型 · 信任网络型 · 自由探索型

**完整导出规范**：Twine (Harlowe/SugarCube) · ink · ChoiceScript · JSON Schema · Mermaid 流程图

---

## 方法论来源

| 来源 | 领域 | 在本系统中的应用 |
|------|------|------------------|
| Robert McKee《故事》 | 编剧理论 | 场景即价值转变的最小单位 |
| Syd Field《电影剧本写作基础》 | 结构理论 | 三幕结构、情节点 |
| Blake Snyder《救猫咪》 | 节拍理论 | 15节拍验证节奏 |
| Lajos Egri《戏剧写作的艺术》 | 角色/前提理论 | 主题前提系统、三维角色 |
| Alfred Hitchcock | 悬念理论 | 悬念vs惊吓、戏剧反讽 |
| Raymond Chandler | 硬汉派推理 | 场景动力学 |
| Agatha Christie | 古典推理 | 嫌疑人设计、叙述诡计 |
| 东野圭吾 | 社会派推理 | 情感驱动的真相、动机设计 |
| Wayne Booth《小说修辞学》 | 叙事理论 | 不可靠叙述者系统 |
| Patricia Highsmith | 犯罪心理 | 犯人视角的心理描写 |
| S.S. Van Dine | 推理规则 | 线索公平性二十则 |
| Ronald A. Knox | 推理规则 | 推理十诫 |
| Jon Ingold (inkle) | 互动叙事 | 涟漪理论、选择设计 |
| Emily Short | 互动叙事 | 分支架构理论 |
| Janet Murray《Hamlet on the Holodeck》| 数字叙事 | 读者代入感理论 |
| James Frey《How to Write a Damn Good Thriller》| 惊悚编剧 | 反派引擎法（villain-as-plot-engine） |
| John Truby《The Anatomy of Story》| 22步结构 | 竞争叙事、伪盟友对手 |
| Craig Mazin (Scriptnotes) | 主题理论 | 反主题架构（anti-theme） |
| David Corbett《The Compass of Character》| 角色理论 | 四维动机罗盘 |
| Brandon Sanderson (Writing Excuses) | 叙事技术 | MICE嵌套、Yes-but/No-and |
| 岛田庄司 / 绫辻行人 | 新本格推理 | 空间谜题设计、图表契约 |
| Sam Barlow (Her Story) | 非线性叙事 | 垂直钻探、自然发现行为设计 |
| Failbetter Games (Fallen London) | QBN设计 | Quality-Based Narrative、精简原则 |
| Xie & Riedl (EACL 2024) | 计算悬念 | 对抗式计划破坏法 |
| Wagner et al. (2025) | 公平性模型 | 双读者概率验证 |
| Eger (AIIDE 2020) | 计算推理 | 动态认知逻辑 |

---

## 参考资料

### 悬疑创作参考 (`thriller-writing/references/`)

| 文件 | 内容 |
|------|------|
| `mystery-structure.md` | 悬疑三幕结构、9种子类型变体、信息经济学 |
| `clue-design.md` | 线索分类、布设技术、Knox十诫、线索密度管理 |
| `suspense-technique.md` | Hitchcock悬念模型、9种悬念技术、张力曲线 |
| `character-archetype.md` | 7种侦探原型、犯人四维设计、嫌疑人矩阵 |
| `red-herring.md` | 红鲱鱼类型、生命周期管理、常见错误 |
| `twist-design.md` | 反转分类、逆向工程法、揭示场景结构 |
| `pacing-tension.md` | 四阶段节奏模型、翻页动力、节奏诊断 |
| `dialogue-interrogation.md` | 潜台词技术、审讯策略矩阵、谎言写作 |
| `unreliable-narrator.md` | 6种不可靠类型、信任弧线、双重阅读设计 |
| `setting-atmosphere.md` | 封闭空间设计、氛围写作、日常之异技术 |
| `knowledge-state.md` | 知识状态追踪、竞争叙事、双读者验证、反派引擎 |

### 互动叙事参考 (`interactive-fiction/references/`)

| 文件 | 内容 |
|------|------|
| `branch-architecture.md` | 5种拓扑模型、混合设计、复杂度控制 |
| `choice-design.md` | 7种选择类型、设计原则、文案写作 |
| `state-management.md` | 变量设计、条件逻辑、结局触发系统 |
| `narrative-convergence.md` | 收敛技术、角色一致性、涟漪模型 |
| `reader-agency.md` | 读者角色定位、代入感设计、重玩设计 |
| `export-formats.md` | Twine/ink/ChoiceScript/JSON 完整语法规范 |
| `interactive-prose.md` | 互动文本写作、人称选择、节点长度、汇聚节点技巧 |
| `advanced-if.md` | Accept/Reject/Deflect对话、QBN系统、垂直钻探叙事 |

---

## 工作流

### 线性创作流（按子类型选择路线）

```
诡计优先（本格/密室/叙述诡计）：
  /start → /theme → /trick → /characters → /structure → /scene → /revise → /reveal → /export

角色优先（社会派/心理悬疑）：
  /start → /theme → /characters → /trick → /structure → /scene → /revise → /reveal → /export

结构优先（惊悚/犯罪程序）：
  /start → /theme → /structure → /characters → /trick → /scene → /revise → /reveal → /export
```

### 互动化流

```
/init → /branches → /choices → /character-paths → /state
                                                        ↓
              /export ← /consistency ← /ending ← /node 1..N
```

### 线性→互动转化流

```
线性完稿 → /init(来源:已有小说) → 识别决策点 → /branches
  → /choices → /character-paths → /state → /node 1..N → /ending
  → /consistency → /export {格式}
```

**两个技能的产物直接衔接**——详见 `interactive-fiction/SKILL.md` 的"从 thriller-writing 技能的输出转化"一节。

---

## 自我进化系统 (`meta/`)

方法论不是静态的教条，而是一个能自我改进的活系统。

### 三环进化模型

```
认知环（我们知道什么是对的？）← 审视假设和盲点
实践环（写作中发生了什么？）← 从创作中提取经验
生态环（外部世界在变什么？）← 跟踪趋势和新知
```

### 进化命令

| 命令 | 功能 | 触发时机 |
|------|------|----------|
| `/retro` | 项目级回顾（流程偏差、产出评价、修正建议） | 每个项目完成后 |
| `/evolve` | 跨项目模式识别 → 假设形成 → 方法论修改 | 积累 2+ 个复盘后 |
| `/benchmark` | 外部方法论批判性对标与整合 | 接触新知识时 |
| `/autopsy` | 优秀作品逆向工程 | 分析优秀作品时 |
| `/blindspot` | 认知盲区扫描（5种盲区类型检测） | 每 3-5 个项目后 |
| `/pulse` | 创作生态监测（趋势、平台、读者变化） | 持续 |

### 进化原则

1. **渐进式进化**：每次只改 1-3 个具体点，不做革命式重构
2. **保留失败记录**：被删除的规则进入 `graveyard.md`，避免重复犯错
3. **双轨验证**：理论验证 + 实践验证，两条轨道都通过才成为永久修改
4. **复杂度预算**：方法论应该越来越精炼，而非越来越臃肿

### 知识三状态

```
实验（刚加入，待验证）→ 实践（1-2 个项目验证）→ 原理（5+ 个项目验证）
```

---

## 技术规格

- **文件数**：32+ 个 Markdown 文件
- **参考资料**：11 (悬疑创作) + 8 (互动叙事) + 5 (进化系统) = 24 份
- **方法论来源**：25+ （经典编剧 + 学术论文 + 行业工具）
- **版本**：v2.0.0（[变更日志](meta/CHANGELOG.md)）
- **外部依赖**：零
- **语言**：中文（可扩展多语言）
- **许可**：MIT

---

## 致谢

结构设计参考了 [0xsline/short-drama](https://github.com/0xsline/short-drama) 的技能包架构模式。

---

## License

MIT License - 详见 [LICENSE](LICENSE)
