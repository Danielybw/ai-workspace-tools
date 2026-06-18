# 八字命理工具 · 上线实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将八字排盘 Web 应用部署到 Cloudflare Pages，实现国内可访问的线上版本，并迭代增长功能

**Architecture:** Vue 3 纯前端 + lunisolar 排盘引擎（全客户端运行）+ Cloudflare Pages 零成本静态托管。零后端架构确保无 CORS / GFW 问题。

**Tech Stack:** Vue 3, Vite, TypeScript, lunisolar, Pinia, Cloudflare Pages (wrangler)

## 当前完成度评估

已访问项目目录 `~/Desktop/Crazy AI/bazi/`，读取全部源文件，确认：

### ✅ Phase 1 已全部完成

| 模块 | 文件 | 状态 |
|------|------|------|
| 排盘引擎 | `src/engine/pillars.ts` | ✅ 基于 lunisolar，四柱、藏遁、五行、十神、强弱、调候全实现 |
| 数据层 | `src/engine/data.ts` | ✅ 天干地支、五行属性、藏遁、十神矩阵、旺衰、调候用神全齐 |
| 类型定义 | `src/engine/types.ts` | ✅ 所有 TypeScript 接口完整 |
| 首页 | `src/views/HomePage.vue` | ✅ 输入表单 + 历史记录 |
| 结果页 | `src/views/ResultPage.vue` | ✅ 四柱、日主、五行、十神、解读、分享卡片 |
| Components | `src/components/*.vue` | ✅ 6 个组件全部实现 |
| 状态管理 | `src/stores/bazi.ts` | ✅ Pinia + localStorage 历史 |
| 路由 | `src/router/index.ts` | ✅ Vue Router home + result |
| 样式 | `src/assets/styles.css` | ✅ 完成移动端响应式 |
| 依赖 | `package.json` | ✅ vue, pinia, vue-router, lunisolar, html2canvas |
| 构建 | `npm run build` | ✅ 编译成功，51 modules，零错误 |

### 🔲 Phase 2-4 待完成

---

## 下一步实施计划

### Task 1: Cloudflare Pages 部署上线

**核心动作：依赖用户操作（Cloudflare 登录 + 首次部署）**

- [ ] 用户注册 Cloudflare 账号（如尚未注册）：https://dash.cloudflare.com/sign-up
- [ ] 用户执行 `wrangler login`（浏览器 OAuth 登录）
- [ ] 本 agent 执行：`npm run build && wrangler pages deploy dist --project-name=bazi-eight-characters`
- [ ] 确认部署成功后，打开 `https://bazi-eight-characters.pages.dev` 验证
- [ ] 从国内网络验证访问速度

**替代方案（如 Cloudflare 登录受阻）：**
- `wrangler pages deploy dist --project-name=bazi-eight-characters` 搭配 API Token 认证
- 或直接通过 Cloudflare 网页控制台手动上传 `dist/` 目录

### Task 2: P0 功能增强（1-2 天）

**2a. 历史记录清空功能**
- 当前历史记录只能逐条删除，缺少「清空全部」按钮
- 修改 `HomePage.vue`：在历史列表顶部添加「清空全部」按钮

**2b. 日柱详解展示**
- 当前结果页只展示四柱+十神+五行，缺少「日柱藏遁详细展开」
- 修改 `ResultPage.vue`：在十神下方增加「地支藏遁详解」模块

**2c. 时间范围选择优化**
- 当前日期选择使用 3 个 `select`（年/月/日），天数固定 31 天
- 优化：根据年月动态计算天数（2月28/29、小月30）

### Task 3: 增长功能（1 周）

| 优先级 | 功能 | 实现方案 | 文件影响 |
|--------|------|----------|----------|
| P1 | 分享卡片品牌化 | html2canvas 底部加产品名+二维码占位 | `ResultPage.vue` |
| P1 | SEO 优化 | `index.html` 加 meta tags + sitemap | `index.html` + 新增 `public/sitemap.xml` |
| P2 | 知识科普页面 | 新增 `views/KnowledgePage.vue` + 路由 | 新增文件 |
| P2 | 关于/免责页面 | 新增 `views/AboutPage.vue` | 新增文件 |

### Task 4: 付费功能规划（后续）

| 功能 | 依赖 | 预估工作量 |
|------|------|-----------|
| 大运流年推算 | 算法扩展（月柱起运规则） | 2-3 天 |
| AI 解读 | Cloudflare Worker → DashScope API | 3-5 天 |
| 微信支付 | 需个体工商户/企业资质 | 1 周 |

---

## 关于 IMA 知识库「八字命理」

已尝试通过 IMA OpenAPI 访问该知识库，但因 API 凭证权限不足（`skill auth failed`）无法直接读取内容。

**建议下一步：**
1. 你在 IMA 桌面端打开「八字命理」知识库，浏览已有内容
2. 截几个关键屏或告诉我里面有什么资料（如产品定义、竞品分析、解读文案库等）
3. 我可以据此判断哪些内容可以复用到这个 Web 工具中

---

## 验证标准

- [ ] `wrangler pages deploy` 成功后，`curl -s https://bazi-eight-characters.pages.dev` 返回 200
- [ ] 在浏览器中打开，表单输入出生信息 → 排盘结果完整显示
- [ ] 分享卡片可以成功下载 PNG 图片
- [ ] 历史记录在刷新后正常保存
- [ ] 移动端（<480px）布局正常

---

## 执行方式选择

**推荐方式：Inline Execution** — 因为 Task 1 需要你配合登录 Cloudflare，我在这边同步执行 Task 2 的代码增强。

需要你做的：
1. **去注册 Cloudflare**（如果还没注册）：https://dash.cloudflare.com/sign-up
2. **执行 `wrangler login`** 完成 OAuth 认证
3. **告诉我 IMA 知识库「八字命理」里有什么内容** —— 里面有产品定义、竞品资料、还是解读文案？

