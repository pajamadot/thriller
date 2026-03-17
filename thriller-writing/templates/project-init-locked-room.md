# 密室推理项目模板

## /start 预设
```json
{
  "type": "密室推理",
  "workflow": "A-诡计优先",
  "clueStrategy": "空间逻辑",
  "knoxCheck": "全部10条 + 空间完整性检查",
  "scoringWeights": {
    "suspense": 1.0, "clues": 1.5, "character": 0.8,
    "pacing": 1.0, "logic": 1.5, "literary": 0.8
  },
  "suspectCount": "4-6",
  "recommended": {
    "pov": "第三人称有限",
    "tone": "冷硬写实 / 哥特暗黑",
    "opening": "谜题呈现（不可能状况直接展示）",
    "midpoint": "密室不是我们以为的那种密室",
    "reveal": "机制揭示 + 动机揭示（双层）",
    "diagrams": true
  }
}
```

## 必须提供的图表
- 建筑/房间平面图（第一幕结束前展示给读者）
- 人物位置时间线图（可选）
- 参照 impossible-crime.md + 绫辻行人空间设计
