# 🐍 阿凡达贪吃蛇游戏

> 🐍 阿凡达风格的贪吃蛇游戏 - 支持桌面和移动端的科幻风格HTML5游戏

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://ningcaichengo.github.io/avatar-snake-game/)

## 📸 游戏截图

<!-- 在这里添加游戏截图 -->
*请添加游戏运行时的截图*

## ✨ 游戏特色

- 🎨 **阿凡达科幻风格**：青蓝色发光界面，蛇头有白色眼睛和红色分叉舌头
- 📱 **响应式设计**：完美适配桌面和移动设备，自动调整界面布局
- ⚡ **流畅体验**：60FPS高性能Canvas渲染，丝滑游戏体验
- 🎮 **多种控制**：支持方向键、WASD键、触摸滑动等多种操作方式
- 💾 **本地存储**：自动保存历史最高分记录
- 🌟 **视觉效果**：发光效果、脉动动画、渐变蛇身

## 🎮 在线试玩

**[🚀 点击这里开始游戏](https://ningcaichengo.github.io/avatar-snake-game/)**

或者本地运行：
1. 克隆仓库：`git clone https://github.com/ningcaichengo/avatar-snake-game.git`
2. 直接双击 `index.html` 文件
3. 或者用浏览器打开 `index.html`

## 🎯 操作说明

### 💻 桌面端
- **移动控制**：方向键 ↑↓←→ 或 WASD键
- **暂停继续**：空格键
- **重新开始**：回车键

### 📱 移动端
- **移动控制**：滑动屏幕改变方向
- **暂停继续**：点击暂停按钮
- **重新开始**：点击重新开始按钮

## 🏆 游戏规则

- 🎯 **目标**：控制发光蛇吃能量球获得高分
- ⚡ **得分**：每个能量球+10分，生存时间也会获得奖励
- 🚀 **挑战**：蛇身越长，移动速度越快，难度递增
- 💀 **结束**：撞墙或撞到自己游戏结束
- 🏅 **记录**：挑战你的最高分记录

## 🛠️ 技术实现

### 核心技术栈
- **HTML5 Canvas**：高性能2D渲染
- **ES6+ JavaScript**：现代JavaScript语法
- **CSS3**：科幻风格样式和动画效果
- **响应式设计**：CSS媒体查询适配多端

### 架构特点
- 🏗️ **面向对象设计**：清晰的类结构，易于维护
- 🔄 **游戏循环**：基于setTimeout的稳定游戏循环
- 📐 **响应式Canvas**：动态计算画布尺寸和网格大小
- 🎨 **模块化渲染**：分离的绘制方法，便于扩展

### 关键算法
- **碰撞检测**：高效的边界和自身碰撞判断
- **食物生成**：避免与蛇身重叠的随机位置算法
- **移动控制**：防反向移动的方向控制逻辑
- **触摸识别**：精确的滑动手势识别

## 📁 项目结构

```
avatar-snake-game/
├── index.html          # 游戏主页面，包含完整的HTML结构
├── styles.css          # 科幻风格样式，响应式布局
├── game.js            # 游戏核心逻辑，Canvas渲染
├── README.md          # 项目说明文档
├── LICENSE           # MIT开源许可证
└── .gitignore        # Git忽略文件配置
```

## 🎨 设计思路

### 视觉风格
- **主色调**：深蓝黑背景 + 青蓝色发光效果
- **蛇的设计**：头部有眼睛和舌头，身体渐变发光
- **能量球**：绿色脉动发光，增强科幻感
- **界面元素**：半透明面板，发光边框

### 交互体验
- **即时反馈**：分数变化有动画提示
- **流畅操作**：60FPS渲染，无延迟控制
- **多端适配**：桌面键盘，移动触摸
- **视觉提示**：速度变化用进度条显示

## 🚀 开发指南

### 环境要求
- 现代浏览器（支持HTML5 Canvas和ES6）
- 无需Node.js或其他依赖

### 本地开发
1. 克隆仓库：`git clone https://github.com/ningcaichengo/avatar-snake-game.git`
2. 进入目录：`cd avatar-snake-game`
3. 直接用浏览器打开 `index.html`

### 自定义配置
游戏参数可在 `game.js` 中修改：
- `GRID_WIDTH/HEIGHT`：游戏区域格子数
- `INITIAL_SPEED`：初始速度
- `SPEED_INCREMENT`：速度递增值
- `POINTS_PER_FOOD`：单个食物得分

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：
1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 开源许可

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**ningcaichengo**
- GitHub: [@ningcaichengo](https://github.com/ningcaichengo)
- Email: 805329446@qq.com

## 🙏 致谢

- 灵感来源于经典贪吃蛇游戏
- 视觉风格参考《阿凡达》电影
- 感谢所有提供反馈和建议的用户

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！

🎮 **[立即开始游戏 →](https://ningcaichengo.github.io/avatar-snake-game/)**