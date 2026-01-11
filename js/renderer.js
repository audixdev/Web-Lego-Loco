window.Renderer = {
    canvas: null,
    ctx: null,
    isInitialized: false,
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.isInitialized = true;
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    clear() {
        this.ctx.fillStyle = '#4a5f3a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    render() {
        if (!this.isInitialized) return;
        
        this.clear();
        
        this.save();
        this.translate(-GameState.viewPosition.x, -GameState.viewPosition.y);
        
        this.renderTiles();
        this.renderGrid();
        this.renderHoverPreview();
        this.renderSelection();
        
        this.restore();
        
        this.renderUI();
    },
    
    renderTiles() {
        const visibleChunks = Grid.getVisibleChunks(
            GameState.viewPosition.x,
            GameState.viewPosition.y,
            this.canvas.width,
            this.canvas.height
        );
        
        for (const chunk of visibleChunks) {
            this.renderChunk(chunk);
        }
    },
    
    renderChunk(chunk) {
        for (let y = 0; y < Utils.CHUNK_SIZE; y++) {
            for (let x = 0; x < Utils.CHUNK_SIZE; x++) {
                const tile = chunk.tiles[y][x];
                if (tile && tile.type !== 'empty') {
                    this.renderTile(tile);
                }
            }
        }
    },
    
    renderTile(tile) {
        const world = Utils.tileToWorld(tile.x, tile.y);
        const tileType = Tiles.getTypeById(tile.type);
        
        if (!tileType || !tileType.sprite) {
            return;
        }
        
        const sprite = GameState.sprites[tileType.sprite];
        if (!sprite) {
            return;
        }
        
        // Debug: Check if tile is actually visible
        const screenPos = this.worldToScreen(world.x, world.y);
        if (screenPos.x < -Utils.TILE_SIZE || screenPos.x > this.canvas.width ||
            screenPos.y < -Utils.TILE_SIZE || screenPos.y > this.canvas.height) {
            return;
        }
        
        this.save();
        this.translate(world.x, world.y);
        
        if (tile.rotation !== 0) {
            this.rotate(tile.rotation * Math.PI / 180);
        }
        
        this.ctx.drawImage(
            sprite,
            0, 0,
            Utils.TILE_SIZE, Utils.TILE_SIZE
        );
        
        this.restore();
    },
    
    renderGrid() {
        if (!GameState.ui.showGrid) return;
        
        const area = GameState.getVisibleArea();
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = area.startX; x <= area.endX; x++) {
            const world = Utils.tileToWorld(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(world.x, area.startY * Utils.TILE_SIZE);
            this.ctx.lineTo(world.x, area.endY * Utils.TILE_SIZE);
            this.ctx.stroke();
        }
        
        for (let y = area.startY; y <= area.endY; y++) {
            const world = Utils.tileToWorld(0, y);
            this.ctx.beginPath();
            this.ctx.moveTo(area.startX * Utils.TILE_SIZE, world.y);
            this.ctx.lineTo(area.endX * Utils.TILE_SIZE, world.y);
            this.ctx.stroke();
        }
    },
    
    renderHoverPreview() {
        const tileX = GameState.mouse.tileX;
        const tileY = GameState.mouse.tileY;
        
        if (!GameState.isTileVisible(tileX, tileY)) return;
        
        const world = Utils.tileToWorld(tileX, tileY);
        const existingTile = Grid.getTile(tileX, tileY);
        
        if (GameState.editMode === 'place' && GameState.toolbox.selectedTile) {
            const tileType = Tiles.getTypeById(GameState.toolbox.selectedTile);
            if (tileType && Tiles.canPlaceOn(GameState.toolbox.selectedTile, existingTile)) {
                this.renderTilePreview(world, tileType, 0.6);
            }
        } else if (GameState.editMode === 'erase' && existingTile && existingTile.type !== 'empty') {
            this.renderErasePreview(world);
        }
    },
    
    renderTilePreview(world, tileType, alpha = 0.6) {
        const sprite = GameState.sprites[tileType.sprite];
        if (!sprite) return;
        
        this.save();
        this.globalAlpha(alpha);
        this.translate(world.x, world.y);
        
        this.ctx.drawImage(
            sprite,
            0, 0,
            Utils.TILE_SIZE, Utils.TILE_SIZE
        );
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, Utils.TILE_SIZE, Utils.TILE_SIZE);
        
        this.restore();
    },
    
    renderErasePreview(world) {
        this.save();
        this.translate(world.x, world.y);
        
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, Utils.TILE_SIZE, Utils.TILE_SIZE);
        
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, Utils.TILE_SIZE, Utils.TILE_SIZE);
        
        this.restore();
    },
    
    renderSelection() {
    },
    
    renderUI() {
        if (GameState.ui.showDebug) {
            this.renderDebugInfo();
        }
    },
    
    renderDebugInfo() {
        const stats = GameState.getStats();
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 200, 120);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        const lines = [
            `FPS: ${stats.fps}`,
            `Camera: ${Math.round(stats.cameraPosition.x)}, ${Math.round(stats.cameraPosition.y)}`,
            `Mouse: ${Math.round(stats.mousePosition.x)}, ${Math.round(stats.mousePosition.y)}`,
            `Tile: ${stats.mousePosition.tileX}, ${stats.mousePosition.tileY}`,
            `Grid: ${stats.tileCount} tiles`
        ];
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, 20, 20 + index * 20);
        });
        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    },
    
    save() {
        this.ctx.save();
    },
    
    restore() {
        this.ctx.restore();
    },
    
    translate(x, y) {
        this.ctx.translate(x, y);
    },
    
    rotate(angle) {
        this.ctx.rotate(angle);
    },
    
    scale(x, y) {
        this.ctx.scale(x, y);
    },
    
    globalAlpha(alpha) {
        this.ctx.globalAlpha = alpha;
    },
    
    renderText(text, x, y, options = {}) {
        this.save();
        
        this.ctx.fillStyle = options.color || 'white';
        this.ctx.font = options.font || '16px Arial';
        this.ctx.textAlign = options.align || 'center';
        this.ctx.textBaseline = options.baseline || 'middle';
        
        if (options.shadow) {
            this.ctx.shadowColor = options.shadowColor || 'black';
            this.ctx.shadowBlur = options.shadowBlur || 4;
            this.ctx.shadowOffsetX = options.shadowOffsetX || 2;
            this.ctx.shadowOffsetY = options.shadowOffsetY || 2;
        }
        
        this.ctx.fillText(text, x, y);
        
        this.restore();
    },
    
    renderRect(x, y, width, height, options = {}) {
        this.save();
        
        this.ctx.fillStyle = options.fillColor || 'white';
        this.ctx.strokeStyle = options.strokeColor || 'black';
        this.ctx.lineWidth = options.lineWidth || 1;
        
        if (options.globalAlpha) {
            this.ctx.globalAlpha = options.globalAlpha;
        }
        
        if (options.fillColor) {
            this.ctx.fillRect(x, y, width, height);
        }
        
        if (options.strokeColor) {
            this.ctx.strokeRect(x, y, width, height);
        }
        
        this.restore();
    },
    
    renderCircle(x, y, radius, options = {}) {
        this.save();
        
        this.ctx.fillStyle = options.fillColor || 'white';
        this.ctx.strokeStyle = options.strokeColor || 'black';
        this.ctx.lineWidth = options.lineWidth || 1;
        
        if (options.globalAlpha) {
            this.ctx.globalAlpha = options.globalAlpha;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (options.fillColor) {
            this.ctx.fill();
        }
        
        if (options.strokeColor) {
            this.ctx.stroke();
        }
        
        this.restore();
    },
    
    renderLine(x1, y1, x2, y2, options = {}) {
        this.save();
        
        this.ctx.strokeStyle = options.color || 'white';
        this.ctx.lineWidth = options.lineWidth || 1;
        
        if (options.globalAlpha) {
            this.ctx.globalAlpha = options.globalAlpha;
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        this.restore();
    },
    
    screenToWorld(screenX, screenY) {
        return Utils.screenToWorld(screenX, screenY, GameState.viewPosition.x, GameState.viewPosition.y);
    },
    
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - GameState.viewPosition.x,
            y: worldY - GameState.viewPosition.y
        };
    }
};
