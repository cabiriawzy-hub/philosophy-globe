# 哲学思想宇宙 · Philosophy Globe

用 3D 地球仪 + 时间轴，可视化人类历史至今的所有重要哲学思想。

**当前阶段：P1 · 骨架**（10 个轴心时代思想，hover 可见详情）

👉 在线演示：待 Vercel 部署后填入

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173

## 构建

```bash
npm run build
npm run preview
```

## 测试

```bash
npm run test       # watch 模式
npm run test:run   # 单次
npm run typecheck
```

## 文档

- [设计规范](docs/superpowers/specs/2026-04-17-philosophy-globe-design.md)
- [P1 实施计划](docs/superpowers/plans/2026-04-17-p1-skeleton.md)

## 技术栈

- Vite · React · TypeScript
- react-globe.gl (Three.js)
- Zustand
- Vitest + @testing-library/react

## License

MIT · 数据来源遵循各自许可（Wikipedia CC-BY-SA、Twemoji CC-BY 4.0、Natural Earth PD）
