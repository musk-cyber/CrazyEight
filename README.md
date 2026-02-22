# Musk 的疯狂 8 点 (Crazy Eights)

一款基于 React + Vite + Tailwind CSS 开发的经典扑克牌游戏。

## 游戏特性
- **经典规则**：数字 8 是万能牌，可以改变当前花色。
- **智能 AI**：具有快速决策能力的 AI 对手。
- **响应式设计**：完美适配手机、平板和电脑屏幕。
- **流畅动画**：使用 `motion` 实现丝滑的卡牌交互。

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 编译打包：
   ```bash
   npm run build
   ```

## 部署到 Vercel

1. 将代码推送到 GitHub。
2. 在 Vercel 中导入此仓库。
3. **重要**：在 Vercel 项目设置中添加环境变量 `GEMINI_API_KEY`。
4. 框架预设选择 `Vite`，构建命令保持默认的 `npm run build`，输出目录为 `dist`。

## 技术栈
- React 19
- Tailwind CSS 4
- Framer Motion (motion/react)
- Lucide React (图标)
- Canvas Confetti (胜利特效)
