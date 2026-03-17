# 社会派推理项目模板

## /start 预设
```json
{
  "type": "社会派推理",
  "workflow": "B-角色优先",
  "clueStrategy": "动机驱动",
  "knoxCheck": "#1,#2,#6 + 动机合理性检查",
  "scoringWeights": {
    "suspense": 1.0, "clues": 1.0, "character": 1.2,
    "pacing": 1.0, "logic": 1.0, "literary": 1.2
  },
  "suspectCount": "4-6 (标准矩阵)",
  "recommended": {
    "pov": "第三人称有限 / 多视角交替",
    "tone": "社会批判 / 文学沉郁",
    "opening": "日常断裂",
    "midpoint": "犯罪动机从个人升级为结构性/制度性",
    "reveal": "犯人自白 + 社会结构批判"
  }
}
```

## 关键参考文件
- `character-archetype.md` → 角色罗盘 + P.D. James "侦探小说即社会史"
- `mystery-structure.md` → 社会派结构变体
- `knowledge-state.md` → 竞争叙事("谁的版本是真相")
- `setting-atmosphere.md` → 空间作为社会隐喻
