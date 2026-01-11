window.Game = {
    isRunning: false,
    lastTime: 0,
    accumulator: 0,
    timestep: 1000 / 60,
    maxFrameTime: 250,
    
    async init() {
        try {
            console.log('Initializing LEGO Loco Web Remake...');
            
            this.showLoadingScreen();
            
            GameState.init();
            
            await this.loadSprites();
            
            Renderer.init();
            Input.init();
            Toolbox.init();
            
            this.setupErrorHandling();
            this.setupPerformanceMonitoring();
            
            this.hideLoadingScreen();
            
            console.log('Game initialized successfully!');
            
            this.start();
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showErrorScreen(error);
        }
    },
    
    async loadSprites() {
        const spritePaths = Tiles.getAllSpritePaths();
        const sprites = await Utils.loadImages(spritePaths);
        GameState.sprites = sprites;
    },
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        
        this.gameLoop();
        
        console.log('Game started');
    },
    
    stop() {
        this.isRunning = false;
        console.log('Game stopped');
    },
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const frameTime = Math.min(currentTime - this.lastTime, this.maxFrameTime);
        this.lastTime = currentTime;
        
        this.accumulator += frameTime;
        
        while (this.accumulator >= this.timestep) {
            this.update(this.timestep / 1000);
            this.accumulator -= this.timestep;
        }
        
        const alpha = this.accumulator / this.timestep;
        this.render(alpha);
        
        GameState.updateFPS(currentTime);
        
        requestAnimationFrame(() => this.gameLoop());
    },
    
    update(deltaTime) {
        if (GameState.isPaused) return;
        
        Input.update(deltaTime);
        Toolbox.updateDebugInfo();
    },
    
    render(alpha) {
        Renderer.render();
    },
    
    showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
        `;
        
        loadingScreen.innerHTML = `
            <h1 style="font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                🚂 LEGO Loco Web Remake
            </h1>
            <div style="font-size: 1.2em; margin-bottom: 30px;">Loading...</div>
            <div style="width: 300px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 10px; overflow: hidden;">
                <div id="loadingBar" style="width: 0%; height: 100%; background: #ff6b35; transition: width 0.3s ease; border-radius: 10px;"></div>
            </div>
            <div id="loadingStatus" style="margin-top: 15px; font-size: 0.9em; opacity: 0.8;">Initializing...</div>
        `;
        
        document.body.appendChild(loadingScreen);
        
        this.updateLoadingProgress(10, 'Setting up game state...');
    },
    
    updateLoadingProgress(percent, status) {
        const loadingBar = document.getElementById('loadingBar');
        const loadingStatus = document.getElementById('loadingStatus');
        
        if (loadingBar) loadingBar.style.width = `${percent}%`;
        if (loadingStatus) loadingStatus.textContent = status;
    },
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            this.updateLoadingProgress(100, 'Ready!');
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => loadingScreen.remove(), 500);
            }, 500);
        }
    },
    
    showErrorScreen(error) {
        const errorScreen = document.createElement('div');
        errorScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #2c3e50;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
        `;
        
        errorScreen.innerHTML = `
            <h1 style="font-size: 2.5em; margin-bottom: 20px; color: #e74c3c;">
                ❌ Error Loading Game
            </h1>
            <div style="font-size: 1.1em; margin-bottom: 30px; max-width: 600px; line-height: 1.5;">
                ${error.message || 'An unknown error occurred while loading the game.'}
            </div>
            <button onclick="location.reload()" style="
                padding: 12px 24px;
                font-size: 1em;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">
                Reload Page
            </button>
        `;
        
        document.body.appendChild(errorScreen);
    },
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    },
    
    setupPerformanceMonitoring() {
        if ('performance' in window && 'memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected:', {
                        used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
                    });
                }
            }, 10000);
        }
    },
    
    getPerformanceStats() {
        const stats = {
            fps: GameState.ui.fps,
            tileCount: Grid.getTileCount(),
            chunkCount: Grid.chunks.size,
            cameraPosition: { ...GameState.viewPosition },
            selectedTile: GameState.toolbox.selectedTile,
            editMode: GameState.editMode,
            isPaused: GameState.isPaused
        };
        
        if ('performance' in window && 'memory' in performance) {
            const memory = performance.memory;
            stats.memory = {
                used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
                limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            };
        }
        
        return stats;
    },
    
    exportGameState() {
        const data = GameState.serialize();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lego-loco-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    importGameState(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    GameState.deserialize(data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },
    
    resetGame() {
        if (confirm('Are you sure you want to reset the game? All unsaved progress will be lost.')) {
            GameState.reset();
            console.log('Game reset');
        }
    },
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    },
    
    takeScreenshot() {
        const canvas = document.getElementById('gameCanvas');
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lego-loco-screenshot-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Game.init());
} else {
    Game.init();
}

window.addEventListener('beforeunload', (e) => {
    const tileCount = Grid.getTileCount();
    if (tileCount > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'o':
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        Game.importGameState(file).catch(console.error);
                    }
                };
                input.click();
                break;
            case 'e':
                e.preventDefault();
                Game.exportGameState();
                break;
            // case 'r':
            //     e.preventDefault();
            //     Game.resetGame();
            //     break;
            case 'f':
                e.preventDefault();
                Game.toggleFullscreen();
                break;
            case 'p':
                e.preventDefault();
                Game.takeScreenshot();
                break;
        }
    }
});
