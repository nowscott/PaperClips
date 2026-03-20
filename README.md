# 通用回形针 (Universal Paperclips) - 现代开源汉化重制版

> **🎉 迁移状态提示：**
> 本项目已完成了前、中、后期（阶段一至阶段四）的全部核心功能迁移！包括最终阶段“宇宙探险与蜂群计算 (Late Game)”的核心机制。后续仅需进行细节打磨和平衡性测试。详情请参阅 `GAME_DESIGN.md`。

## ⚠️ 开源与版权声明
本项目为经典网页放置类游戏《Universal Paperclips》的二次开发与开源汉化版本。
原版游戏及所有权利归原作者 **Decision Problem** 所有。本项目非本人原创，仅供编程学习、UI优化交流与中文本地化体验使用。

---

## 🎯 开发目的与愿景
原版《Universal Paperclips》是一款极具深度的放置类游戏，但存在不支持原生中文和界面相对简陋的缺点。本项目的核心目的是：
1. **全面汉化 (Localization)**：将游戏内所有文本、提示、成就进行高质量的中文本地化，降低母语非英语玩家的游玩门槛。
2. **UI/UX 现代化重构 (Modern UI)**：脱离原版的纯文本和全局绝对定位排版，提供更加现代、美观、响应式的用户界面，提升玩家交互体验。
3. **底层架构升级 (Refactoring)**：将原本由 Vanilla JS（原生 JavaScript）全局变量和 DOM 强耦合驱动的古老架构，彻底迁移至 **React + Vite + TypeScript** 现代前端生态，提高代码的可维护性和扩展性。
4. **无缝云端部署 (Vercel Ready)**：利用 Vite 的纯静态特性，实现 Zero-Config（零配置）的 Vercel 一键部署。

---

## 🛠 技术栈选型
- **核心框架**：React 18
- **构建工具**：Vite (极速启动与热更新，完美契合 Vercel)
- **开发语言**：TypeScript (提供严格的类型安全，应对游戏中成百上千的状态变量)
- **状态管理**：(待引入) 推荐使用 Zustand 或 Redux Toolkit 接管原版复杂的全局状态。
- **样式方案**：(待引入) 推荐使用 Tailwind CSS 快速构建现代化的界面。

---

## 🗺️ 开发指导与迁移路线图 (Roadmap)
为了保持“原有功能完全一致”并顺利过渡，我们的二次开发将严格遵循以下几个阶段：

### Phase 1: 资产归档与基础设施搭建 (已完成 ✅)
- 抓取原版 `index.html`, `main.js`, `globals.js` 等所有资源。
- 存放至 `public/legacy/` 作为对照和兼容版本（已在 `.gitignore` 中忽略以免污染仓库）。
- 初始化 Vite + React + TS 脚手架，确保本地运行与 Vercel 部署通道畅通。

### Phase 2: 核心状态抽象 (State Management) (已完成 ✅)
- 分析原版 `globals.js` 和 `main.js`。
- 引入 Zustand，将 `clips` (回形针数量), `funds` (资金), `wire` (铁丝) 等核心变量提取到响应式状态库中。
- 将状态管理模块化拆分为多个 Slices (如 `businessSlice`, `tickSlice`, `manufacturingSlice` 等)。

### Phase 3: UI 组件化重构 (Componentization) (已完成 ✅)
- 将原版宏大的 HTML 拆分为独立的 React 组件。
- `Header` (资源总览：回形针总数)
- `Manufacturing` (制造面板：手动制造、自动制造机、巨型制造机)
- `Business` (商业/市场面板：定价、公众需求、营销、收益追踪)
- `Projects` & `Computing` (科研项目与计算面板：算力、创造力、量子计算)
- `Investments` & `StrategicModeling` (投资引擎与策略锦标赛)

### Phase 4: 全面汉化与样式优化 (Localization & Styling) (进行中 🚧)
- 提取所有硬编码的英文字符串，替换为中文。
- 重新设计布局，加入现代化卡片阴影、按钮 Hover 动画、数值滚动反馈。
- 修复各种 Flexbox 布局问题和动态渲染条件（如终端日志堆叠、高级投资按钮解锁）。

### Phase 5: 游戏循环接管与数值对齐 (Game Loop) (已完成 ✅)
- 迁移原版的核心 Tick 逻辑（游戏的心跳）。
- 严格对齐原版的所有指数级/多项式成本增长数学公式（如自动制造机、巨型制造机、无人机、太空探测器等）。
- 确保数据随时间自动增长的机制完美运行且不引发 React 的过度渲染。

### Phase 6: 太空探索与结局转生 (Late Game & Prestige) (已完成 ✅)
- 迁移冯·诺依曼探测器发射面板与属性分配（速度、探索、复制、战斗）。
- 实现无人机 Work/Think 蜂群计算网络机制与滑块控制。
- 实装太空阶段的核心 Tick 循环（宇宙探索、自我复制、危险损耗）。
- 实装漂流者 (Drifters) 叛变与自动战斗机制。
- 实装 100% 探索结局 (Victory) 以及多宇宙转生系统 (Prestige U / Sim Level)。

---

## 🚀 运行与部署

### 本地开发
```bash
npm install
npm run dev
```
*(开发服务器默认运行在 http://localhost:5173)*
*(原版对照页面可通过 http://localhost:5173/legacy/index.html 访问，供开发时对比逻辑和数据使用)*

### Vercel 部署
本项目已针对 Vercel 优化。只需将代码推送到 GitHub，并在 Vercel 中导入该仓库。
无需修改任何配置（Framework Preset 保持 Vite 默认），即可一键部署上线！
