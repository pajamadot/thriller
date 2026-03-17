# 本格推理项目模板

## /start 预设
```json
{
  "type": "本格推理",
  "workflow": "A-诡计优先",
  "clueStrategy": "公平解谜",
  "knoxCheck": "全部10条",
  "scoringWeights": {
    "suspense": 1.0, "clues": 1.5, "character": 0.8,
    "pacing": 1.0, "logic": 1.5, "literary": 0.8
  },
  "suspectCount": "5-8 (标准矩阵)",
  "recommended": {
    "pov": "第三人称有限 / 第一人称Watson型",
    "tone": "冷硬写实 / 日系清冷",
    "opening": "尸体开场 / 谜题呈现",
    "midpoint": "新的死亡 / 线索含义翻转",
    "reveal": "波洛式集合推理"
  }
}
```

## 关键参考文件
- `mystery-structure.md` → 本格节拍表
- `clue-design.md` → Knox 全部 + 公平性光谱(严格端)
- `impossible-crime.md` → 如涉及密室/不可能犯罪
- `subtype-beatsheets.md` → 本格 20 章节拍示例
- `knowledge-state.md` → 双读者验证(严格公平)
