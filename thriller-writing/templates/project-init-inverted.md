# 倒叙推理项目模板

## /start 预设
```json
{
  "type": "倒叙推理",
  "workflow": "C-结构优先",
  "clueStrategy": "侦探发现已知线索",
  "knoxCheck": "不适用（改为侦探推理链完整性检查）",
  "scoringWeights": {
    "suspense": 1.2, "clues": 0.8, "character": 1.2,
    "pacing": 1.2, "logic": 1.0, "literary": 0.8
  },
  "suspectCount": "N/A（犯人已知）",
  "recommended": {
    "pov": "双视角（犯人+侦探）交替 / 第三人称",
    "tone": "冷硬写实 / 黑色幽默",
    "opening": "犯人视角：完整展示犯罪过程",
    "midpoint": "侦探找到犯人计划的第一个破绽",
    "reveal": "犯人的完美计划如何崩塌"
  }
}
```

## 关键差异
- 无红鲱鱼（读者已知真相）
- 张力来自"侦探能否发现"而非"谁干的"
- 信息经济学反转：读者 90% → 侦探 5%→95%
- 参照 subtype-beatsheets.md 倒叙推理节拍
