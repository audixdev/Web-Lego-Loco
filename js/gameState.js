window.GameState = {
    viewPosition: { x: 0, y: 0 },
    tiles: null,
    toolbox: {
        selectedTile: null,
        selectedCategory: 'tracks',
        isOpen: true
    },
    editMode: 'place',
    mouse: { 
        x: 0, 
        y: 0, 
        tileX: 0, 
        tileY: 0,
        worldX: 0,
        worldY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        lastClickTime: 0
    },
    camera: {
        speed: 500,
        minX: -1000,
        minY: -1000,
        maxX: 1000,
        maxY: 1000
    },
    ui: {
        showGrid: true,
        showDebug: true,
        fps: 0,
        frameCount: 0,
        lastFpsUpdate: 0
    },
    input: {
        keys: {},
        mouseButtons: {},
        lastMousePos: { x: 0, y: 0 }
    },
    sprites: {},
    isInitialized: false,
    isPaused: false,
    
    init() {
        this.viewPosition = { x: 0, y: 0 };
        this.tiles = Grid;
        this.tiles.init();
        
        this.toolbox = {
            selectedTile: 'rail_horizontal',
            selectedCategory: 'tracks',
            isOpen: true
        };
        
        this.editMode = 'place';
        this.mouse = { 
            x: 0, 
            y: 0, 
            tileX: 0, 
            tileY: 0,
            worldX: 0,
            worldY: 0,
            isDragging: false,
            dragStart: { x: 0, y: 0 },
            lastClickTime: 0
        };
        
        this.camera = {
            speed: 500,
            minX: -1000,
            minY: -1000,
            maxX: 1000,
            maxY: 1000
        };
        
        this.ui = {
            showGrid: true,
            showDebug: true,
            fps: 0,
            frameCount: 0,
            lastFpsUpdate: performance.now()
        };
        
        this.input = {
            keys: {},
            mouseButtons: {},
            lastMousePos: { x: 0, y: 0 }
        };
        
        this.sprites = {};
        this.isInitialized = false;
        this.isPaused = false;
    },
    
    updateMousePosition(screenX, screenY) {
        this.mouse.x = screenX;
        this.mouse.y = screenY;
        
        const world = Utils.screenToWorld(screenX, screenY, this.viewPosition.x, this.viewPosition.y);
        this.mouse.worldX = world.x;
        this.mouse.worldY = world.y;
        
        const tile = Utils.worldToTile(world.x, world.y);
        this.mouse.tileX = tile.x;
        this.mouse.tileY = tile.y;
    },
    
    setViewPosition(x, y) {
        this.viewPosition.x = Utils.clamp(x, this.camera.minX, this.camera.maxX);
        this.viewPosition.y = Utils.clamp(y, this.camera.minY, this.camera.maxY);
    },
    
    moveCamera(deltaX, deltaY, deltaTime) {
        const speed = this.camera.speed * deltaTime;
        this.setViewPosition(
            this.viewPosition.x + deltaX * speed,
            this.viewPosition.y + deltaY * speed
        );
    },
    
    setSelectedTile(tileType) {
        if (Tiles.isTool(tileType)) {
            const tool = Tiles.getToolTypes().find(t => t.id === tileType);
            if (tool) {
                this.editMode = tool.action;
                this.toolbox.selectedTile = tileType;
            }
        } else {
            this.editMode = 'place';
            this.toolbox.selectedTile = tileType;
        }
    },
    
    placeTile(x, y, tileType = null, rotation = 0) {
        const typeToPlace = tileType || this.toolbox.selectedTile;
        
        if (!typeToPlace) {
            return false;
        }
        
        if (Tiles.isTool(typeToPlace)) {
            return false;
        }
        
        const result = this.tiles.setTile(x, y, typeToPlace, rotation);
        return result;
    },
    
    eraseTile(x, y) {
        return this.tiles.removeTile(x, y);
    },
    
    handleTileAction(x, y) {
        if (this.editMode === 'place') {
            return this.placeTile(x, y);
        } else if (this.editMode === 'erase') {
            return this.eraseTile(x, y);
        }
        return false;
    },
    
    startDrag(screenX, screenY) {
        this.mouse.isDragging = true;
        this.mouse.dragStart = { x: screenX, y: screenY };
        this.input.lastMousePos = { x: screenX, y: screenY };
    },
    
    updateDrag(screenX, screenY) {
        if (!this.mouse.isDragging) return;
        
        const deltaX = this.input.lastMousePos.x - screenX;
        const deltaY = this.input.lastMousePos.y - screenY;
        
        this.setViewPosition(
            this.viewPosition.x + deltaX,
            this.viewPosition.y + deltaY
        );
        
        this.input.lastMousePos = { x: screenX, y: screenY };
    },
    
    endDrag() {
        this.mouse.isDragging = false;
    },
    
    updateFPS(currentTime) {
        this.ui.frameCount++;
        
        if (currentTime - this.ui.lastFpsUpdate >= 1000) {
            this.ui.fps = this.ui.frameCount;
            this.ui.frameCount = 0;
            this.ui.lastFpsUpdate = currentTime;
        }
    },
    
    toggleGrid() {
        this.ui.showGrid = !this.ui.showGrid;
    },
    
    toggleDebug() {
        this.ui.showDebug = !this.ui.showDebug;
    },
    
    togglePause() {
        this.isPaused = !this.isPaused;
    },
    
    setCameraBounds(minX, minY, maxX, maxY) {
        this.camera.minX = minX;
        this.camera.minY = minY;
        this.camera.maxX = maxX;
        this.camera.maxY = maxY;
    },
    
    getVisibleArea() {
        return {
            startX: Math.floor(this.viewPosition.x / Utils.TILE_SIZE),
            startY: Math.floor(this.viewPosition.y / Utils.TILE_SIZE),
            endX: Math.ceil((this.viewPosition.x + Renderer.canvas.width) / Utils.TILE_SIZE),
            endY: Math.ceil((this.viewPosition.y + Renderer.canvas.height) / Utils.TILE_SIZE)
        };
    },
    
    isTileVisible(tileX, tileY) {
        const world = Utils.tileToWorld(tileX, tileY);
        const screenX = world.x - this.viewPosition.x;
        const screenY = world.y - this.viewPosition.y;
        
        return screenX >= -Utils.TILE_SIZE && 
               screenX <= Renderer.canvas.width &&
               screenY >= -Utils.TILE_SIZE && 
               screenY <= Renderer.canvas.height;
    },
    
    serialize() {
        return {
            viewPosition: this.viewPosition,
            toolbox: this.toolbox,
            editMode: this.editMode,
            ui: {
                showGrid: this.ui.showGrid,
                showDebug: this.ui.showDebug
            },
            tiles: this.serializeTiles()
        };
    },
    
    serializeTiles() {
        const tiles = [];
        for (const chunk of this.tiles.chunks.values()) {
            for (let y = 0; y < Utils.CHUNK_SIZE; y++) {
                for (let x = 0; x < Utils.CHUNK_SIZE; x++) {
                    const tile = chunk.tiles[y][x];
                    if (tile && tile.type !== 'empty') {
                        tiles.push({
                            x: tile.x,
                            y: tile.y,
                            type: tile.type,
                            rotation: tile.rotation
                        });
                    }
                }
            }
        }
        return tiles;
    },
    
    deserialize(data) {
        if (data.viewPosition) {
            this.viewPosition = data.viewPosition;
        }
        
        if (data.toolbox) {
            this.toolbox = { ...this.toolbox, ...data.toolbox };
        }
        
        if (data.editMode) {
            this.editMode = data.editMode;
        }
        
        if (data.ui) {
            this.ui = { ...this.ui, ...data.ui };
        }
        
        if (data.tiles) {
            this.tiles.clear();
            this.tiles.init();
            
            for (const tileData of data.tiles) {
                this.tiles.setTile(tileData.x, tileData.y, tileData.type, tileData.rotation);
            }
        }
    },
    
    reset() {
        this.init();
    },
    
    getStats() {
        return {
            tileCount: this.tiles.getTileCount(),
            chunkCount: this.tiles.chunks.size,
            cameraPosition: { ...this.viewPosition },
            mousePosition: { ...this.mouse },
            selectedTile: this.toolbox.selectedTile,
            editMode: this.editMode,
            fps: this.ui.fps
        };
    },
    
    // Debug function to check tile at specific position
    debugTile(x, y) {
        const tile = this.tiles.getTile(x, y);
        if (!tile) {
            return `No tile found at (${x}, ${y})`;
        }
        
        const tileType = Tiles.getTypeById(tile.type);
        const sprite = this.sprites[tileType?.sprite];
        const world = Utils.tileToWorld(tile.x, tile.y);
        const screen = Renderer.worldToScreen(world.x, world.y);
        
        return {
            position: { x: tile.x, y: tile.y },
            type: tile.type,
            tileType: tileType,
            hasSprite: !!sprite,
            spriteName: tileType?.sprite,
            worldPos: world,
            screenPos: screen,
            visible: screen.x >= -Utils.TILE_SIZE && screen.x <= Renderer.canvas.width &&
                     screen.y >= -Utils.TILE_SIZE && screen.y <= Renderer.canvas.height
        };
    }
};
