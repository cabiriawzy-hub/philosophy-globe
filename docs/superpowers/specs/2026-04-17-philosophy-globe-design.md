# 哲学思想宇宙 · 设计规范

- 项目代号：`philosophy-globe`
- 日期：2026-04-17
- 参考交互形态：世界神话地图（小红书 @麻省理工Rui同学）

## 1. 项目目标

一个可交互的"思想宇宙"——用 **3D 地球仪 + 时间轴**，在地理和时间两个维度上可视化人类历史上最重要的哲学思想及其相互影响。

核心使用场景（按优先级）：

- **B · 探索/发现**（主）：像"思想版 Google Earth"，转一转看不同文明在同一时代在想什么。
- **A · 深度阅读**（辅）：点任意思想点 → 展开该思想的详细讲解（Markdown 长文）。
- **C · 参考查询**（自然满足）：搜索任意哲学家 / 概念 → 快速定位。

**非目标**：不是哲学百科全书、不是教科书、不做论文级严谨度。是"一眼能懂 + 越看越深"。

## 2. 核心决策

这些是 brainstorming 里已经敲定的约束，开工后不再回头讨论：

| 决策 | 结论 | 理由 |
|---|---|---|
| 可视化主体 | 3D 地球仪（不是平面地图） | 用户明确要"酷炫的三维地球仪效果" |
| 数据原子 | **思想**，不是哲学家 | "可视化所有重要哲学思想"；也让密度接近参考图的 3002 stories |
| 标记视觉 | Emoji 密集点（复刻参考图） | 用户选定 |
| 视觉风格 | 深色地球 + 点阵网格 + emoji 光晕 | 参考图气质 |
| 交互形态 | 复刻"世界神话地图"：顶部概念 chips、右侧传统列表、底部时代 filter、Labels/Lines 开关 | 用户明确参考 |
| 数据来源 | LLM 生成 + Wikipedia 交叉校验 + 人工抽审 | 用户接受 |
| 技术栈 | Vite + React + TS + react-globe.gl + Zustand | 纯静态 |
| 后端 | 无。静态 JSON + Markdown | 部署简单 |
| 部署 | Vercel（免费层，GitHub 自动部署） | 用户要公网分享 |
| 分期 | P1 骨架 → P6 打磨，每期可独立发布 | 用户可接受慢慢补 |

## 3. 数据模型

### 3.1 Thought（思想点 —— 地图上的 emoji 点）

**关键：思想是原子单位，不是哲学家。** 一个哲学家对应多个思想点。

例：康德在柯尼斯堡的地理位置上分布 5 个点：

- ⚖️ 定言令式（1785）
- 🧠 先天综合判断（1781）
- 🌌 物自体（1781）
- 🎨 判断力批判（1790）
- 🕊️ 永久和平论（1795）

这样：150 哲学家 × 平均 4~6 思想 ≈ **600~900 思想点**，密度与参考图（3002 stories）同量级。

```ts
type ThoughtId = string // slug-case, 例: 'kant-categorical-imperative'

interface Thought {
  id: ThoughtId
  emoji: string                // 地图上显示的 emoji（跟随主概念）
  name: { zh: string; en: string }
  philosopherId: PhilosopherId
  year: number                 // 主要提出 / 成文年份
  location: { lat: number; lng: number; placeName: string }
  conceptIds: ConceptId[]      // 主概念 + 次概念
  traditionId: TraditionId
  eraId: EraId
  shortDescription: string     // 50~100 字，hover 卡片
  longDescription: string      // Markdown 长文，详情抽屉 & 阅读模式
  keyQuote?: { text: string; source: string }
  tier: 1 | 2 | 3              // MVP 必选 / 重要 / 补全
}
```

### 3.2 Philosopher

```ts
interface Philosopher {
  id: PhilosopherId
  name: { zh: string; en: string; native: string }
  birthYear: number
  deathYear: number
  primaryLocation: { lat: number; lng: number; placeName: string }
  traditionId: TraditionId
  portraitUrl?: string   // Wikipedia 公有域 / CC 肖像
  shortBio: string
  longBio: string        // Markdown
  tier: 1 | 2 | 3
}
```

### 3.3 Concept（核心概念 —— 顶部 chip）

```ts
interface Concept {
  id: ConceptId
  emoji: string          // 既是 chip 图标，也是 thought 默认 marker
  name: { zh: string; en: string }
  description: string
}
```

MVP 概念集（约 12 个）：

- ⚖️ 正义 / 道德
- 🧠 知识 / 认识论
- 🌌 存在 / 本体论
- 🗽 自由意志
- 🏛️ 政治 / 国家
- ❤️ 幸福 / 伦理生活
- 🎨 美 / 艺术
- ✝️ 神 / 宗教
- 🔥 语言 / 逻辑
- 📜 历史 / 辩证
- 🧘 自我 / 心灵
- ⚒️ 劳动 / 实践

### 3.4 Tradition（传统 / 学派 —— 右侧列表，对应参考图的 Countries）

```ts
interface Tradition {
  id: TraditionId
  name: { zh: string; en: string }
  color: string          // 右侧条形图 & 聚焦高亮色
  region: string         // 起源区域描述
  emergenceYear: number  // 大致兴起年代
  description: string
}
```

MVP 传统集（约 20 个）：古希腊哲学、希腊化（斯多葛 / 伊壁鸠鲁 / 怀疑主义）、经院哲学、欧陆理性主义、英国经验主义、德意志观念论、功利主义、实证主义、马克思主义、生命哲学、现象学、存在主义、分析哲学、实用主义、批判理论、后结构主义、先秦儒家、道家、印度哲学（吠檀多 / 佛教 / 耆那）、日本禅宗、伊斯兰哲学（Kalam / 法尔萨法）。

### 3.5 Era（时代 —— 底部快捷 filter）

```ts
type EraId =
  | 'axial'         // 轴心时代  -800 ~ -200
  | 'classical'     // 古希腊罗马 -600 ~ 500
  | 'medieval'      // 中世纪    500 ~ 1400
  | 'early-modern'  // 早期现代  1400 ~ 1700
  | 'enlightenment' // 启蒙      1650 ~ 1800
  | 'modern'        // 现代      1800 ~ 1945
  | 'contemporary'  // 当代      1945 ~ now
```

### 3.6 Influence（思想间的影响边）

思想→思想，不是哲学家→哲学家（粒度更细，可读性更强）。

```ts
interface Influence {
  from: ThoughtId
  to: ThoughtId
  type: 'continues' | 'rebuts' | 'radicalizes' | 'synthesizes' | 'revives'
  confidence: 0 | 1 | 2   // 0 确定 / 1 较强 / 2 松散
  note?: string           // 简短理由，hover 弧线时显示
}
```

可视化：弧线颜色编码 type，粗细编码 confidence。

## 4. 视觉与交互

### 4.1 布局（复刻参考图）

```
┌────────────────────────────────────────────────────────────────┐
│  顶部 chips:  All | ⚖️ 正义 | 🧠 知识 | 🌌 存在 | ... | ⚙️     │
├───────────────────────────────────────────┬────────────────────┤
│                                           │  Traditions    🔍 │
│                                           │ ┌──────────────┐   │
│            3D 深色地球仪                  │ │ 古希腊   128 │█▉ │
│      (react-globe.gl + Three.js)          │ │ 儒家      96 │█▋ │
│                                           │ │ 德观念论  89 │█▋ │
│        emoji 密集点（按过滤状态亮暗）     │ │ 分析哲学  83 │█▋ │
│                                           │ │ ...           │   │
│      hover: "定言令式 · 康德 · 1785"      │ └──────────────┘   │
│                                           │                     │
├───────────────────────────────────────────┴────────────────────┤
│  底部:  All Eras | Axial | Classical | ...  Labels ⬤ · Lines ○│
│         [═══════════════════ time brush ═════════════════════] │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 视觉风格

- **地球**：深空黑 + 点阵网格叠加的深蓝球面（对应 Globe Style B · 深空极简）。大陆用 three-globe 的 dots layer 呈现，不贴真实卫星图。
- **标记**：Twemoji SVG 作为 three Sprite，始终朝向相机；带柔和光晕（drop-shadow + additive blending）。
- **字体**：中文思源宋体 Light（人文感）+ 拉丁 Inter。
- **配色**：底 `#05080f`、主 `#6aa9ff`、每个 Tradition 独立饱和色。

### 4.3 三层透明度（时间窗口）

| 位置 | 透明度 | 效果 |
|---|---|---|
| 时间窗口内 | 100% + 光晕 | 主角 |
| 窗口 ±50 年 | 50% | 时代晕染 |
| 窗外 | 10% | 远景星尘 |

### 4.4 关键交互

| 动作 | 反应 |
|---|---|
| Hover emoji | 黑底小卡片：「思想名 · 哲学家 · 年代」 |
| 点击 emoji | 右侧滑出 drawer：短描述 + 关键引语 + "阅读长文"按钮 |
| 点击"阅读长文" | 进入整页阅读模式（Markdown 渲染 + 目录） |
| 点击 concept chip | 只亮该 emoji 的点，其它降到 10% |
| 点击 tradition | 地球自动旋转到该传统发源地 + 该传统的点高亮 |
| 拖时间轴 brush | 实时更新所有点透明度 |
| Labels 开关 | 显示 / 隐藏思想名字文字 |
| Lines 开关 | 显示 / 隐藏影响弧线；选中一点时只画该点的影响链 |
| 搜索框 | 跨传统 / 哲学家 / 思想 / 概念模糊搜；点击结果自动飞抵 |

### 4.5 默认开场动画

首次加载：相机从宇宙拉近 → 地球缓慢自转 → 最终停在 60°E 视角，让轴心时代的希腊、波斯、印度、中国同框。3 秒内完成，可按 `Space` 跳过。

## 5. 技术架构

```
┌──────────────────────────────────────────────┐
│  Vite 5 + React 18 + TypeScript 5            │
├──────────────────────────────────────────────┤
│  3D:        react-globe.gl (Three.js)        │
│  状态:      Zustand                          │
│  样式:      CSS Modules + CSS 变量           │
│  时间轴:    D3-scale + 自研 brush            │
│  Markdown:  react-markdown + shiki           │
│  搜索:      Fuse.js                          │
├──────────────────────────────────────────────┤
│  静态数据（构建时打包）:                     │
│    /public/data/thoughts.json                │
│    /public/data/philosophers.json            │
│    /public/data/concepts.json                │
│    /public/data/traditions.json              │
│    /public/data/influences.json              │
│    /public/data/bios/{philosopherId}.md      │
│    /public/data/thoughts/{thoughtId}.md      │
├──────────────────────────────────────────────┤
│  部署: Vercel (GitHub 自动部署 + CDN)        │
└──────────────────────────────────────────────┘
```

**无后端。** 所有数据静态 JSON + Markdown，Vite build 时打包，Vercel CDN 分发。

### 5.1 为什么选 react-globe.gl

- 开箱即用的 3D 地球 + 封装好的 Three.js
- 原生支持 points / arcs / labels / custom objects 图层，正好对应 emoji 点 + 影响弧线 + 标签
- 支持自定义 globe 贴图（点阵风格可 override）
- 维护活跃，社区案例多（Neo4j、Observable、Uber）
- 性能：1500 点内流畅，MVP 不会超

### 5.2 Emoji 渲染方案

- **首选**：Twemoji SVG → THREE.Sprite，三维中始终正面朝相机
- **降级**：Canvas 绘制 emoji → THREE.CanvasTexture
- 选 Twemoji 因为：版权开源（CC-BY 4.0）、跨平台视觉一致、已 SVG 化

## 6. 开发分期

### P1 · 骨架（~ 半天，今日目标）

- Vite + React + TS 脚手架
- react-globe.gl 跑通深色地球
- 硬编码 10 个思想点（轴心时代：希腊 + 中国 + 印度 + 阿拉伯）
- hover tooltip 基础版
- 部署到 Vercel，拿到可分享预览 URL

**验收**：打开 URL 能看到转动的深色地球 + 10 个 emoji 点，hover 有卡片。

### P2 · 数据模型 & Tier 1 数据

- 所有 TypeScript 类型
- LLM 生成 Tier 1：约 80 个哲学家 / 约 400 个思想点
- 与 Wikipedia 交叉校验（年代、地点、学派）
- 人工抽审高影响节点（轴心时代 + 现代性核心）
- 搭 drawer 详情面板

### P3 · 时间轴 + 过滤器

- 底部 Era 快捷 filter + 可拖动 time window brush
- 顶部 concept chips
- 右侧 Tradition 列表（带条形量）
- Labels 开关

### P4 · 影响网络

- 采集 Tier 1 内影响边
- Lines 开关 + 弧线渲染
- 选中一点 → 只高亮该点的影响链（入边 + 出边）

### P5 · 层级缩放 / LOD

- 低缩放只显示 tier 1
- 放大逐级揭示 tier 2 / tier 3
- 密集区（欧洲 18~19 世纪）clustering

### P6 · 打磨

- 搜索
- 长文阅读模式 + 目录
- 移动端适配
- 开场动画

每一期都能独立发布，不会出现"没做完就不能看"的状态。

## 7. 数据生成 & 审阅

### Tier 分层

- **Tier 1（MVP，必看，~80 人 / ~400 思想）**：苏格拉底、柏拉图、亚里士多德、伊壁鸠鲁、芝诺（斯多葛）、奥古斯丁、阿奎那、笛卡尔、斯宾诺莎、莱布尼茨、洛克、休谟、康德、黑格尔、马克思、尼采、胡塞尔、海德格尔、维特根斯坦、萨特、福柯、罗尔斯；老子、庄子、孔子、孟子、荀子、墨子、韩非、王阳明；龙树、慧能、商羯罗；伊本·西那、伊本·鲁世德、加扎利……
- **Tier 2（广度，~300 人）**：每人 2~3 个思想点
- **Tier 3（深度，~1000 人）**：次要思想家、当代哲学

### 非西方平衡

Tier 1 强制约 **30% 非西方**，避免"西方中心 + 少量东方"。

### 流程（我来做，你抽审）

1. 按 Tier 1 清单，LLM 生成思想点 JSON
2. 交叉校验 Wikipedia（年代、地点、学派）
3. 影响边用 Wikipedia infobox + 学术二手资料标注
4. 我审 outlier（地点离谱、年代错、归类错）
5. 长文 Markdown 按模板生成，你抽 10% 审风格

## 8. 数据来源 & 归属

- **Natural Earth**（公有域）：地球底图边界数据
- **NASA Blue Marble**（公有域）：可选真实贴图模式
- **Wikipedia**（CC-BY-SA）：哲学家肖像 + 事实交叉校验（正文用自己的话重写，不直接搬）
- **Twemoji**（CC-BY 4.0）：emoji 标记
- **自生成**：中英双语简介、长文、影响网络标注

页脚必须有 attribution 链接。

## 9. 部署

- GitHub 仓库：`philosophy-globe`（public，MIT）
- Vercel 免费层：`main` 自动部署，拿到 `philosophy-globe.vercel.app` 分享 URL
- 无环境变量（纯静态）
- 预估包：< 2 MB JS + < 3 MB 数据 + < 5 MB 贴图（webp）

## 10. 开放风险

| 风险 | 应对 |
|---|---|
| 思想原子化的主观性（康德算 5 个还是 8 个？） | 原则："能被后人独立继承 / 反驳"才独立成点；边界情况长文里注明 |
| 影响网络的严谨性（学术争议） | `confidence` 字段 + hover 弧线显示 `note` 说明理由 |
| 地理归属的政治敏感性（老子生地、孔子年代） | 采主流学术共识，争议在长文里注明 |
| emoji 映射的贫乏（找不到好 emoji） | 概念层最多 15 个 emoji 覆盖所有思想，可接受"同主概念同 emoji" |
| 非西方平衡 | Tier 1 就强制 30% 非西方，不是"先做西方再补东方" |

## 11. 成功标准

- 打开 URL 3 秒内看到转动的深色地球 + 密集思想点
- 随意点一个点能读到一段讲得清楚的思想简介
- 拖时间轴能直观看到"轴心时代东西方同步爆发"
- 开 Lines 开关能看到"黑格尔 → 马克思 → 萨特"的影响链
- 分享给懂哲学的朋友不觉得外行、分享给不懂哲学的朋友能看懂

## 12. 下一步

spec 审过后 → 进入 `writing-plans` 产出 P1 的实施计划（逐步）→ 开工。
