# 分镜图像提示词生成系统

> 模型无关的场景描述语言(SDL) + 薄层适配器 → 任意图像生成模型
> 分镜参数 → SDL中间表征 → 适配器 → NB2 / SD / DALL-E / MJ / fal.ai / 未来模型

---

## 一、架构：模型无关设计

### 核心原则

提示词描述的是**画面内容**，不是**模型指令**。
换模型不应该需要重写提示词，只需要换适配器。

```
分镜参数 ─→ SDL (Scene Description Language) ─→ Adapter ─→ 模型格式
  (电影语言)      (模型无关的画面描述)            (薄层转换)   (API参数)

       ┌─→ NB2 Adapter  → Nano Banana 2 / Gemini API
       │
SDL ───┼─→ SD Adapter   → Stable Diffusion / ComfyUI
       │
       ├─→ DALLE Adapter → DALL-E 3 / 4
       │
       ├─→ MJ Adapter   → Midjourney
       │
       ├─→ fal Adapter   → fal.ai (Story Platform)
       │
       └─→ Future Adapter → 未来任何模型
```

### SDL 与模型格式的关系

```
SDL = 标准化的画面描述（what）
Adapter = 模型特定的指令翻译（how）

SDL 不关心:
  ✗ 关键词还是自然语言（那是适配器的事）
  ✗ 负面提示词（有的模型需要，有的不需要）
  ✗ 技术参数（steps, cfg, sampler）
  ✗ 参考图的传递方式（API参数还是URL）

SDL 只关心:
  ✓ 画面里有什么（主体、环境、物件）
  ✓ 画面怎么构图（景别、角度、深度）
  ✓ 画面什么情绪（光线、色彩、氛围）
  ✓ 引用什么资产（@人物、#非人物）
```

### 从分镜参数到SDL的转换

```
景别 (CU/MS/LS...)     → sdl.framing（主体占比 + 可见身体范围）
角度 (HIGH/LOW/DUTCH...)→ sdl.perspective（视角 + 透视变形）
构图 (三分法/引导线...) → sdl.composition（主体位置 + 背景布局）
色温 T_color()          → sdl.palette（色彩 + 光源）
深度 (FG/MG/BG)        → sdl.depth（景深 + 焦点 + 前后景）
隐喻 (M01-M28)         → sdl.symbolism（象征元素的可见呈现）
运动 (PUSH/TRACK...)   → sdl.motion（运动模糊 + 动态构图暗示）
声音                    → sdl.mood（氛围——声音影响情绪描述但不直接转化）
```

---

## 二、资产引用系统（@ 人物 / # 非人物）

提示词中使用两种符号引用项目资产。解析器自动将引用替换为资产URL或文字描述。

### 双符号设计

```
@ = 人物（角色）     只用于有生命的角色
# = 非人物（一切其他） 场景、地点、物件、道具、服装、文件……

为什么分两个符号？
  1. 图像生成中"人物"和"非人物"的处理方式完全不同
     - 人物 → 需要面部一致性（reference portrait / IP-Adapter / NB2角色锁定）
     - 非人物 → 需要环境一致性（background reference / ControlNet）
  2. 解析器可以无歧义地将引用路由到正确的资产类型
  3. 与 Story Platform 的 @mention 系统兼容（节点文本中 @角色 已有约定）
```

### 语法

```
@角色名           → 角色的默认参考图（立绘/头像）
@角色名.表情       → 角色特定表情的参考图
@角色名.全身       → 角色全身参考图

#场景名           → 场景/地点的背景参考图
#物件名           → 物件/道具的参考图
#场景名.夜        → 场景特定变体（时间/天气/状态）
```

### 示例

```
提示词中的写法:
  "A close-up of @叶知秋 sitting in #咨询室, looking at @林小曼
   who is nervously twisting #外套袖子..."

解析后（URL模式）:
  prompt: "A close-up of [character] sitting in [location]..."
  character_refs: [
    { ref: "@叶知秋", url: "https://assets.../ye-zhiqiu-portrait.png", type: "character" },
    { ref: "@林小曼", url: "https://assets.../lin-xiaoman-portrait.png", type: "character" }
  ]
  asset_refs: [
    { ref: "#咨询室", url: "https://assets.../consulting-room-bg.png", type: "location" },
    { ref: "#外套袖子", description: "dark formal coat sleeve", type: "prop" }
  ]

解析后（文字展开模式，无参考图时）:
  "A close-up of a Chinese woman in her early thirties with short
   professional hair [叶知秋] sitting in a modern therapy office with
   bookshelves and diplomas [咨询室], looking at a young Chinese woman
   in her mid-twenties with light makeup [林小曼]..."
```

### 与图像生成API的集成

```
NB2 / Gemini（推荐）:
  @ → reference_image（角色一致性，NB2支持最多5人同时）
  # → 自然语言描述（NB2的世界知识足够理解场景描述）
  #物件 → 如果有参考图则附加，否则用文字描述

  示例API调用:
    prompt: "A close-up of @叶知秋 in #咨询室..."
    reference_images: [
      { url: "https://...", label: "@叶知秋", role: "subject" }
    ]
    // #咨询室 已在prompt文字中展开为场景描述

fal.ai / Story Platform:
  @ → generation.create_image.reference_images[role="subject"]
  # → generation.create_image.reference_images[role="background"]
      或展开为 prompt 文字描述

  generation.create_image({
    prompt: "...",
    reference_images: [
      { url: "@叶知秋 → signed_url", role: "subject" },
      { url: "#咨询室 → signed_url", role: "background" }
    ]
  })

Stable Diffusion / ComfyUI:
  @ → IP-Adapter 参考图输入（人物一致性）
  # → ControlNet 参考图输入（场景结构）
      或 img2img 参考（物件细节）

DALL-E (不支持参考图):
  @/# → 全部展开为文字描述（从角色/场景档案提取）
```

### 引用解析的数据源

```
本地模式（从项目文件提取）:
  @角色名 → projects/{project}/characters.md
            查找角色描述段落 → 提取外貌/年龄/特征
            如有 portrait_asset_id → 解析为本地文件路径

  #场景名 → projects/{project}/structure.md
            查找场景描述 → 提取环境/时间/氛围
            如有 background_asset_id → 解析为本地文件路径

  #物件名 → 从分镜的构图描述中提取物件特征
            如果项目有 items 定义 → 使用 icon_asset_id

Story Platform API 模式（在线）:
  @角色名 → GET /characters?name={name}
            → portrait_asset_id → /files/{id}/url → signed URL

  #场景名 → GET /locations?name={name}
            → background_asset_id → /files/{id}/url → signed URL

  #物件名 → GET /items?name={name}
            → icon_asset_id → /files/{id}/url → signed URL

Fallback 链:
  有资产URL？ → 使用URL（最佳：角色/场景一致性）
  无URL但有描述？ → 展开为文字描述（次佳：靠模型理解）
  无URL无描述？ → 输出警告 ⚠ "建议先为 @叶知秋 生成参考立绘"
```

### 在分镜表中使用引用

```markdown
| # | 节拍 | 景别 | 构图要点 | 资产引用 |
|---|------|------|---------|---------|
| 1 | 建立 | ELS | 公寓外景 | #叶知秋公寓.夜 |
| 3 | 行动 | MCU | 进门挂衣 | @叶知秋 #公寓走廊 |
| 4 | 揭示 | INSERT | 帽衫特写 | #帽衫 #衣帽钩 |
| 6 | 揭示 | CU | 关键台词 | @林小曼 #咨询室 |
| 7 | 反应 | ECU | 震动 | @叶知秋.震惊 |
```

### /visualize 输出中的引用处理

```
/visualize --format nb2 --resolve-refs

输出结构:
  1. template_prompt: 带 @/# 引用的模板版（可编辑、可移植）
  2. resolved_prompt: 已解析版（引用替换为描述或URL）
  3. character_refs: [{ ref, url|description, type:"character" }]
  4. asset_refs: [{ ref, url|description, type:"location|prop" }]
  5. missing_refs: [{ ref, type, suggestion }] ← 需要先生成的资产

当存在 missing_refs 时:
  → 自动生成资产创建建议:
    "⚠ @林小曼 没有参考立绘。建议运行:
     /generate portrait --character 林小曼 --expression neutral"
    "⚠ #咨询室 没有背景图。建议运行:
     /generate background --location 咨询室 --time afternoon"
```

### JSON Schema 中的引用字段

```json
{
  "shots": [{
    "id": 1,
    "asset_references": {
      "characters": [
        { "ref": "@叶知秋", "variant": null, "resolved_url": "string|null" },
        { "ref": "@林小曼", "variant": "恐惧", "resolved_url": "string|null" }
      ],
      "assets": [
        { "ref": "#咨询室", "variant": "afternoon", "resolved_url": "string|null" },
        { "ref": "#帽衫", "variant": null, "resolved_url": "string|null" }
      ]
    }
  }]
}
```

---

## 三、SDL Schema（模型无关的中间表征）

每个镜头生成一个 SDL 对象。SDL 描述画面内容，不包含任何模型特定指令。

### SDL JSON Schema

```json
{
  "shot_id": 4,
  "sdl_version": "1.0",

  "framing": {
    "size": "CU",
    "size_description": "face filling the frame, head and shoulders visible",
    "angle": "EYE",
    "angle_description": "straight on, eye level, neutral power"
  },

  "subject": {
    "characters": [
      {
        "ref": "@林小曼",
        "variant": "恐惧",
        "description": "young Chinese woman, mid-twenties, light makeup, dark circles under eyes",
        "expression": "deep fear mixed with desperate hope",
        "body": "sitting on sofa, hands twisting coat sleeve",
        "facing": "toward camera (toward therapist)"
      }
    ],
    "props": [
      { "ref": "#外套袖子", "description": "dark coat sleeve being twisted nervously" }
    ]
  },

  "environment": {
    "location_ref": "#咨询室",
    "description": "modern therapy office, bookshelves, diplomas on wall",
    "time": "afternoon",
    "weather": null,
    "foreground": null,
    "midground": "subject sitting on therapy sofa",
    "background": "blurred bookshelves and window, soft shapes"
  },

  "depth": {
    "focus": "shallow",
    "aperture_equiv": "f/1.4",
    "focus_subject": "@林小曼 face",
    "blur_background": true,
    "blur_foreground": false
  },

  "lighting": {
    "color_temp_k": 4800,
    "threat_level": 0.3,
    "key_ratio": "3:1",
    "direction": "side (from window, left)",
    "quality": "soft natural, afternoon",
    "special": "warm-to-cool transition across face"
  },

  "palette": {
    "dominant": "warm amber transitioning to cool shadow",
    "saturation": 0.7,
    "contrast": "medium"
  },

  "mood": {
    "primary": "fearful vulnerability with desperate hope",
    "secondary": "clinical safety being violated by external threat",
    "genre_atmosphere": "psychological thriller, unsettling calm"
  },

  "motion": {
    "camera_movement": "STATIC",
    "subject_movement": "minimal (hands twisting)",
    "motion_blur": false
  },

  "symbolism": {
    "metaphors_active": ["M08:cage (framed by office space)"],
    "visual_motifs": ["makeup as mask", "dark circles as truth leaking through"]
  },

  "aspect_ratio": "16:9",

  "asset_references": {
    "characters": [
      { "ref": "@林小曼", "variant": "恐惧", "resolved_url": null }
    ],
    "assets": [
      { "ref": "#咨询室", "variant": "afternoon", "resolved_url": null },
      { "ref": "#外套袖子", "variant": null, "resolved_url": null }
    ]
  }
}
```

### SDL 的 6 个语义段

```
1. framing    — 景别+角度 → 画面的"物理窗口"
2. subject    — 人物+物件 → 画面里有什么
3. environment — 场景+深度 → 画面的空间
4. lighting   — 光线+色彩 → 画面的情绪光影
5. mood       — 氛围+类型 → 画面的情感意图
6. symbolism  — 隐喻+母题 → 画面的潜文本
```

### 各段详解

**段1: 镜头/画面类型**
```
景别映射:
  ELS → "extreme wide shot, vast landscape with tiny figure"
  LS  → "wide shot, full body visible in environment"
  FS  → "full body shot, head to toe"
  MS  → "medium shot, waist up"
  MCU → "medium close-up, chest up"
  CU  → "close-up portrait, face filling frame"
  ECU → "extreme close-up, eyes only" / "extreme close-up, hands detail"
  INSERT → "detail shot, isolated object"

角度映射:
  EYE   → "eye level, straight on"
  HIGH  → "high angle, looking down"
  LOW   → "low angle, looking up, heroic"
  BIRD  → "bird's eye view, overhead shot, top-down"
  WORM  → "worm's eye view, ground level looking up"
  DUTCH → "dutch angle, tilted frame, 15 degrees"
  OTS   → "over the shoulder shot"
  POV   → "first person view, point of view shot"
```

**段2: 主体描述**
```
从角色档案提取:
  性别、年龄、发型、服装、显著特征
  当前表情/情绪（从节拍类型推断）

节拍类型→表情映射:
  行动节拍 → 专注、决断
  反应节拍 → 惊讶、恐惧、思考、愤怒（取决于上下文）
  揭示节拍 → 震惊、顿悟
  转折节拍 → 困惑→决心
  张力节拍 → 紧张、不安、警觉
  释放节拍 → 疲惫、释然
  过渡节拍 → 中性、日常
```

**段3: 动作/姿态**
```
从节拍内容和调度提取:
  角色在做什么？
  手的位置？（握笔、绞袖子、握拳、抱臂）
  身体朝向？（面向镜头、侧身、背对）
  与其他角色的空间关系？

Proxemics→姿态:
  亲密区 → "leaning close, faces almost touching"
  个人区 → "standing close, having private conversation"
  社交区 → "sitting across a desk, formal posture"
  公共区 → "standing alone in empty room, isolated"
```

**段4: 环境/背景**
```
从场景信息和深度分层提取:
  FG (前景): 模糊的前景元素（门框、植物、家具边缘）
  MG (中景): 主要场景空间
  BG (背景): 远景环境、窗外景象、墙壁装饰

景深映射:
  浅焦 → "shallow depth of field, bokeh background"
  深焦 → "deep focus, everything sharp"
  焦点转移 → "focus on [subject], [other] blurred"
```

**段5: 光线/色彩/氛围**
```
色温映射 T_color → 提示词:
  3200K (warm) → "warm golden light, amber tones, cozy atmosphere"
  4800K (neutral-warm) → "natural warm light, soft shadows"
  5600K (daylight) → "natural daylight, neutral colors"
  7500K (cool) → "cool blue-tinted light, cold atmosphere"
  9000K (cold) → "cold steel blue light, desaturated, clinical"

Key Ratio映射:
  2:1 (低对比) → "soft even lighting, fill light"
  4:1 (中对比) → "dramatic lighting, visible shadows"
  8:1+ (高对比) → "chiaroscuro, deep shadows, noir lighting"

光源方向:
  正面 → "frontal lighting, flat"
  侧光 → "side lighting, half face in shadow, split lighting"
  逆光 → "backlit, silhouette, rim light"
  底光 → "underlit, horror lighting, dramatic shadows from below"
  顶光 → "overhead lighting, eye socket shadows"

氛围关键词（从 genre-libraries.md 提取）:
  psychological → "unsettling, eerie calm, something is wrong"
  noir → "smoky, rain-soaked, neon reflections, venetian blind shadows"
  procedural → "sterile, clinical, fluorescent, institutional"
  horror → "ominous, dark corners, barely visible, dread"
  k_thriller → "geometric, pristine surfaces, class divide visible"
  art_house → "contemplative, painterly, natural light, poetic"
```

**段6: 风格/技术参数**
```
画面风格:
  "cinematic still, film grain, 35mm photography"
  "storyboard panel, pencil sketch, black and white"
  "cinematic concept art, digital painting"
  "photorealistic, movie screenshot, anamorphic lens"

分辨率/比例:
  "16:9 widescreen" (电影标准)
  "2.39:1 anamorphic" (宽银幕)
  "4:3 academy ratio" (经典/复古)
  "1:1 square" (分镜面板)

附加技术词:
  运动模糊 → "motion blur in direction of [movement]"
  胶片质感 → "Kodak Portra 400, film grain, slight color shift"
  数字感 → "RED camera, ultra sharp, high dynamic range"
```

---

## 三、转换算法

### 输入
一个镜头设计卡（/shot 或 /board 的输出）

### 处理

```
function generateImagePrompt(shot, character_db, scene_info, style_preset):

  // 段1: 镜头类型
  framing = SHOT_SIZE_MAP[shot.shot_size] + ", " + ANGLE_MAP[shot.camera_angle]

  // 段2: 主体
  character = character_db[shot.主要角色]
  expression = BEAT_EXPRESSION_MAP[shot.beat_type](shot.context)
  subject = f"{character.description}, {expression}"

  // 段3: 动作
  action = extractAction(shot.构图要点, shot.blocking_notes)

  // 段4: 环境
  environment = buildEnvironment(shot.composition.foreground,
                                  shot.composition.midground,
                                  shot.composition.background,
                                  scene_info)
  dof = DOF_MAP[shot.depth_of_field_choice]

  // 段5: 光线/色彩
  color_temp = T_COLOR_MAP[composition_staging.T_color(shot.threat_level)]
  key_ratio = KEY_RATIO_MAP[shot.light_contrast]
  light_dir = LIGHT_DIR_MAP[shot.light_source_direction]
  atmosphere = GENRE_ATMOSPHERE[style_preset.genre]

  // 段6: 风格
  style = style_preset.image_style + ", " + style_preset.aspect_ratio

  // 组合
  prompt = f"{framing}, {subject}, {action}, {environment}, {dof}, {color_temp}, {key_ratio}, {light_dir}, {atmosphere}, {style}"

  // 负面提示词
  negative = buildNegative(shot, style_preset)

  return { prompt, negative, aspect_ratio, seed_hint }
```

---

## 四、景别专项提示词模式

### ELS / 大远景

```
模板:
  "extreme wide shot, [环境全貌], tiny [角色描述] [位置],
   [天气/时间], [氛围], cinematic landscape photography,
   [色调], 16:9 widescreen"

示例（Mirror Visitor ch1 开场）:
  "extreme wide shot, urban apartment building at night,
   single lit window on the fifth floor, rain-slicked streets below,
   cold blue moonlight, lonely atmosphere, distant city lights,
   cinematic photography, desaturated teal and amber,
   anamorphic lens flare, 2.39:1"

关键: 角色要很小（<5%画面），环境要主导
```

### CU / 特写

```
模板:
  "close-up portrait, [角色面部细节], [表情/情绪],
   [光线方向+质量], [背景模糊], [肤色质感],
   shallow depth of field, cinematic, [色调]"

示例（叶知秋听到关键台词的反应）:
  "close-up portrait, Chinese woman in her thirties,
   short professional hair, expression of controlled shock,
   eyes slightly widened, jaw tightening,
   side lighting from window, half face in warm shadow,
   blurred office background with bookshelf,
   shallow depth of field, f/1.8, cinematic film grain,
   warm-to-cool color transition, Kodak Portra"

关键: 面部占满画面，表情是信息核心，背景要虚
```

### INSERT / 插入镜头

```
模板:
  "extreme close-up detail shot, [物件描述],
   [物件状态/特征], [表面质感], [光线],
   shallow depth of field, macro photography, [色调]"

示例（帽衫特写）:
  "extreme close-up, grey hoodie hanging on coat hook,
   casual fabric texture, wrinkled, next to dark formal coat,
   stark contrast between casual and professional,
   warm interior light from hallway, soft shadows,
   shallow depth of field, the hoodie in sharp focus,
   slightly desaturated, cinematic still life, 16:9"

关键: 物件是唯一焦点，质感要清晰，背景极度虚化
```

### OTS / 过肩镜头

```
模板:
  "over the shoulder shot, [前景角色] in soft focus foreground,
   [背景角色] in focus, [表情/动作], [环境],
   [光线], medium depth of field, cinematic, [色调]"

示例（咨询室对话）:
  "over the shoulder shot, dark-haired woman's shoulder and
   neck in soft focus foreground left, facing Chinese woman
   therapist in focus sitting in office chair, attentive
   listening expression, warm office interior with diplomas
   on wall, afternoon window light, natural skin tones,
   medium depth of field, cinematic 35mm, warm amber tones"
```

---

## 五、隐喻的视觉化

visual-metaphor.md 的 M01-M28 需要转化为可见的画面元素：

```
M04 镜像=双重性:
  → "reflection in mirror showing slightly different expression"
  → "face and mirror reflection, subtle asymmetry"

M05 门=选择:
  → "character standing before open doorway, light streaming through"
  → "closed door, character's hand on doorknob, hesitating"

M06 窗=真相:
  → "character looking through rain-streaked window"
  → "truth visible through glass, distorted by water droplets"

M08 笼=困囿:
  → "character framed by vertical bars, window frames, or door frame"
  → "tight framing with architectural elements creating visual cage"

M09 楼梯=权力:
  → "character ascending stairs, shot from below, empowering angle"
  → "character descending stairs, overhead shot, diminishing"

M12 走廊=必然:
  → "long corridor with converging perspective lines, figure at end"
  → "narrow hallway, one-point perspective, no exits visible"

M19 对称=控制:
  → "perfectly symmetrical composition, Kubrick-style one-point perspective"
  → "symmetry broken by one element slightly off-center"
```

---

## 六、批量生成模式

### 整场景批量

```
/visualize --scene <场景> --format <sd|dalle|mj|fal>

对分镜序列中的每个镜头生成一条提示词。
输出: 编号列表，每条包含 prompt + negative + 参数

格式适配:
  nb2  → Nano Banana 2 格式（自然语言创意简报，默认推荐）
  gemini → Gemini API / Vertex AI（同 nb2 提示词，不同API参数）
  sd   → Stable Diffusion 格式（prompt, negative_prompt, steps, cfg, sampler）
  dalle → DALL-E 格式（prompt, size, quality, style）
  mj   → Midjourney 格式（prompt --ar --s --q）
  fal  → fal.ai 格式（prompt, negative, image_size, num_inference_steps）
```

### 关键帧模式

```
/visualize --keyframes <场景>

不为每个镜头生成，只为关键帧（重力≥3的节拍）生成。
减少图像数量但覆盖核心叙事时刻。
```

### 风格一致性种子

```
/visualize --consistent

在批量生成中:
  - 同一角色的面部描述保持完全一致
  - 同一场景的环境描述保持一致
  - 色调随 T_color() 变化但保持连贯
  - 输出 seed 建议用于保持角色一致性
```

---

## 七、适配器层（SDL → 模型格式）

适配器是**薄层转换**——它不改变内容，只改变表达方式。
添加新模型只需写一个新适配器，SDL和分镜逻辑完全不受影响。

### 适配器接口

```
function adapt(sdl: SDL, config: AdapterConfig): ModelPayload

输入: SDL对象 + 适配器配置（模型参数、API密钥等）
输出: 模型特定的API payload

每个适配器必须处理:
  1. prompt生成: SDL → 该模型理解的提示词格式
  2. 引用解析: @/# → 该模型的参考图传递方式
  3. 参数映射: SDL.aspect_ratio → 模型的尺寸参数
  4. 排除项: 该模型不需要的SDL字段直接忽略
```

### Adapter: Nano Banana 2 / Gemini

```
策略: SDL → 自然语言创意简报

转换方式:
  将SDL的6个语义段拼接为一段流畅的自然语言描述。
  NB2理解意图和情感，所以 mood 和 symbolism 应展开为叙事性描述。

引用处理:
  @ → reference_image (NB2支持最多5人同时)
  # → 融入prompt文字描述 (NB2的世界知识足够理解场景)
       如有参考图 → 附加为额外reference

特殊能力:
  - 文字渲染: SDL中如果有文字元素 → 直接写入prompt
  - 会话编辑: 生成后可用自然语言修改 "make the shadows deeper"

API payload:
  {
    model: "gemini-2.0-flash-preview-image-generation",
    prompt: "[自然语言简报]",
    config: { aspect_ratio: sdl.aspect_ratio, output_mime_type: "image/png" },
    reference_images: [resolved @refs]
  }
```

### Adapter: Stable Diffusion / ComfyUI

```
策略: SDL → 关键词+短语堆砌

转换方式:
  将SDL的每个字段转为关键词短语，逗号连接。
  mood/symbolism 转为氛围关键词而非叙事描述。
  必须生成 negative_prompt。

引用处理:
  @ → IP-Adapter 参考图输入 (面部一致性)
  # → ControlNet 参考图 或 img2img 参考

必须附加: negative_prompt (从SDL.mood反推排除词)

API payload:
  {
    prompt: "[关键词, 关键词, 关键词]",
    negative_prompt: "[排除词]",
    width/height: 从 sdl.aspect_ratio 计算,
    steps: 30, cfg_scale: 7.5, sampler: "DPM++ 2M Karras"
  }
```

### Adapter: DALL-E

```
策略: SDL → 简洁自然语言 (比NB2更直接)

转换方式:
  类似NB2但更简洁——DALL-E不需要情感铺垫。
  直接描述画面内容。

引用处理:
  @/# → 全部展开为文字描述 (DALL-E不支持参考图)

API payload:
  { prompt: "[描述]", size: "1792x1024", quality: "hd", style: "natural" }
```

### Adapter: Midjourney

```
策略: SDL → 关键词+短语 + MJ参数

转换方式:
  类似SD但更偏艺术指导风格。
  MJ理解构图指令 (如 "shot from below", "bird's eye view")。

引用处理:
  @/# → --cref (角色参考) / --sref (风格参考)

格式: [提示词] --ar 16:9 --s 250 --q 2 --v 6.1
```

### Adapter: fal.ai (Story Platform)

```
策略: SDL → fal.ai API格式

转换方式:
  prompt用自然语言 (类似NB2)。
  引用通过 reference_images 数组传递。

引用处理:
  @/# → reference_images[]: { url, role: "subject"|"background" }
  URL通过 Story Platform asset-os 签名URL解析。

API payload:
  {
    prompt: "[自然语言]",
    negative_prompt: "[排除词]",
    image_size: "landscape_16_9",
    num_inference_steps: 28,
    guidance_scale: 7.5,
    reference_images: [resolved refs]
  }
```

### 添加新模型的适配器

```
当出现新的图像生成模型时:

1. 确定模型的提示词风格:
   自然语言？关键词？结构化？

2. 确定参考图传递方式:
   API参数？URL嵌入？不支持？

3. 确定是否需要排除词:
   需要negative_prompt？还是模型自行处理？

4. 写适配器:
   function adaptToNewModel(sdl):
     prompt = 按模型风格组合SDL字段
     refs = 按模型方式传递@/#引用
     params = 模型特定的技术参数
     return { prompt, refs, params }

5. 注册到 /visualize --format <新模型名>

SDL完全不需要修改。分镜逻辑完全不需要修改。
```

---

## 八、排除描述库

排除描述是**某些适配器需要的附加信息**（SD需要negative_prompt，NB2/DALL-E通常不需要）。
存储在SDL中作为可选字段，适配器按需使用。

### 通用排除

```
text, watermark, signature, logo,
blurry, out of focus (unless sdl.depth.focus == "shallow"),
deformed, ugly, bad anatomy, extra fingers, extra limbs,
low quality, jpeg artifacts, pixelated,
cartoon, anime, illustration (unless style == "storyboard_sketch"),
oversaturated, HDR look (unless specified)
```

### 类型专用排除（从 genre-libraries.md 自动提取）

```
psychological_thriller: + "happy, bright, cheerful, colorful, vibrant"
noir:                   + "daylight, bright colors, modern, clean, sterile"
procedural:             + "dramatic lighting, artistic, stylized, fantasy"
horror:                 + "safe, cozy, warm, inviting, friendly"
k_thriller:             + "messy, chaotic, random, unstructured"
art_house:              + "generic, stock photo, commercial, polished, perfect"
```

---

## 九、引用解析器（Resolver）

引用解析是独立于适配器的。@/# 如何变成实际的URL/描述，取决于使用什么 resolver。

### Resolver 接口

```
interface AssetResolver {
  resolveCharacter(ref: "@角色名", variant?: string):
    → { url: string | null, description: string }
  resolveAsset(ref: "#场景或物件名", variant?: string):
    → { url: string | null, description: string }
}
```

### 内置 Resolver 实现

```
1. LocalFileResolver（本地模式，默认）
   @角色名 → 读取 projects/{project}/characters.md → 提取外貌描述
   #场景名 → 读取 projects/{project}/structure.md → 提取场景描述
   返回 description（文字展开），url 为 null

2. StoryPlatformResolver（Story Platform 在线模式，示例）
   @角色名 → GET /characters?name={name} → portrait_asset_id → signed URL
   #场景名 → GET /locations?name={name} → background_asset_id → signed URL
   返回 url + description

3. 自定义 Resolver（用户可扩展）
   任何系统只要实现 resolveCharacter/resolveAsset 接口
   即可接入——Notion数据库、本地图片文件夹、其他AI平台资产库等
```

### Resolver + Adapter 的组合

```
/visualize 的完整管线:

  分镜参数
    ↓
  SDL 生成（模型无关）
    ↓
  Resolver 解析 @/# 引用（平台无关）
    ↓
  Adapter 转换为模型格式（模型特定）
    ↓
  API 调用 / 本地文件输出

三个步骤互相独立:
  换模型 → 只换 Adapter
  换平台 → 只换 Resolver
  换分镜逻辑 → 只改 SDL 生成
```

### 示例：Story Platform 管线

```
这只是一个具体实现的例子，不是唯一的方式:

  /decompose → /board --format json → /visualize --resolver story-platform --format fal
  → SDL 生成
  → StoryPlatformResolver 解析 @/# → signed URLs
  → fal Adapter 组装 API payload
  → generation.create_image { prompt, reference_images }
  → 生成图像关联到 story_node.background_asset_id
```

---

## 十、示例：Mirror Visitor ch1 — SDL + 适配器输出

每个镜头展示: **SDL**（模型无关） → **适配器输出**（模型特定）。

### Shot 6 — 核心揭示：林小曼的话

**SDL（模型无关的中间表征）**:
```json
{
  "shot_id": 6,
  "framing": { "size": "CU", "angle": "EYE" },
  "subject": {
    "characters": [{
      "ref": "@林小曼", "variant": "恐惧",
      "description": "young Chinese woman, mid-twenties, light makeup, dark circles",
      "expression": "deep fear mixed with desperate hope",
      "body": "sitting on sofa, hands twisting coat sleeve",
      "facing": "toward camera"
    }]
  },
  "environment": {
    "location_ref": "#咨询室",
    "description": "therapy office, bookshelves, diplomas",
    "time": "afternoon",
    "midground": "subject on sofa",
    "background": "blurred bookshelves and window"
  },
  "depth": { "focus": "shallow", "aperture_equiv": "f/1.4" },
  "lighting": {
    "color_temp_k": 4800, "key_ratio": "3:1",
    "direction": "side (window, left)",
    "special": "warm-to-cool transition across face"
  },
  "mood": {
    "primary": "fearful vulnerability with desperate hope",
    "genre_atmosphere": "psychological thriller"
  },
  "aspect_ratio": "16:9"
}
```

**→ NB2 Adapter 输出**:
```
A close-up portrait of @林小曼 sitting in #咨询室. She has put on
makeup today — unusual for her — but the foundation can't hide the
dark circles under her eyes. She looks directly at us with an
expression that mixes deep fear with desperate hope — the look of
someone who needs to be believed. Afternoon light from the office
window falls from the side, leaving half her face in warm light and
the other shifting toward cool shadow. Behind her, soft blurred
shapes of bookshelves and a diploma. This is the moment she says
the words that will change everything. Cinematic, psychological
thriller. 16:9.
```

**→ SD Adapter 输出**:
```
Prompt: close-up portrait, young Chinese woman, mid-twenties,
light makeup, dark circles, fearful hopeful expression, looking
at camera, side lighting from window, warm-to-cool face transition,
therapy office background, blurred bookshelves, shallow depth of
field f/1.4, cinematic, psychological thriller atmosphere, 16:9
Negative: happy, smiling, bright even lighting, studio portrait,
text, watermark, cheerful, vibrant
```

**→ MJ Adapter 输出**:
```
close-up portrait of a young Chinese woman with fearful hopeful
expression, dark circles under light makeup, side window lighting
creating warm-cool face split, blurred therapy office background,
cinematic psychological thriller --ar 16:9 --s 250 --q 2 --v 6.1
```

注意：**三个输出描述的是同一个画面**，只是表达方式不同。
SDL 是源头，适配器是翻译层。换模型只需换适配器。

### Shot 1 — 建立：公寓外景

**SDL**:
```json
{
  "shot_id": 1,
  "framing": { "size": "ELS", "angle": "EYE" },
  "subject": { "characters": [] },
  "environment": {
    "location_ref": "#叶知秋公寓.夜",
    "description": "urban apartment building, single lit window, wet streets",
    "time": "night", "weather": "after rain"
  },
  "lighting": { "color_temp_k": 7500, "direction": "moonlight from above" },
  "mood": { "primary": "profound urban loneliness", "genre_atmosphere": "psychological thriller" },
  "aspect_ratio": "2.39:1"
}
```

**→ NB2**: "A cinematic establishing shot of #叶知秋公寓.夜. The building is dark except for one warm window. Wet streets reflect distant neon. The mood is profound urban loneliness. 2.39:1."

**→ SD**: `extreme wide shot, apartment building night, single warm window, wet streets, neon reflections, cold blue moonlight, lonely, desaturated teal amber, anamorphic, 2.39:1` / Neg: `daylight, crowds, bright colors, text`

### Shot 7 — 反应：叶知秋的震动

**SDL**:
```json
{
  "shot_id": 7,
  "framing": { "size": "ECU", "angle": "EYE" },
  "subject": {
    "characters": [{
      "ref": "@叶知秋", "variant": "震惊",
      "expression": "controlled shock, composure cracking, pupils dilating, jaw tightening"
    }]
  },
  "depth": { "focus": "very shallow", "aperture_equiv": "f/1.2" },
  "lighting": { "color_temp_k": 6500, "direction": "side", "key_ratio": "5:1" },
  "mood": { "primary": "controlled devastation", "genre_atmosphere": "psychological thriller, intimate" },
  "aspect_ratio": "16:9"
}
```

**→ NB2**: "An extreme close-up of @叶知秋.震惊. Only her eyes, nose bridge, and jaw visible. Something has shaken her to her core but she's a professional — what we see is the microsecond before composure reasserts. Side light emphasizes every contour. Background dissolved to pure darkness. Controlled devastation. 16:9."

**→ SD**: `extreme close-up, Chinese woman thirties, professional short hair, controlled shock, widened eyes, jaw tightening, side lighting, very shallow dof, dark blurred background, cool desaturated, cinematic psychological thriller, 16:9` / Neg: `smiling, relaxed, bright lighting, full body, text`
