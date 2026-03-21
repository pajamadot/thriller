# 分镜图像提示词生成系统

> 将分镜技术参数转化为 AI 图像生成提示词（Stable Diffusion / DALL-E / Midjourney / fal.ai）
> 每个镜头 → 一张分镜面板图 → 一条结构化提示词

---

## 一、核心问题

分镜表描述的是**电影语言**（景别、角度、运动、声音），
但图像生成AI理解的是**视觉描述语言**（构图、光线、色彩、主体、风格）。

```
转换映射:

  景别 (CU/MS/LS...)     → 主体在画面中的占比 + 可见身体部位
  角度 (HIGH/LOW/DUTCH...)→ 视角描述 + 透视变形
  构图 (三分法/引导线...) → 主体位置 + 背景布局
  色温 T_color()          → 色彩关键词 + 光源描述
  深度 (FG/MG/BG)        → 景深描述 + 前后景模糊度
  隐喻 (M01-M28)         → 象征元素的视觉呈现
  运动 (PUSH/TRACK...)   → 运动模糊方向 + 动态构图暗示
  声音                    → 不转换（图像无法表达，但影响氛围词）
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

## 三、提示词结构模板

### 通用结构（6段式）

```
[1. 镜头/画面类型] [2. 主体描述] [3. 动作/姿态] [4. 环境/背景] [5. 光线/色彩/氛围] [6. 风格/技术参数]
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

## 七、格式适配器

### Nano Banana 2 / Gemini（推荐，2026主流）

Nano Banana 2 (Google Gemini 3.1 Flash Image) 是当前最主流的图像生成模型。
与 SD/MJ 的关键词堆砌不同，NB2 使用**自然语言创意简报**风格。

**提示词风格差异**:
```
SD/MJ风格（关键词堆砌，不推荐）:
  "close-up portrait, Chinese woman, side lighting, bokeh, 35mm, f/1.4, cinematic"

NB2风格（自然语言简报，推荐）:
  "A cinematic close-up of a Chinese woman therapist in her thirties,
   captured in the warm afternoon light of her office. The light falls
   from the side window, leaving half her face in shadow — suggesting
   she carries a secret. Her expression is one of controlled professional
   composure barely containing shock. The background blurs into soft
   shapes of bookshelves and diplomas. The overall mood is elegant but
   deeply unsettling, like something is about to break."
```

**NB2 提示词最佳实践**:
```
1. 像写创意总监的指示，不像给搜索引擎的关键词
2. 描述意图和情感，不仅是视觉元素
   ✗ "warm lighting, amber tones"
   ✓ "The warm amber light feels like the last moment of safety before everything changes"
3. 利用NB2的世界知识——可以引用真实地点、文化细节
   "A therapy office in a modern Chinese city, the kind with IKEA furniture
    and diplomas from both Chinese and Western universities on the wall"
4. 角色一致性：NB2可同时维持最多5个角色的一致外观
   用 @角色名 引用 → 解析为 reference_image → 保持面部一致
5. 文字渲染：NB2可以在画面中生成清晰文字
   "A notebook page with the handwritten name '周明哲' circled in red"
6. 用自然语言编辑已生成的图像
   "Make the shadows deeper and the color palette colder"
7. 双符号引用: @ 人物 / # 非人物
   "@叶知秋 in #咨询室 noticing #帽衫"
   → @ 解析为角色参考图（面部一致性）
   → # 解析为场景/物件参考图或文字描述
```

**Gemini API 格式**:
```python
# Google AI Studio / Vertex AI
from google import genai

client = genai.Client()
response = client.models.generate_images(
    model='gemini-2.0-flash-preview-image-generation',
    prompt='[自然语言创意简报]',
    config=genai.types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio='16:9',
        output_mime_type='image/png',
    )
)
```

**NB2 分镜提示词模板**:
```
镜头{N}——{节拍类型}：{节拍内容概要}

[创意简报描述，包含:]
- 画面构图和主体位置（从景别/角度转换）
- 人物的情感状态和意图（从节拍上下文推断）
- 光线和色彩的情感含义（从T_color和类型库转换）
- 环境的叙事功能（从深度分层和隐喻转换）
- 整体情绪/氛围（一句话总结这个镜头要传达什么感受）

画面比例：16:9 宽银幕
风格参考：电影剧照，{类型}风格
```

---

### Stable Diffusion / ComfyUI

```json
{
  "prompt": "[正面提示词——关键词+短语堆砌]",
  "negative_prompt": "text, watermark, signature, blurry, deformed, ugly, bad anatomy, extra limbs, low quality, jpeg artifacts",
  "width": 1344,
  "height": 768,
  "steps": 30,
  "cfg_scale": 7.5,
  "sampler": "DPM++ 2M Karras",
  "model": "realvisxl_v4"
}
```

### DALL-E 3

```json
{
  "prompt": "[自然语言描述，类似NB2但更简洁]",
  "size": "1792x1024",
  "quality": "hd",
  "style": "natural"
}
```

### Midjourney

```
[提示词] --ar 16:9 --s 250 --q 2 --v 6.1
```

### fal.ai (Story Platform 集成)

```json
{
  "prompt": "[正面提示词]",
  "negative_prompt": "[负面提示词]",
  "image_size": "landscape_16_9",
  "num_inference_steps": 28,
  "guidance_scale": 7.5,
  "model": "fal-ai/flux-pro/v1.1"
}
```

---

## 八、负面提示词库

### 通用负面

```
text, watermark, signature, logo,
blurry, out of focus (unless intentional bokeh),
deformed, ugly, bad anatomy, extra fingers, extra limbs,
low quality, jpeg artifacts, pixelated,
cartoon, anime, illustration (unless storyboard sketch mode),
oversaturated, HDR look (unless specified)
```

### 类型专用负面

```
psychological_thriller:
  + "happy, bright, cheerful, colorful, vibrant"

noir:
  + "daylight, bright colors, modern, clean, sterile"

procedural:
  + "dramatic lighting, artistic, stylized, fantasy"

horror:
  + "safe, cozy, warm, inviting, friendly"

k_thriller:
  + "messy, chaotic, random, unstructured"

art_house:
  + "generic, stock photo, commercial, polished, perfect"
```

---

## 九、与 Story Platform 的集成

```
/visualize --format fal → 输出可直接用于 generation worker

映射:
  prompt → generation.create_image { prompt }
  negative → generation.create_image { negative_prompt }
  角色参考 → generation.create_image { reference_image_url: character.portrait }

批量工作流:
  /decompose → /board --format json → /visualize --format fal
  → 为每个镜头生成 fal.ai API 调用
  → 生成的图像自动关联到 story_node.background_asset_id
```

---

## 十、示例：Mirror Visitor ch1 关键帧提示词

每个镜头提供两种格式：NB2（推荐）和 SD（兼容）。

### Shot 1 — 建立：公寓外景

**NB2 (Nano Banana 2)** — 带 @/# 引用:
```
A cinematic establishing shot of #叶知秋公寓.夜 at night. The building
is dark and ordinary, except for one window on an upper floor that glows
with warm amber light — the only sign of life. The streets below are wet
from recent rain, creating faint reflections of distant neon signs. The
mood is one of profound urban loneliness — this is a person who lives
alone and the city doesn't notice. Cool blue moonlight dominates, with
that single warm window as the only counterpoint. Widescreen 2.39:1,
shot as if from a film by David Fincher — precise, cold, quietly ominous.

引用: #叶知秋公寓.夜 → background reference
```

**SD (Stable Diffusion)**:
```
Prompt: extreme wide shot, urban apartment building at night,
single warm lit window, wet rain-slicked streets, neon reflections,
cold blue moonlight, lonely atmosphere, desaturated teal and amber,
cinematic photography, anamorphic lens, film grain, 2.39:1
Negative: daylight, crowds, busy street, text, watermark, bright colors
```

### Shot 4 — 揭示：帽衫

**NB2**:
```
A detail shot of something that doesn't belong. A grey casual hoodie
hangs on a coat hook in a hallway, right next to a woman's dark formal
coat. The contrast between the two garments tells a story — the coat
belongs here, the hoodie does not. Who left it? The warm hallway light
casts gentle shadows, and the hoodie is in sharp focus while the
background blurs softly. The image feels like a clue in a mystery — an
everyday object that has become evidence. The overall tone is quietly
unsettling, like discovering a stranger's belongings in your own home.
Cinematic still life, 16:9.
```

**SD**:
```
Prompt: detail shot, grey hoodie on coat hook, next to dark formal coat,
warm hallway light, shallow depth of field, hoodie in sharp focus,
slightly desaturated, cinematic still life, subtle unease, 16:9
Negative: bright, cheerful, colorful, text, person visible, watermark
```

### Shot 6 — 核心揭示：林小曼的话

**NB2**:
```
A close-up portrait of @林小曼, sitting in #咨询室. She has put on makeup today — unusual
for her — but the foundation can't hide the dark circles under her eyes.
She is looking directly at us (her therapist) with an expression that
mixes deep fear with desperate hope — the look of someone who needs to
be believed. The afternoon light from the office window falls from the
side, leaving one half of her face in warm light and the other beginning
to shift toward cooler shadow. Behind her, the office blurs into soft
shapes — bookshelves, a diploma. This is the moment she says the words
that will change everything. The camera is close enough to see her lip
tremble. Cinematic, emotional, shot like a psychological thriller — the
kind of frame where you lean forward in your seat. 16:9.
```

**SD**:
```
Prompt: close-up portrait, young Chinese woman, light makeup, dark circles,
fearful hopeful expression, side lighting, warm-to-cool face transition,
blurred therapy office, shallow depth of field f/1.4, cinematic, 16:9
Negative: happy, smiling, bright even lighting, studio portrait, text
```

### Shot 7 — 反应：叶知秋的震动

**NB2**:
```
An extreme close-up of @叶知秋.震惊. We are so close we can only see her eyes,
nose bridge, and the tension in her jaw. Something has just been said
that has shaken her to her core — but she is a professional, a therapist,
and she cannot show it. What we see is the micro-second before composure
reasserts itself: her eyes have widened just slightly, her pupils are
dilating, and the muscles along her jaw are tightening. The light comes
from the side, emphasizing every contour of this internal earthquake.
The background has dissolved into pure darkness. This is the face of
someone who has just realized that her worst professional nightmare may
be real. The mood is one of controlled devastation — psychological
thriller at its most intimate. Cool desaturated tones. 16:9.
```

**SD**:
```
Prompt: extreme close-up, Chinese woman, thirties, professional short hair,
controlled shock expression, widened eyes, jaw tightening, side lighting,
very shallow depth of field, dark blurred background, cool desaturated,
cinematic psychological thriller, film grain, 16:9
Negative: smiling, relaxed, bright lighting, full body, wide shot, text
```
