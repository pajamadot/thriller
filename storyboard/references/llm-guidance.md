# LLM 分镜拆解执行指南

> 如何让大语言模型有效执行分镜拆解——已知陷阱、强制思维链、自审计协议
> 基于 R²(Lin et al., 2025)、DSR(2025)、Intelligent Cinematography Review(2024) 的研究发现

---

## 一、LLM 做分镜拆解的已知优势与陷阱

### 优势

```
1. 叙事理解力强
   LLM 在理解文本叙事结构方面能力出色
   → 节拍识别、价值变化判断、情感弧线感知

2. 模式库丰富
   训练数据中包含大量电影分析、剧本、分镜描述
   → 可以调用 idiom 级别的模式（正反打、揭示序列等）

3. 中间表征能力
   DSR(2025) 证实：LLM 在处理"小说→剧本"时，
   使用中间表征（先写小说再转剧本）比直接生成好 83%
   → 分镜同理：先提取节拍，再转为镜头，比直接生成分镜好得多

4. 格式遵循
   LLM 善于按照给定模板生成结构化输出
   → 表格/JSON/卡片格式的分镜板
```

### 已知陷阱

```
陷阱 1: 表面模仿（Surface Mimicry）
  DSR(2025): "LLMs 擅长表面质量（语法、风格）
  但在深层叙事智能上一贯失败"

  在分镜中的表现:
    → 生成"看起来专业"但逻辑不通的镜头序列
    → 每个镜头单独看合理，但序列缺乏因果关系
    → 使用专业术语但不理解术语背后的叙事理由

  防范:
    → 强制要求为每个切标注"为什么切"的理由
    → 执行信息依赖图验证
    → 逐对检查相邻镜头的逻辑关系

陷阱 2: 均匀化倾向（Uniformity Bias）
  LLM 倾向于生成"均匀分布"的输出

  在分镜中的表现:
    → 所有镜头时长接近（3-4s 全部）
    → 景别均匀交替（MS→CU→MS→CU→MS→CU）
    → 缺少节奏变化（无加速、无停顿、无爆发）

  防范:
    → 节奏分析步骤必须检查方差
    → 强制要求至少一个"异常"时长（极长或极短）
    → 检查景别序列是否形成有方向性的变化

陷阱 3: 过度切换（Over-Cutting）
  LLM 倾向于给每个句子分配一个镜头

  在分镜中的表现:
    → 对话中每句台词切一个镜头（实际上多句可以在同一镜头内）
    → 描述段落被拆分为过多的碎片镜头
    → 缺少长镜头（长镜头需要"不切"的决策，这对LLM更难）

  防范:
    → 先识别节拍（不是句子），一个节拍可以跨多个句子
    → 每个切必须通过"三个合法理由"检验
    → 在节拍化步骤后检查：是否有可以合并的相邻节拍？

陷阱 4: 惯性依赖（Pattern Inertia）
  LLM 倾向于重复上一个镜头的模式

  在分镜中的表现:
    → 建立了一个"对话=正反打"的模式后无法突破
    → 一旦用了某个景别就倾向于继续用
    → 风格在序列中间变得僵化

  防范:
    → 在每5个镜头后强制问："是否需要打破当前模式？"
    → 检查是否有超过4个连续镜头使用相同景别
    → 在场景转折点强制要求景别/角度/运动的变化

陷阱 5: 忽略"不拍什么"（Neglecting Negative Space）
  LLM 倾向于填满每个镜头的信息

  在分镜中的表现:
    → 每个镜头都塞满信息（前景+中景+背景全有内容）
    → 缺少沉默（SIL 标注极少）
    → 缺少负空间（空白区域）的设计

  防范:
    → 每个场景至少有1个镜头的主要设计是"不展示什么"
    → 声音设计中沉默的比例应该 > 10%
    → 检查是否有利用负空间制造不安/孤独的镜头
```

---

## 二、强制思维链协议（Chain-of-Thought Protocol）

LLM 在执行 `/decompose` 时，必须对每个步骤进行显式推理，不允许跳步。

### Step 2 BEAT 的强制思维链

```
对每个节拍，必须回答:

  Q1: 这里发生了什么价值变化？
  A1: [具体描述：哪个价值维度从什么变到什么]

  Q2: 这个变化属于什么类型？
  A2: [行动/反应/揭示/转折/张力/释放/过渡 + 理由]

  Q3: 叙事重力是多少？
  A3: [1-5 + 理由：为什么是这个级别而不是更高/更低]

如果 Q1 的回答是"没有价值变化"：
  → 这不是一个独立节拍，合并到相邻节拍
```

### Step 4 SHOOT 的强制思维链

```
对每个镜头，必须回答:

  Q1: 为什么要从上一个镜头切到这里？
  A1: [信息/反应/强调 + 具体是什么信息/谁的反应/强调什么]

  Q2: 这个景别的选择理由？
  A2: [情感距离法则：此刻观众应该与角色有多远的情感距离？]

  Q3: 这个角度的选择理由？
  A3: [权力关系：此刻谁占优势？角色处于什么心理状态？]

  Q4: 摄影机运动/静止的理由？
  A4: [能量方向：叙事在聚焦/释放/跟随/观察？]

  Q5: 这个镜头给观众的新信息是什么？
  A5: [至少一个：新的视觉信息/新的情感信息/新的叙事信息]
       如果无法回答 → 这个镜头可能不需要存在

如果任何一个Q的回答是"不知道"或"随便"：
  → 这个镜头设计不完整，需要重新思考
```

### Step 5 CONNECT 的强制思维链

```
对每对相邻镜头 (Shot N, Shot N+1)，必须回答:

  Q1: Shot N+1 的 REQUIRES 是否被满足？
  A1: [列出所需信息 + 标注哪个之前的镜头提供了]

  Q2: 这个切的认知效果？
  A2: [scale-in(流畅)/scale-out(冲击)/同景别(中性)/角度变化(微妙)]

  Q3: 180度轴线是否保持？
  A3: [是/否。如果否，为什么要越轴？]

  Q4: 动作/运动是否连贯？
  A4: [前一镜有运动→后一镜接运动？前一镜静止→后一镜如何？]
```

---

## 三、自审计协议（Self-Audit Protocol）

完成分镜序列后，LLM 必须执行以下自审计。
这不是可选的——**必须在输出最终结果之前完成**。

### Audit 1: 存在性审计（每个镜头）

```
对 Shot 1..N 逐个检查:

  [PASS/FAIL] 这个镜头有至少一个新信息单元？
  [PASS/FAIL] 这个镜头的切入有合法理由？
  [PASS/FAIL] 这个镜头与前一个镜头不是简单重复？

  FAIL 计数 > 0 → 修复后重新审计
```

### Audit 2: 依赖审计（整个序列）

```
构建信息依赖图:
  对每个镜头标注 REQUIRES / PROVIDES / RAISES

  检查:
  [PASS/FAIL] 所有 REQUIRES 都被之前的 PROVIDES 覆盖？
  [PASS/FAIL] 无孤岛镜头（至少有一个入边或出边）？
  [PASS/FAIL] RAISES 链在结尾处都被 PROVIDES 回答或故意悬置？
```

### Audit 3: Idiom 审计（模式识别）

```
识别序列中的 idiom:
  [标注] 建立序列在哪里？
  [标注] 正反打序列在哪里？
  [标注] 揭示序列在哪里？

  检查:
  [PASS/FAIL] 每个 idiom 是否完整（不是只有一半）？
  [PASS/FAIL] idiom 之间的衔接是否有过渡？
  [WARN] 是否有不属于任何已知 idiom 的序列？
         如果有 → 是创新还是错误？标注理由。
```

### Audit 4: 认知审计（神经科学规则）

```
  [PASS/FAIL] 景别跳跃 > 2级 是否有理由？
  [PASS/FAIL] scale-out 是否用于冲击而非日常过渡？
  [PASS/FAIL] 无连续 > 3 的 scale-out（观众会感到被反复"推开"）？
  [PASS/FAIL] 静止→静止的切有明确的理由？
  [PASS/FAIL] 运动方向跨镜头一致？
```

### Audit 5: 节奏审计

```
  计算: 时长方差 σ
  [PASS/FAIL] σ > 1.5s？（方差太低=节奏单调）
  [PASS/FAIL] 最长镜头 / 最短镜头 ≥ 3？（倍率太低=无对比）
  [PASS/FAIL] 叙事高潮处有节奏变化？
  [PASS/FAIL] 每 5-8 个短镜头后有一个呼吸点？
```

---

## 四、分解-再-生成策略（Decompose-Then-Generate）

R²(2025) 和 DSR(2025) 的核心发现：
**分步生成比端到端生成好得多**。

### 端到端的问题

```
错误方法:
  输入: "林小曼推门进来，说有人在跟踪她..."
  期望输出: 完整的分镜表

  问题:
    - LLM 试图同时处理叙事理解+镜头设计+节奏+蒙太奇
    - 任务耦合导致每个维度都做不好（DSR称之为"Task Coupling Dilemma"）
    - 表面看起来专业但缺乏深层逻辑
```

### 正确的分步策略

```
Step 1: 只做节拍识别（不要想镜头）
  输入: 原文
  输出: 节拍列表 + 类型 + 重力
  验证: 节拍弧线是否合理？

Step 2: 只做空间调度（不要想镜头参数）
  输入: 节拍列表 + 空间信息
  输出: 角色位置 + 运动轨迹
  验证: 距离变化是否有叙事意义？

Step 3: 只做镜头参数（基于前两步）
  输入: 节拍 + 调度
  输出: 景别 + 角度 + 运动 + 时长
  验证: 每个选择的思维链是否完整？

Step 4: 只做蒙太奇和连贯性
  输入: 镜头参数序列
  输出: 转场 + 蒙太奇类型 + 连贯性标注
  验证: 信息依赖图是否有效？

Step 5: 整体审计和修复
  输入: 完整序列
  输出: 审计报告 + 修复后的最终序列
```

### 中间表征的力量

```
DSR 的发现: 使用中间表征的质量是直接生成的 1.5-2 倍

在分镜中:
  中间表征 = 节拍列表
  节拍列表是文本和镜头之间的"翻译层"

  文本 → [节拍列表] → 镜头序列
       ↑ 中间表征 ↑

  为什么有效:
    - 节拍列表只关注"说了什么"，不关注"怎么拍"
    - 这分离了叙事理解和视觉设计两个不同的能力
    - LLM 可以专注于一件事做好它，而非两件事做马虎
```

---

## 五、质量控制指标

### 可计算的质量指标

```
1. 信息效率 (Information Efficiency)
   = 非重复信息单元数 / 总镜头数
   目标: > 0.8（80%的镜头提供独特信息）
   低于 0.5 → 有太多空转镜头

2. 切理由覆盖率 (Cut Justification Coverage)
   = 有明确切理由的镜头数 / 总镜头数
   目标: 1.0（每个切都有理由）
   低于 0.8 → 有未经审视的切

3. 依赖完整度 (Dependency Completeness)
   = REQUIRES 被满足的镜头数 / 总镜头数
   目标: 1.0
   低于 1.0 → 有信息缺口

4. 节奏方差 (Rhythm Variance)
   = 镜头时长的标准差
   目标: 1.5-4.0s
   < 1.0 → 太均匀   > 5.0 → 太混乱

5. Idiom 覆盖率 (Idiom Coverage)
   = 属于已知 idiom 的镜头数 / 总镜头数
   目标: > 0.6（大部分镜头属于合理的模式）
   < 0.4 → 可能缺乏结构   > 0.9 → 可能太模板化

6. 景别分布熵 (Shot Size Entropy)
   = Shannon熵(景别分布)
   目标: > 2.0 bits（足够多样）
   < 1.5 → 景别过于集中（可能全是MS）
```

### 不可计算但需人工检查的质量

```
  - 镜头选择是否服务于情感而非仅仅是"正确"？
    (Murch优先级: 情感 > 故事 > 节奏 > 技术规则)
  - 是否有至少一个"创造性突破"的镜头？
    (不是错误，而是有意识地打破规则来达到效果)
  - 风格是否一致？
    (全序列是否感觉像同一个导演拍的？)
```

---

## 六、提示词工程注意事项

> **注意**: 本节的内容已被后续章节大幅扩展和形式化。
> 上下文管理 → 参见 Section 七（上下文窗口预算表）
> 提示词模板 → 参见 prompt-templates.md
> 输出验证 → 参见 Section 八（输出验证规范）

### 风格一致性维护

```
问题: 长序列中 LLM 可能"忘记"之前设定的风格
解决:
  - 在 /style 命令设定风格后生成一个"风格锚点"
  - 风格锚点是 3-5 条关键约束
  - 每 10 个镜头后重新注入风格锚点

注入频率规则 (参见 Section 七 上下文压缩策略):
  SHOOT 步骤: 必须注入
  CONNECT 步骤: 序列 > 10 镜头时注入
  RHYTHM 步骤: 不需要（节奏与风格正交）
  ANNOTATE 步骤: 注入（用于风格一致性检查）

示例风格锚点:
  "Hitchcock 悬疑风格:
   1. 静止镜头占比 > 50%
   2. 特写用于谎言和发现的时刻
   3. 运动只有推近（不用手持）
   4. 沉默 > 音乐
   5. 低调光+侧光为默认"
```

### 避免幻觉性镜头

```
LLM 可能生成物理上不可能的镜头:
  - "从天花板俯拍角色同时推近到ECU" → 物理上需要从天花板飞下来
  - "360度环绕+同时变焦+同时升降" → 设备做不到
  - "角色A的POV看到角色A自己的脸" → 逻辑矛盾

检查: 每个镜头问"这个镜头在物理上如何实现？"
  - 需要什么设备？（轨道/吊臂/无人机/手持）
  - 摄影机在哪个位置？
  - 这个位置物理上是否可行？（墙里？天花板上？）
```

---

## 七、上下文窗口预算表（Context Window Budget）

每个分解步骤需要不同的上下文。将完整的参考系统塞入每次调用是浪费且有害的——
过多上下文会稀释关键指令的注意力权重。以下是每步的最优上下文配置。

### 预算表

```
步骤       | 必须包含的上下文            | 估算Token | 优先级
─────────────────────────────────────────────────────────────────
PARSE      | 原始文本                   | 500-2000  | Must-have
           | 角色简表                   | 100-300   | Must-have
           | 空间描述                   | 100-200   | Must-have
─────────────────────────────────────────────────────────────────
BEAT       | PARSE输出                  | 300-800   | Must-have
           | 原始文本(参考)             | 500-2000  | Must-have
           | 节拍类型定义(7种)          | 200       | 嵌入prompt
─────────────────────────────────────────────────────────────────
BLOCK      | 节拍列表                   | 200-500   | Must-have
           | 空间平面图                 | 200-400   | Must-have
           | A-I-L 调度模型摘要         | 200       | Nice-to-have
           | Proxemics 四距离摘要       | 100       | Nice-to-have
─────────────────────────────────────────────────────────────────
SHOOT      | 节拍列表 + 重力值          | 200-500   | Must-have
           | BLOCK 调度结果             | 200-500   | Must-have
           | 四个切理由定义             | 300       | 嵌入prompt
           | 景别/角度/运动 enum        | 200       | 嵌入prompt
           | 风格锚点                   | 100-200   | Must-have (if set)
           | 前序列最后3个镜头          | 200-400   | Nice-to-have
─────────────────────────────────────────────────────────────────
VERIFY     | 完整镜头序列(含R/P/R标注)  | 1000-3000 | Must-have
           | 谓词清单(P01-P20)         | 500       | 嵌入prompt
           | 节拍重力值                 | 100-200   | Must-have
─────────────────────────────────────────────────────────────────
CONNECT    | 验证通过的镜头序列         | 800-2000  | Must-have
           | 转场类型 enum              | 200       | 嵌入prompt
           | Idiom 模式列表             | 300       | 嵌入prompt
           | 连贯性铁律摘要             | 200       | 嵌入prompt
─────────────────────────────────────────────────────────────────
RHYTHM     | 完整序列(含时长+景别)      | 500-1500  | Must-have
           | 节奏模式库摘要(6种)        | 300       | 嵌入prompt
           | 类型节奏基线               | 100       | 嵌入prompt
─────────────────────────────────────────────────────────────────
ANNOTATE   | 完整序列                   | 800-2000  | Must-have
           | 重力>=3的节拍原文          | 200-500   | Must-have
           | 电影参考知识               | LLM内部   | 不需额外加载
─────────────────────────────────────────────────────────────────
合计(单次全流程):                       | 8000-18000|
单步最大:                               | ~4000     | SHOOT步骤
```

### 上下文压缩策略

```
1. 步骤完成后压缩:
   PARSE 完成后 → 原始文本可以压缩为"节拍覆盖的关键句摘要"
   BEAT 完成后 → PARSE的详细标注可以丢弃，只保留节拍列表
   BLOCK 完成后 → 空间描述压缩为平面图 + 关键位置标注

2. 嵌入 vs 加载:
   频繁引用的规则（切理由、景别enum、谓词列表）→ 直接嵌入system prompt
   场景特异的数据（原文、角色、空间）→ 在user prompt中加载
   参考文件（shot-grammar.md等）→ 不加载整个文件，抽取相关规则嵌入

3. 最小可行上下文（Minimum Viable Context）:
   如果上下文紧张，每步的 Must-have 项不可省略
   Nice-to-have 项可以省略，使用 prompt 中的默认值
   当 Nice-to-have 被省略时，在输出中标注 "[DEFAULT ASSUMED]"

4. 风格锚点注入频率:
   SHOOT 步骤: 必须注入
   CONNECT 步骤: 如果序列 > 10 镜头则注入
   RHYTHM 步骤: 不需要（节奏与风格正交）
   ANNOTATE 步骤: 注入（用于风格一致性检查）
```

---

## 八、输出验证规范（Output Validator Specification）

LLM 输出必须是可验证的。以下是对 JSON 格式输出的逐字段验证规则。
这些验证可以在 LLM 输出后由外部脚本自动执行，或作为 VERIFY 步骤的一部分。

### Schema 验证（结构完整性）

```
对每个 shot 对象，验证:

V01: shot_id        → integer, 从1开始连续递增
V02: beat_id        → integer, 引用有效的节拍ID
V03: shot_size      → enum: EWS|ELS|VLS|LS|MLS|FS|MS|MCS|MCU|CU|BCU|ECU|INSERT
V04: angle          → enum: EYE|HIGH|LOW|BIRD|WORM|DUTCH|OTS|POV
V05: movement       → enum: STATIC|PUSH|PULL|TRACK|PAN|TILT|HANDHELD|STEADY|ORBIT|CRANE|DZOOM
V06: duration_s     → float, 范围 [0.3, 30.0]
V07: sound          → array, 至少1个元素
V07a: sound[].type  → enum: DIA|VO|AMB|SFX|MUS|SIL
V07b: sound[].content → string, 非空
V08: cut_reason     → null (仅shot_id=1) 或 enum: INFORMATION|REACTION|EMPHASIS|ORIENTATION
V09: provides       → array of string, 长度 >= 1
V09a: provides[]    → 每项以 (V)/(A)/(N) 通道标记开头
V10: requires       → array of string (可为空，仅shot 1允许)
V11: raises         → array of string (可为空)
V12: transition_in  → null (shot 1) 或 enum: CUT|JCUT|MATCH|GMATCH|FADE|DISSOLVE|LCUT|JCUT_AUDIO|INVIS
V13: scale_direction → null (shot 1) 或 enum: scale-in|scale-out|same-scale|angle-change-only
V14: idiom          → string 或 null
V15: annotation     → string (对 gravity >= 3 的节拍，非空)
```

### 逻辑验证（因果完整性）

```
L01: PROVIDES 非空
  FOR EACH shot: len(provides) >= 1
  FAIL → "Shot {id} has empty PROVIDES -- no reason to exist"

L02: CUT REASON 存在
  FOR EACH shot WHERE id > 1: cut_reason IS NOT NULL
  FAIL → "Shot {id} has no cut reason"

L03: REQUIRES 被满足
  FOR EACH shot:
    FOR EACH item IN requires:
      EXISTS prior_shot WHERE item IN prior_shot.provides
  FAIL → "Shot {id} REQUIRES '{item}' but no prior shot PROVIDES it"

L04: DAG 无循环
  Construct directed graph: shot A → shot B if B.requires references A.provides
  Check: graph is acyclic (topological sort succeeds)
  FAIL → "Circular dependency detected: {cycle_path}"

L05: 无孤岛镜头
  FOR EACH shot:
    has_outgoing = ANY(other_shot.requires references this.provides)
    has_incoming = ANY(item IN this.requires references prior.provides)
    shot.id == 1 exempt from incoming check
    last shot exempt from outgoing check
  FAIL → "Shot {id} is an orphan (no dependency edges)"

L06: 因果顺序
  FOR EACH shot with cut_reason == REACTION:
    The event being reacted to must be in a prior shot's PROVIDES
  FAIL → "Shot {id} is a REACTION but the triggering event is not in prior PROVIDES"

L07: Scale 方向正确计算
  FOR EACH adjacent pair (shot_n, shot_n1):
    size_order = [EWS,ELS,VLS,LS,MLS,FS,MS,MCS,MCU,CU,BCU,ECU]
    IF index(shot_n1.size) > index(shot_n.size) → scale-in
    IF index(shot_n1.size) < index(shot_n.size) → scale-out
    IF index(shot_n1.size) == index(shot_n.size) → same-scale or angle-change-only
    Check: shot_n1.scale_direction matches computed direction
  FAIL → "Shot {id} scale_direction is '{stated}' but computed is '{actual}'"
```

### 质量验证（指标阈值）

```
Q01: 信息效率
  unique_info_units = count(DISTINCT items across all PROVIDES)
  info_efficiency = unique_info_units / total_shots
  PASS: >= 0.8
  WARN: 0.5 - 0.79
  FAIL: < 0.5

Q02: 切理由覆盖率
  justified_cuts = count(shots where cut_reason IS NOT NULL, id > 1)
  coverage = justified_cuts / (total_shots - 1)
  PASS: == 1.0
  WARN: 0.8 - 0.99
  FAIL: < 0.8

Q03: 依赖完整度
  satisfied = count(requires items that ARE satisfied)
  total_requires = count(ALL requires items across ALL shots)
  completeness = satisfied / total_requires (or 1.0 if total_requires == 0)
  PASS: == 1.0
  FAIL: < 1.0

Q04: 节奏方差
  sigma = std_dev(all duration_s values)
  PASS: 1.5 <= sigma <= 4.0
  WARN: 1.0-1.49 or 4.01-5.0
  FAIL: < 1.0 or > 5.0

Q05: Idiom 覆盖率
  shots_in_idioms = count(shots where idiom IS NOT NULL)
  coverage = shots_in_idioms / total_shots
  PASS: 0.6 - 0.9
  WARN: 0.4-0.59 or 0.91-1.0
  FAIL: < 0.4

Q06: 景别分布熵
  freq[size] = count(shots with that size) / total_shots
  entropy = -SUM(freq * log2(freq)) for all sizes with freq > 0
  PASS: >= 2.0 bits
  WARN: 1.5 - 1.99
  FAIL: < 1.5
```

---

## 九、自修正协议（Self-Correction Protocol）

当 VERIFY 步骤或输出验证发现问题时，LLM 必须执行以下修正流程。
这不是无限循环——有明确的停止条件。

### 修正循环

```
VERIFY 发现问题
    │
    ├─→ 识别失败的谓词/指标
    │
    ├─→ 定位受影响的镜头 (shot_ids)
    │
    ├─→ 仅重新设计受影响的镜头 (不重跑整个序列)
    │     注意: 修改一个镜头可能影响其邻居的 REQUIRES/连贯性
    │     → 检查修改镜头的 N-1 和 N+1 是否仍然一致
    │
    ├─→ 重新运行 VERIFY (仅对修改的镜头及其邻居)
    │
    └─→ 检查停止条件:
          ✓ 所有谓词 PASS → 继续到下一步
          ✗ 仍有 FAIL:
            循环次数 < 3 → 回到"识别失败的谓词"
            循环次数 = 3 → 停止，标记为 [HUMAN_REVIEW_NEEDED]
```

### 针对性修复策略

```
谓词失败 → 修复策略:

P01 PROVIDES 为空:
  → 选项A: 向镜头添加新信息元素 (在画面中加入一个之前未见的细节)
  → 选项B: 将此镜头合并到前一镜头 (延长前镜头，删除空镜头)
  → 选项C: 改变景别以揭示新的视觉信息 (MS→CU 看到之前看不到的表情)

P02 缺少切理由:
  → 选项A: 为切标注合法理由 (必须是四种之一，不能编造新类型)
  → 选项B: 如果找不到理由 → 删除这个切，延长上一镜头

P03 REQUIRES 未满足:
  → 选项A: 在序列中插入一个建立镜头来提供缺失的信息
  → 选项B: 将缺失的信息添加到现有镜头的 PROVIDES 中 (如果景别允许)
  → 选项C: 修改当前镜头的 REQUIRES，移除不必要的前置条件

P08/P09 Scale 跳跃:
  → 选项A: 插入中间景别的过渡镜头
  → 选项B: 为跳跃添加叙事理由标注 (冲击/惊吓/认知断裂)
  → 选项C: 调整景别使跳跃缩小到2级以内

P10 景别单调:
  → 在连续相同景别中选择1-2个改为相邻景别
  → 优先改变位于idiom边界的镜头
```

### 质量指标修复策略

```
指标低于阈值 → 针对性修复:

信息效率 < 0.8 (太多空转镜头):
  → 找出 PROVIDES 只有1项且该项在其他镜头中重复的镜头
  → 合并到邻居镜头或添加独特信息
  → 不要通过"虚增"PROVIDES 来作弊

切理由覆盖 < 1.0:
  → 逐个检查无理由的切
  → 添加理由或删除切（延长前镜头）
  → 优先删除而非硬编理由

节奏方差 < 1.5 (太均匀):
  → 找到叙事重力最高的镜头 → 时长 ×1.5-2.0
  → 找到过渡节拍 → 时长 ×0.5-0.8
  → 在高潮前加入一个明显短于平均的镜头 (打破模式)
  → 在高潮后加入一个明显长于平均的镜头 (呼吸点)

节奏方差 > 5.0 (太混乱):
  → 检查是否有异常极端的时长 (>20s 或 <0.5s)
  → 将极端值拉向合理范围
  → 确认极端时长有叙事理由，否则调整

Idiom 覆盖 < 0.4:
  → 检查序列中是否有未被标记的idiom (可能存在但未识别)
  → 对于不属于任何idiom的"散射"镜头段落:
    如果是创新 → 标注理由，保留
    如果是失误 → 重新组织为已知idiom

景别熵 < 1.5:
  → 统计景别使用频率
  → 找出过度使用的景别 (通常是MS)
  → 用叙事理由替换部分为 CU/MCU/LS
  → 不要为了熵值而随机改变——每次改变需要回答"为什么这个景别更适合？"
```

### 修正日志格式

```
每次修正必须记录:

[CORRECTION CYCLE {{N}}/3]
  Failed predicates: P03(shots 5,8), Q04(sigma=1.2)

  Fix for P03 shot 5:
    Problem: REQUIRES "Lin Xiaoman's nervous state" not in prior PROVIDES
    Action: Added "(V) Lin Xiaoman fidgeting with sleeves" to shot 3 PROVIDES
    Impact on neighbors: None (shot 3 already shows MCU of Lin Xiaoman)

  Fix for P03 shot 8:
    Problem: REQUIRES "consulting room spatial layout" not established
    Action: Inserted establishing shot between shot 7 and old shot 8
    Impact: All subsequent shot IDs shifted +1

  Fix for Q04:
    Problem: sigma = 1.2 (too uniform, target >= 1.5)
    Action: Extended shot 7 (revelation moment) from 4s to 8s (FERMATA)
            Shortened shot 2 (transition) from 4s to 2s
    New sigma: 2.1 ✓

  Re-verify results: P03 PASS, Q04 PASS, all others still PASS
  Status: ALL PASS → proceed to CONNECT
```

---

## 十、压力测试与最小上下文实验

### 最小可行提示词（Minimum Viable Prompt）

以下是最小上下文条件下仍能产出合理分镜的"地板提示词"。
用于评估 LLM 在信息匮乏时的退化行为。

```
System: You are a storyboard artist. Decompose text into shots.
Every cut needs a reason. Every shot needs new information.
Output JSON with: shot_id, shot_size, angle, movement, duration_s,
cut_reason, provides, requires.

User: Decompose this scene:
"""
{{SCENE_TEXT}}
"""
```

### 预期退化模式

```
在最小上下文下，LLM 通常表现出以下退化:

退化1: 均匀化加剧
  所有镜头 3-4s，所有MS，sigma < 0.5
  原因: 没有节奏规则提示，默认到"安全"选择
  诊断: Q04 FAIL, Q06 FAIL

退化2: 切理由变泛
  切理由全写成 INFORMATION，即使实际是 REACTION
  原因: 没有四种理由的精确定义，LLM 用最通用的一个
  诊断: 人工审查发现理由错配率 > 30%

退化3: PROVIDES 变废话
  PROVIDES 写成 "shows the character" 而非具体信息
  原因: 没有多通道 (V/A/N) 标注要求
  诊断: 信息效率计算时发现大量重复/非具体项

退化4: 丢失 idiom 意识
  正反打不完整（缺少建立镜头），揭示序列没有铺垫
  原因: 没有 idiom 定义提示
  诊断: Q05 FAIL, Idiom覆盖 < 0.3

退化5: 声音设计消失
  无 SIL 标注，声音全部是 DIA
  原因: 没有声音设计提示
  诊断: P16 FAIL, P17 FAIL
```

### 压力测试矩阵

```
| 测试ID | 上下文级别 | 包含内容               | 预期通过率 |
|--------|-----------|----------------------|-----------|
| ST-01  | 最小      | 仅文本+基本指令         | 40-50%    |
| ST-02  | 基本      | +切理由定义+景别enum    | 60-70%    |
| ST-03  | 标准      | +完整SHOOT步骤提示      | 75-85%    |
| ST-04  | 完整      | +全部8步+陷阱警告       | 85-95%    |
| ST-05  | 过载      | +全部参考文件(未压缩)   | 80-90%*   |

* ST-05 通过率略低于 ST-04 是因为上下文过载会稀释关键指令的权重
  → 这验证了上下文预算表的必要性
```

---

## 十一、校准基准（Calibration Benchmarks）

使用以下三个测试场景来校准提示词模板的输出质量。
每个场景定义了预期的镜头数、节奏模式、idiom 序列和指标目标。
详细的预期值和关键质量检查点见 prompt-templates.md 的"Calibration Benchmarks"章节。

### 基准场景定义

```
基准1: 咨询室对话 (dialogue-heavy)
  来源: 《镜中访客》ch1, 节拍 4-7 (林小曼到来→揭示跟踪→叶知秋反应)
  场景类型: 两人对话渐进到揭示
  预期镜头数: 7-10
  预期节奏: BREATHE → FERMATA
  预期idiom: ESTABLISHING → SRS → REVEAL → REACTION
  指标目标: 信息效率>=0.85, 方差1.5-2.5, 覆盖率=1.0

基准2: 独自回家 (solo movement)
  来源: 《镜中访客》ch1, 节拍 8-9 (送走林小曼→独坐→回公寓)
  场景类型: 独角反思+场景转换
  预期镜头数: 3-5
  预期节奏: RITARDANDO
  预期idiom: 过渡序列 + ESTABLISHING
  指标目标: 信息效率>=0.8, 方差2.0-4.0, 至少一个>=8s的镜头

基准3: 发现异常 (revelation sequence)
  来源: 《镜中访客》ch1, 节拍 10-12 (帽衫→分析→鞋上泥点)
  场景类型: 独角发现序列，双重揭示递进
  预期镜头数: 6-9
  预期节奏: BREATHE → ACCELERANDO
  预期idiom: REVEAL(帽衫) → TENSION → REVEAL(泥点)
  指标目标: 信息效率>=0.85, 方差1.5-3.0, 第二揭示比第一揭示更紧
```

### 校准流程

```
1. 对每个基准场景运行 prompt-templates.md Template 1 (Full Decompose)
2. 收集输出的6项可计算指标
3. 对比预期目标:
   ✓ 5/6 指标在目标范围内 → 校准通过
   ✗ 3+ 指标在目标范围外 → 需要调整提示词

4. 如果校准失败，诊断:
   a. 哪个陷阱最可能导致偏差？
   b. 提示词中对该陷阱的防范是否被正确嵌入？
   c. 上下文预算是否合理？(过多/过少)
   d. 调整后重新运行，记录差异

5. 校准结果记录格式:
   [CALIBRATION RUN {{DATE}}]
   Benchmark 1: 5/6 PASS (FAIL: sigma=1.3)
   Benchmark 2: 6/6 PASS
   Benchmark 3: 4/6 PASS (FAIL: idiom_coverage=0.35, entropy=1.4)
   Action: Strengthened idiom awareness in system prompt,
           added explicit INSERT shot instruction for object reveals
   Re-run: Benchmark 3 now 6/6 PASS
```

---

## 十二、与其他参考文件的交叉引用

### 提示词模板如何引用其他文件

```
文件                         | 在提示词中的角色
───────────────────────────────────────────────────
shot-grammar.md             | 景别/角度/运动的 enum 定义
                            | → 嵌入 system prompt，不需要加载整个文件

shot-logic.md               | 四种切理由 + 谓词 P01-P20 + DAG 模型
                            | → 切理由定义嵌入 prompt
                            | → 谓词清单嵌入 VERIFY 步骤

decomposition-algorithm.md  | 8步流程的完整定义
                            | → 流程结构嵌入 Template 1 的 user prompt
                            | → 不需要加载原始文件

visual-rhythm.md            | 节奏模式库 + 时长基线 + 张力弧线
                            | → 模式名称嵌入 RHYTHM 步骤
                            | → 时长基线嵌入 system prompt

montage-theory.md           | 蒙太奇类型 + 转场手册
                            | → 转场 enum 嵌入 prompt
                            | → 蒙太奇类型名称嵌入 CONNECT 步骤

composition-staging.md      | A-I-L 调度 + Proxemics + 深度分层
                            | → 调度模型摘要在 BLOCK 步骤为 Nice-to-have

evaluation.md               | 六维度评分体系
                            | → 评分维度嵌入 Template 5 (Score)
                            | → 类型权重嵌入 system prompt

prompt-templates.md         | 本文件的完整提示词模板
                            | → 直接使用，不需要交叉引用
```
