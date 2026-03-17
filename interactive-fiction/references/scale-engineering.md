# 大规模互动叙事工程化管理

> 当节点数量达到 50-200+ 时，如何在长上下文限制下保持一致性
> 基于 NovelCrafter Codex、DOME (NAACL 2025)、SCORE (2025)、Failbetter QBN、Novel-OS 多Agent框架

---

## 一、核心挑战

```
写节点 #80/150 时面临的问题：

1. 上下文溢出：前 79 个节点的完整文本远超上下文窗口
2. 一致性漂移：第 80 个节点可能与第 5 个节点的设定矛盾
3. 状态爆炸：50+ 个状态变量的组合可能产生不可预见的情况
4. 涟漪效应：修改一个节点可能影响下游几十个节点
5. 路径盲区：某些路径组合从未被通读验证
```

---

## 二、文件架构（一节点一文件）

### 目录结构

```
project/
├── story-bible.md              ← 全局设定（始终加载）
├── manifest.yaml               ← 节点索引 + 依赖图
├── variables.yaml              ← 状态变量注册表
├── codex/                      ← 知识条目（按需加载）
│   ├── char-detective.md
│   ├── char-suspect-a.md
│   ├── loc-crime-scene.md
│   └── clue-registry.md
├── nodes/                      ← 每个节点一个文件
│   ├── ch01/
│   │   ├── n001-discovery.md
│   │   ├── n002-choice-investigate.md
│   │   └── n003-choice-report.md
│   ├── ch02/
│   │   ├── n010-interrogation.md
│   │   └── ...
│   └── ch08/
│       ├── n140-reveal.md
│       └── n150-ending-truth.md
├── summaries/                  ← 滚动摘要（自动更新）
│   ├── ch01-summary.md
│   ├── ch02-summary.md
│   └── running-summary.md      ← 截至当前的全局摘要
└── validation/
    ├── graph.json              ← 节点依赖图（自动生成）
    └── report.md               ← 最近一次验证报告
```

### 节点文件格式（YAML frontmatter + 正文）

```yaml
---
id: n047
title: 审讯陈医生
chapter: 3
type: decision  # narrative | decision | convergence | ending
from: [n045, n046]  # 可以到达此节点的来源
to: [n048, n049, n050]  # 此节点的后续
reads: [trust_chen, found_knife, know_victim_secret]  # 读取的状态变量
writes: [trust_chen, chen_confession]  # 修改的状态变量
conditions: "trust_chen >= 30 AND found_knife == true"  # 进入条件
codex_links: [char-suspect-a, loc-hospital, clue-injection]  # 需要加载的知识条目
word_count: 850
status: draft  # draft | review | final
---

# 审讯陈医生

{正文内容}

## 选择

> **直接质问注射痕迹**
> → n048 (trust_chen -= 20, chen_defensive = true)

> **先建立信任再试探**
> → n049 (trust_chen += 10)

> **展示你知道的证据**
> → n050 (conditions: found_knife AND know_victim_secret)
```

---

## 三、上下文注入策略

### 写作每个节点时的上下文构成

```
上下文 = 固定层 + 动态层

固定层（始终加载，~2000 tokens）：
  ├── story-bible.md（精简版：主题、真相、核心规则）
  ├── variables.yaml（全部状态变量定义）
  └── manifest.yaml 中本节点的元数据

动态层（按需加载，~3000-5000 tokens）：
  ├── codex/{本节点引用的知识条目}
  ├── summaries/running-summary.md（全局滚动摘要）
  ├── 前一个节点的完整文本（上游节点 from[] 中最近的一个）
  └── 相关节点的摘要（同章节其他节点的 1 句话摘要）

绝不加载：
  ✗ 所有节点的完整文本
  ✗ 与本节点无关的知识条目
  ✗ 已消解的红鲱鱼详情
```

### Codex 知识条目格式

```yaml
---
id: char-suspect-a
type: character
name: 陈医生
activation_keys: [陈医生, 陈, 主治医生, 医院]
last_updated: n045
---

# 陈医生

## 基本信息
50岁，受害者的主治医生，表面上温和可靠。

## 当前状态（截至 n045）
- 信任度：45/100
- 已暴露的信息：承认案发当晚在医院加班
- 隐藏的信息：与受害者有私人关系（读者不知道）
- 最近行为：回避关于注射痕迹的问题

## 知识状态
- 知道：受害者的真实病历、注射的存在
- 不知道：侦探已经发现了注射痕迹
- 会说谎的：关于自己与受害者的关系
```

---

## 四、滚动摘要系统

### 每章完成后生成章节摘要

```
ch03-summary.md:

## 第三章摘要（5句话以内）
侦探在医院发现了受害者颈部的注射痕迹（C03），这在验尸报告中
未被提及。审讯周助理时发现他的解释过于流畅。陈医生在深夜出现
引起了怀疑。本章末尾侦探开始怀疑医院内部有人参与。

## 状态变化
- found_injection: false → true
- trust_zhou: 50 → 35
- suspicion_hospital: 0 → 60

## 活跃线索
- C03（注射痕迹）已布设，待解读
- H02（周助理的紧张）已激活

## 活跃悬念
- 谁在验尸报告中隐瞒了注射痕迹？
- 陈医生为什么深夜来医院？
```

### 全局滚动摘要（running-summary.md）

```
每完成一章，将章节摘要的核心内容（2-3句）追加到全局摘要。
全局摘要永远不超过 1500 字。
当超过时，压缩最早的章节为 1 句话。

压缩比例参考（DOME 论文）：
  10:1 压缩保持含义忠实
  100:1 开始丢失关键细节
  → 对于 200 节点项目，全局摘要 ~1500 字 ≈ 50:1 压缩，可接受
```

---

## 五、状态变量管理

### 变量注册表（variables.yaml）

```yaml
variables:
  # 关系型
  - name: trust_chen
    type: integer
    range: [0, 100]
    initial: 50
    description: "对陈医生的信任度"
    written_by: [n010, n047, n048, n049, n080]
    read_by: [n047, n050, n080, n120, n140]

  # 布尔型
  - name: found_injection
    type: boolean
    initial: false
    description: "是否发现注射痕迹"
    written_by: [n035]
    read_by: [n047, n050, n060, n140]
    critical: true  # 影响结局的关键变量

  # 累积型
  - name: evidence_count
    type: integer
    range: [0, 15]
    initial: 0
    description: "收集的证据总数"
    written_by: [多个节点]
    read_by: [n130, n140, n141, n142]  # 结局分化节点
```

### 依赖矩阵自动生成

```
从所有节点的 frontmatter 中提取 reads/writes，生成：

变量依赖矩阵：
  trust_chen:
    writers: [n010, n047, n048, n049, n080]
    readers: [n047, n050, n080, n120, n140]
    → 修改 n047 的 trust_chen 逻辑时，
      必须验证 n050, n080, n120, n140 的条件仍然合理

ripple 分析：
  如果修改 n047 使 trust_chen 不再可能 >= 70：
    → n120 的条件 "trust_chen >= 70" 变为不可达
    → n140 的结局 "陈医生主动坦白" 变为不可达
    → 报告：2 个下游节点受影响
```

---

## 六、验证系统

### 结构验证（可自动化）

```
从 manifest.yaml + 节点 frontmatter 自动检查：

□ 可达性：每个节点至少从起始节点可达
□ 终止性：每个非结局节点至少有一个后续
□ 无孤岛：不存在与主图断开的节点子集
□ 变量定义：所有 reads 中引用的变量在 variables.yaml 中存在
□ 变量初始化：所有 reads 之前有对应的 writes（沿路径）
□ 条件可满足：每个 conditions 至少在一条路径上可为真
□ 结局可达：每个结局节点至少有一条路径可达
□ 字数范围：节点字数在目标范围内（±30%）
□ 状态范围：数值变量不会超出 range
```

### 叙事验证（需人工+AI辅助）

```
关键路径通读：
  1. 加载路径上所有节点的完整文本（按顺序）
  2. 检查叙事连贯性：
     □ 角色行为是否一致
     □ 信息是否前后矛盾
     □ 汇聚节点是否兼容所有来源路径
     □ 线索是否在揭示前被呈现

  推荐通读路径（最少 5 条）：
  - 最短路径
  - 最长路径
  - 最佳结局路径
  - 最差结局路径
  - 随机路径 × 1
```

---

## 七、增量生成流水线

### 四阶段流水线

```
Stage 1: 大纲（全局视角，一次完成）
  输入：theme.md + trick-design.md + characters.md + structure.md
  输出：manifest.yaml（所有节点的 ID、标题、类型、依赖关系）
  上下文需求：~5000 tokens

Stage 2: 骨架（每个节点，批量生成）
  输入：manifest.yaml + story-bible.md + 本节点元数据
  输出：每个节点的 frontmatter + 场景描述 + 选择文案（无正文）
  上下文需求：~3000 tokens/节点

Stage 3: 填充（每个节点，逐一生成）
  输入：固定层 + 动态层（见上文"上下文注入策略"）
  输出：完整正文（800-2000字）
  上下文需求：~8000 tokens/节点
  顺序：按章节顺序，同章节内按依赖关系拓扑排序

Stage 4: 验证与修正（全局检查，迭代）
  输入：全部节点 frontmatter + 结构验证结果 + 关键路径通读
  输出：修正建议 + 需要重写的节点列表
  上下文需求：~5000 tokens（只加载 frontmatter，不加载正文）
```

### 修改的涟漪处理

```
当修改节点 N 时：

1. 重新生成 N 的内容
2. 更新 N 所在章节的摘要
3. 更新 running-summary.md
4. 运行变量依赖矩阵：识别受影响的下游节点
5. 对每个受影响节点：
   a. 重新加载其上下文（包含更新后的摘要）
   b. 检查是否需要修改
   c. 如需修改 → 递归执行步骤 1-5（但设最大递归深度 = 2）
6. 运行结构验证
```

---

## 八、Codex 条目管理

### 条目生命周期

```
创建：在 /characters 阶段为每个角色创建
更新：每当节点中角色状态发生重大变化时更新 "当前状态" 部分
冻结：角色死亡或退场后标记为 frozen
归档：与当前写作无关的条目移至 codex/archive/

更新时机：
  - 节点写作完成后，检查是否有角色状态变化
  - 如有变化 → 更新对应 codex 条目的 "当前状态" 和 "last_updated"
  - 不更新历史信息（保持角色档案的完整性）
```

### 条目类型

```
角色条目：身份、性格、知识状态、当前状态、与案件的关系
地点条目：描述、包含的线索/物品、氛围关键词
线索条目：线索ID、出现节点、当前状态（未发现/已发现/已解读）、关联线索
规则条目：世界规则、时间线约束、物理限制
```

---

## 九、适用于 Claude Code Skill 的实践

### 上下文管理策略

```
在 SKILL.md 中指导 AI：

写作 /node {N} 时：
  1. 先读取 manifest.yaml 确定 N 的依赖关系
  2. 读取 story-bible.md（固定层）
  3. 读取 N 的 codex_links 对应的知识条目
  4. 读取 running-summary.md
  5. 读取 from[] 节点中最近的一个（完整文本）
  6. 基于以上上下文写作节点 N
  7. 写完后更新 summaries/ 和 codex/ 中的变化项

绝不要：
  ✗ 一次性读取所有节点
  ✗ 把整个 codex/ 全部加载
  ✗ 跳过摘要直接引用远处节点的细节
```

### 验证脚本模式

```
/consistency 命令应该：
  1. 解析所有节点的 frontmatter（不读正文，省上下文）
  2. 构建依赖图
  3. 运行结构验证检查清单
  4. 输出报告到 validation/report.md
  5. 对发现的问题，逐一加载相关节点正文进行叙事验证
```
