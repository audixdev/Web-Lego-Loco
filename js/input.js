window.Input = {
    isInitialized: false,
    
    init() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.setupMouseEvents(canvas);
        this.setupKeyboardEvents();
        this.setupTouchEvents(canvas);
        
        this.isInitialized = true;
    },
    
    setupMouseEvents(canvas) {
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        document.addEventListener('mouseup', (e) => this.handleDocumentMouseUp(e));
    },
    
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    },
    
    setupTouchEvents(canvas) {
        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    },
    
    handleMouseDown(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        GameState.updateMousePosition(x, y);
        GameState.input.mouseButtons[e.button] = true;
        
        if (e.button === 0) {
            if (e.shiftKey) {
                GameState.startDrag(x, y);
            } else {
                this.handleTileAction();
            }
        } else if (e.button === 2) {
            if (e.shiftKey) {
                GameState.startDrag(x, y);
            } else {
                this.handleRightClickAction();
            }
        }
        
        e.preventDefault();
    },
    
    handleMouseUp(e) {
        GameState.input.mouseButtons[e.button] = false;
        
        if (e.button === 0 || e.button === 2) {
            GameState.endDrag();
        }
    },
    
    handleDocumentMouseUp(e) {
        GameState.input.mouseButtons[e.button] = false;
        GameState.endDrag();
    },
    
    handleMouseMove(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        GameState.updateMousePosition(x, y);
        
        if (GameState.mouse.isDragging) {
            GameState.updateDrag(x, y);
        }
        
        if (GameState.input.mouseButtons[0] && !e.shiftKey && !GameState.mouse.isDragging) {
            this.handleTileAction();
        }
        
        if (GameState.input.mouseButtons[2] && !e.shiftKey && !GameState.mouse.isDragging) {
            this.handleRightClickAction();
        }
    },
    
    handleWheel(e) {
        e.preventDefault();
    },
    
    handleKeyDown(e) {
        GameState.input.keys[e.key.toLowerCase()] = true;
        
        switch(e.key.toLowerCase()) {
            case 'r':
                this.rotateSelectedTile();
                break;
            case 'g':
                GameState.toggleGrid();
                break;
            case 'd':
                if (e.ctrlKey || e.metaKey) {
                    GameState.toggleDebug();
                    e.preventDefault();
                }
                break;
            case 'p':
                if (e.ctrlKey || e.metaKey) {
                    GameState.togglePause();
                    e.preventDefault();
                }
                break;
            case 'escape':
                GameState.setSelectedTile(null);
                GameState.editMode = 'place';
                break;
        }
        
        if (e.key >= '1' && e.key <= '9') {
            this.selectToolByNumber(parseInt(e.key));
        }
        
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 's':
                    this.saveGame();
                    e.preventDefault();
                    break;
                case 'l':
                    this.loadGame();
                    e.preventDefault();
                    break;
                case 'z':
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    e.preventDefault();
                    break;
            }
        }
    },
    
    handleKeyUp(e) {
        GameState.input.keys[e.key.toLowerCase()] = false;
    },
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = e.target.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        GameState.updateMousePosition(x, y);
        
        if (e.touches.length === 1) {
            GameState.startDrag(x, y);
        }
    },
    
    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = e.target.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            GameState.updateDrag(x, y);
        }
    },
    
    handleTouchEnd(e) {
        e.preventDefault();
        GameState.endDrag();
    },
    
    handleTileAction() {
        const tileX = GameState.mouse.tileX;
        const tileY = GameState.mouse.tileY;
        
        GameState.handleTileAction(tileX, tileY);
        
        const currentTime = Date.now();
        GameState.mouse.lastClickTime = currentTime;
    },
    
    handleRightClickAction() {
        const tileX = GameState.mouse.tileX;
        const tileY = GameState.mouse.tileY;

        // Replace the current tile with grass (OLD METHOD)
        // GameState.placeTile(tileX, tileY, 'grass', 0);
        
        // Remove the existing tile (this handles multi-tile buildings properly)
        GameState.tiles.removeTile(tileX, tileY);
        
        const currentTime = Date.now();
        GameState.mouse.lastClickTime = currentTime;
    },
    
    rotateSelectedTile() {
        if (GameState.toolbox.selectedTile && !Tiles.isTool(GameState.toolbox.selectedTile)) {
            const rotated = Tiles.rotateTile(GameState.toolbox.selectedTile, 1);
            GameState.setSelectedTile(rotated);
        }
    },
    
    selectToolByNumber(number) {
        const allTypes = [...Tiles.getAllTypes(), ...Tiles.getToolTypes()];
        const index = number - 1;
        
        if (index < allTypes.length) {
            GameState.setSelectedTile(allTypes[index].id);
        }
    },
    
    saveGame() {
        const data = GameState.serialize();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lego-loco-save-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    loadGame() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        GameState.deserialize(data);
                    } catch (error) {
                        console.error('Failed to load save file:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    },
    
    undo() {
    },
    
    redo() {
    },
    
    update(deltaTime) {
        const speed = 1;
        
        if (GameState.input.keys['w'] || GameState.input.keys['arrowup']) {
            GameState.moveCamera(0, -speed, deltaTime);
        }
        if (GameState.input.keys['s'] || GameState.input.keys['arrowdown']) {
            GameState.moveCamera(0, speed, deltaTime);
        }
        if (GameState.input.keys['a'] || GameState.input.keys['arrowleft']) {
            GameState.moveCamera(-speed, 0, deltaTime);
        }
        if (GameState.input.keys['d'] || GameState.input.keys['arrowright']) {
            GameState.moveCamera(speed, 0, deltaTime);
        }
        
        if (GameState.input.keys['q']) {
            GameState.moveCamera(-speed, -speed, deltaTime);
        }
        if (GameState.input.keys['e']) {
            GameState.moveCamera(speed, -speed, deltaTime);
        }
        if (GameState.input.keys['z']) {
            GameState.moveCamera(-speed, speed, deltaTime);
        }
        if (GameState.input.keys['c']) {
            GameState.moveCamera(speed, speed, deltaTime);
        }
    },
    
    isKeyPressed(key) {
        return GameState.input.keys[key.toLowerCase()] || false;
    },
    
    isMouseButtonPressed(button) {
        return GameState.input.mouseButtons[button] || false;
    },
    
    getMousePosition() {
        return {
            x: GameState.mouse.x,
            y: GameState.mouse.y,
            tileX: GameState.mouse.tileX,
            tileY: GameState.mouse.tileY,
            worldX: GameState.mouse.worldX,
            worldY: GameState.mouse.worldY
        };
    },
    
    isMouseOverCanvas() {
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        const mouse = this.getMousePosition();
        
        return mouse.x >= 0 && mouse.x <= rect.width &&
               mouse.y >= 0 && mouse.y <= rect.height;
    }
};
