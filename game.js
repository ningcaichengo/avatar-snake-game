// 阿凡达贪吃蛇游戏
class AvatarSnake {
    constructor() {
        // 游戏配置
        this.GRID_SIZE = 20;
        this.GRID_WIDTH = 30;
        this.GRID_HEIGHT = 20;
        this.INITIAL_SPEED = 150;
        this.SPEED_INCREMENT = 10;
        this.POINTS_PER_FOOD = 10;
        
        // Canvas和上下文
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 响应式设置
        this.setupCanvas();
        
        // 游戏状态
        this.gameState = 'ready'; // ready, playing, paused, gameOver
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.startTime = 0;
        this.gameTime = 0;
        
        // 蛇的状态
        this.snake = [
            { x: 15, y: 10 },
            { x: 14, y: 10 },
            { x: 13, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // 食物
        this.food = this.generateFood();
        
        // 游戏循环
        this.gameLoop = null;
        this.currentSpeed = this.INITIAL_SPEED;
        
        // 初始化
        this.initializeElements();
        this.setupEventListeners();
        this.updateUI();
        this.render();
    }
    
    setupCanvas() {
        // 响应式Canvas设置
        const container = document.querySelector('.game-container');
        const containerRect = container.getBoundingClientRect();
        
        // 设置Canvas显示尺寸
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        // 设置Canvas内部分辨率
        this.canvas.width = containerRect.width;
        this.canvas.height = containerRect.height;
        
        // 计算实际网格大小
        this.actualGridSize = Math.min(
            this.canvas.width / this.GRID_WIDTH,
            this.canvas.height / this.GRID_HEIGHT
        );
        
        // 计算游戏区域偏移，使其居中
        this.offsetX = (this.canvas.width - (this.GRID_WIDTH * this.actualGridSize)) / 2;
        this.offsetY = (this.canvas.height - (this.GRID_HEIGHT * this.actualGridSize)) / 2;
    }
    
    initializeElements() {
        this.elements = {
            currentScore: document.getElementById('current-score'),
            highScore: document.getElementById('high-score'),
            speedBars: document.getElementById('speed-bars'),
            pauseBtn: document.getElementById('pause-btn'),
            restartBtn: document.getElementById('restart-btn'),
            mobileRestartBtn: document.getElementById('mobile-restart'),
            mobilePauseBtn: document.getElementById('mobile-pause'),
            gameOverlay: document.getElementById('game-overlay'),
            overlayMessage: document.getElementById('overlay-message'),
            overlayTime: document.getElementById('overlay-time'),
            overlayHigh: document.getElementById('overlay-high'),
            scorePopup: document.getElementById('score-popup'),
            expandRulesBtn: document.getElementById('expand-rules-btn')
        };
    }
    
    setupEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 按钮事件
        this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        this.elements.restartBtn.addEventListener('click', () => this.restart());
        this.elements.mobileRestartBtn?.addEventListener('click', () => this.restart());
        this.elements.mobilePauseBtn?.addEventListener('click', () => this.togglePause());
        
        // 移动端触摸控制
        this.setupTouchControls();
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.render();
        });
        
        // 规则展开按钮
        this.elements.expandRulesBtn?.addEventListener('click', () => this.toggleRules());
    }
    
    setupTouchControls() {
        const touchArea = document.getElementById('touch-area');
        if (!touchArea) return;
        
        let startX, startY;
        
        touchArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });
        
        touchArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!startX || !startY) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            const minSwipeDistance = 30;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // 水平滑动
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        this.changeDirection(1, 0); // 右
                    } else {
                        this.changeDirection(-1, 0); // 左
                    }
                }
            } else {
                // 垂直滑动
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        this.changeDirection(0, 1); // 下
                    } else {
                        this.changeDirection(0, -1); // 上
                    }
                }
            }
            
            startX = null;
            startY = null;
        });
        
        // 点击暂停
        touchArea.addEventListener('click', (e) => {
            if (this.gameState === 'playing' || this.gameState === 'paused') {
                // 只有在没有滑动的情况下才暂停
                setTimeout(() => {
                    if (this.gameState === 'playing' || this.gameState === 'paused') {
                        this.togglePause();
                    }
                }, 100);
            }
        });
    }
    
    handleKeyPress(e) {
        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
                e.preventDefault();
                this.changeDirection(0, -1);
                break;
            case 'ArrowDown':
            case 'KeyS':
                e.preventDefault();
                this.changeDirection(0, 1);
                break;
            case 'ArrowLeft':
            case 'KeyA':
                e.preventDefault();
                this.changeDirection(-1, 0);
                break;
            case 'ArrowRight':
            case 'KeyD':
                e.preventDefault();
                this.changeDirection(1, 0);
                break;
            case 'Space':
                e.preventDefault();
                this.togglePause();
                break;
            case 'Enter':
                e.preventDefault();
                this.restart();
                break;
        }
    }
    
    changeDirection(x, y) {
        if (this.gameState !== 'playing') return;
        
        // 防止反向移动
        if (this.direction.x === -x && this.direction.y === -y) return;
        
        this.nextDirection = { x, y };
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.elements.pauseBtn.textContent = '继续';
            this.elements.mobilePauseBtn.textContent = '继续';
            if (this.gameLoop) {
                clearTimeout(this.gameLoop);
            }
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.elements.pauseBtn.textContent = '暂停';
            this.elements.mobilePauseBtn.textContent = '暂停';
            this.startGameLoop();
        } else if (this.gameState === 'ready') {
            this.startGame();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.startTime = Date.now();
        this.elements.pauseBtn.textContent = '暂停';
        this.elements.mobilePauseBtn.textContent = '暂停';
        this.startGameLoop();
    }
    
    startGameLoop() {
        if (this.gameState !== 'playing') return;
        
        this.gameLoop = setTimeout(() => {
            this.update();
            this.render();
            this.startGameLoop();
        }, this.currentSpeed);
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // 更新方向
        this.direction = { ...this.nextDirection };
        
        // 移动蛇头
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        // 添加新头部
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            // 移除尾部
            this.snake.pop();
        }
        
        // 更新游戏时间
        this.gameTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        this.updateUI();
    }
    
    checkCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.GRID_WIDTH || 
            head.y < 0 || head.y >= this.GRID_HEIGHT) {
            return true;
        }
        
        // 检查自身碰撞
        return this.snake.some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }
    
    eatFood() {
        this.score += this.POINTS_PER_FOOD;
        this.showScorePopup();
        this.food = this.generateFood();
        
        // 每5个食物增加速度
        if (this.snake.length % 5 === 0) {
            this.currentSpeed = Math.max(50, this.currentSpeed - this.SPEED_INCREMENT);
        }
    }
    
    showScorePopup() {
        const popup = this.elements.scorePopup;
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        
        popup.style.left = rect.left + rect.width / 2 + 'px';
        popup.style.top = rect.top + rect.height / 2 + 'px';
        popup.classList.remove('hidden');
        
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 1000);
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.GRID_WIDTH),
                y: Math.floor(Math.random() * this.GRID_HEIGHT)
            };
        } while (this.snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        ));
        return food;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        // 显示游戏结束界面
        this.elements.overlayMessage.textContent = `你的得分: ${this.score}`;
        this.elements.overlayTime.textContent = `坚持时间: ${this.gameTime}秒`;
        this.elements.overlayHigh.textContent = `最高纪录: ${this.highScore}`;
        this.elements.gameOverlay.classList.remove('hidden');
        
        this.updateUI();
    }
    
    restart() {
        // 重置游戏状态
        this.gameState = 'ready';
        this.score = 0;
        this.gameTime = 0;
        this.currentSpeed = this.INITIAL_SPEED;
        
        // 重置蛇
        this.snake = [
            { x: 15, y: 10 },
            { x: 14, y: 10 },
            { x: 13, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // 重置食物
        this.food = this.generateFood();
        
        // 隐藏覆盖层
        this.elements.gameOverlay.classList.add('hidden');
        
        // 重置按钮文本
        this.elements.pauseBtn.textContent = '开始';
        this.elements.mobilePauseBtn.textContent = '开始';
        
        // 清除游戏循环
        if (this.gameLoop) {
            clearTimeout(this.gameLoop);
        }
        
        this.updateUI();
        this.render();
    }
    
    updateUI() {
        this.elements.currentScore.textContent = this.score;
        this.elements.highScore.textContent = this.highScore;
        
        // 更新速度指示器
        const speedLevel = Math.floor((this.INITIAL_SPEED - this.currentSpeed) / this.SPEED_INCREMENT);
        const maxLevel = 5;
        const bars = '■'.repeat(Math.min(speedLevel + 1, maxLevel)) + 
                    '□'.repeat(Math.max(0, maxLevel - speedLevel - 1));
        this.elements.speedBars.textContent = bars;
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景网格
        this.drawGrid();
        
        // 绘制食物
        this.drawFood();
        
        // 绘制蛇
        this.drawSnake();
        
        // 绘制边框
        this.drawBorder();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#003344';
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= this.GRID_WIDTH; x++) {
            const posX = this.offsetX + x * this.actualGridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(posX, this.offsetY);
            this.ctx.lineTo(posX, this.offsetY + this.GRID_HEIGHT * this.actualGridSize);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= this.GRID_HEIGHT; y++) {
            const posY = this.offsetY + y * this.actualGridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, posY);
            this.ctx.lineTo(this.offsetX + this.GRID_WIDTH * this.actualGridSize, posY);
            this.ctx.stroke();
        }
    }
    
    drawBorder() {
        this.ctx.strokeStyle = '#00aaaa';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00aaaa';
        
        this.ctx.strokeRect(
            this.offsetX - 1, 
            this.offsetY - 1, 
            this.GRID_WIDTH * this.actualGridSize + 2, 
            this.GRID_HEIGHT * this.actualGridSize + 2
        );
        
        this.ctx.shadowBlur = 0;
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = this.offsetX + segment.x * this.actualGridSize;
            const y = this.offsetY + segment.y * this.actualGridSize;
            
            if (index === 0) {
                // 绘制蛇头
                this.drawSnakeHead(x, y);
            } else {
                // 绘制蛇身
                this.drawSnakeBody(x, y, index);
            }
        });
    }
    
    drawSnakeHead(x, y) {
        const size = this.actualGridSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // 蛇头主体 - 青蓝色发光圆形
        this.ctx.fillStyle = '#00ffff';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00ffff';
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 眼睛
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#ffffff';
        
        const eyeSize = size * 0.08;
        const eyeOffset = size * 0.15;
        
        // 左眼
        this.ctx.beginPath();
        this.ctx.arc(centerX - eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 右眼
        this.ctx.beginPath();
        this.ctx.arc(centerX + eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 红色舌头 (根据移动方向)
        this.ctx.fillStyle = '#ff0040';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ff0040';
        
        const tongueLength = size * 0.3;
        const tongueWidth = size * 0.05;
        
        this.ctx.beginPath();
        if (this.direction.x > 0) { // 向右
            this.ctx.moveTo(centerX + size * 0.4, centerY);
            this.ctx.lineTo(centerX + size * 0.4 + tongueLength, centerY - tongueWidth);
            this.ctx.lineTo(centerX + size * 0.4 + tongueLength, centerY + tongueWidth);
        } else if (this.direction.x < 0) { // 向左
            this.ctx.moveTo(centerX - size * 0.4, centerY);
            this.ctx.lineTo(centerX - size * 0.4 - tongueLength, centerY - tongueWidth);
            this.ctx.lineTo(centerX - size * 0.4 - tongueLength, centerY + tongueWidth);
        } else if (this.direction.y > 0) { // 向下
            this.ctx.moveTo(centerX, centerY + size * 0.4);
            this.ctx.lineTo(centerX - tongueWidth, centerY + size * 0.4 + tongueLength);
            this.ctx.lineTo(centerX + tongueWidth, centerY + size * 0.4 + tongueLength);
        } else if (this.direction.y < 0) { // 向上
            this.ctx.moveTo(centerX, centerY - size * 0.4);
            this.ctx.lineTo(centerX - tongueWidth, centerY - size * 0.4 - tongueLength);
            this.ctx.lineTo(centerX + tongueWidth, centerY - size * 0.4 - tongueLength);
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }
    
    drawSnakeBody(x, y, index) {
        const size = this.actualGridSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // 蛇身渐变色
        const alpha = Math.max(0.3, 1 - (index * 0.1));
        this.ctx.fillStyle = `rgba(0, 170, 170, ${alpha})`;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#00aaaa';
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }
    
    drawFood() {
        const x = this.offsetX + this.food.x * this.actualGridSize;
        const y = this.offsetY + this.food.y * this.actualGridSize;
        const size = this.actualGridSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // 能量球 - 绿色发光效果
        this.ctx.fillStyle = '#40ff40';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#40ff40';
        
        // 脉动效果
        const pulseScale = 0.8 + 0.3 * Math.sin(Date.now() * 0.005);
        const radius = size * 0.25 * pulseScale;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 内部高亮
        this.ctx.fillStyle = '#80ff80';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }
    
    toggleRules() {
        const expandBtn = this.elements.expandRulesBtn;
        const icon = expandBtn.querySelector('.expand-icon');
        const desktopRules = document.querySelector('.desktop-version');
        
        if (icon.classList.contains('rotated')) {
            icon.classList.remove('rotated');
            expandBtn.innerHTML = '展开详细说明 <span class="expand-icon">▼</span>';
            desktopRules.style.display = 'none';
        } else {
            icon.classList.add('rotated');
            expandBtn.innerHTML = '收起详细说明 <span class="expand-icon rotated">▲</span>';
            desktopRules.style.display = 'block';
        }
    }
    
    loadHighScore() {
        return parseInt(localStorage.getItem('avatar-snake-high-score') || '0');
    }
    
    saveHighScore() {
        localStorage.setItem('avatar-snake-high-score', this.highScore.toString());
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new AvatarSnake();
});