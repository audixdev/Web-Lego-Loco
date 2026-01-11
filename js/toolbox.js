window.Toolbox = {
    isInitialized: false,
    categories: ['tracks', 'roads', 'buildings', 'tools'],
    
    init() {
        this.createToolboxUI();
        this.bindEvents();
        this.isInitialized = true;
    },
    
    createToolboxUI() {
        const trackTiles = document.getElementById('trackTiles');
        const roadTiles = document.getElementById('roadTiles');
        const buildingTiles = document.getElementById('buildingTiles');
        const toolTiles = document.getElementById('toolTiles');
        
        this.populateCategory(trackTiles, 'tracks');
        this.populateCategory(roadTiles, 'roads');
        this.populateCategory(buildingTiles, 'buildings');
        this.populateCategory(toolTiles, 'tools', true);
        
        this.selectTile(GameState.toolbox.selectedTile);
    },
    
    populateCategory(container, category, isTools = false) {
        container.innerHTML = '';
        
        const types = isTools ? Tiles.getToolTypesByCategory(category) : Tiles.getTypesByCategory(category);
        
        types.forEach(type => {
            const tileElement = this.createTileElement(type);
            container.appendChild(tileElement);
        });
    },
    
    createTileElement(type) {
        const element = document.createElement('div');
        element.className = 'tile-option';
        element.dataset.tileId = type.id;
        element.dataset.category = type.category;
        element.title = type.name;
        
        if (type.sprite) {
            const img = document.createElement('img');
            img.src = Tiles.getSpritePath(type.sprite);
            img.alt = type.name;
            img.loading = 'lazy';
            element.appendChild(img);
        } else {
            element.textContent = type.name;
        }
        
        element.addEventListener('click', () => this.selectTile(type.id));
        element.addEventListener('mouseenter', () => this.hoverTile(type.id));
        element.addEventListener('mouseleave', () => this.unhoverTile());
        
        return element;
    },
    
    bindEvents() {
        const categories = document.querySelectorAll('.category');
        categories.forEach(category => {
            const header = category.querySelector('h4');
            if (header) {
                header.addEventListener('click', () => this.toggleCategory(category));
            }
        });
        
        const toolbox = document.getElementById('toolbox');
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '◀';
        toggleBtn.className = 'toolbox-toggle';
        toggleBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: -20px;
            transform: translateY(-50%);
            background: #ff6b35;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 40px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        toggleBtn.addEventListener('click', () => this.toggleToolbox());
        toolbox.appendChild(toggleBtn);
    },
    
    selectTile(tileId) {
        document.querySelectorAll('.tile-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        const selectedElement = document.querySelector(`[data-tile-id="${tileId}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
        
        GameState.setSelectedTile(tileId);
        this.updateCursor();
    },
    
    hoverTile(tileId) {
    },
    
    unhoverTile() {
    },
    
    toggleCategory(categoryElement) {
        const tiles = categoryElement.querySelector('.tiles');
        if (tiles) {
            const isHidden = tiles.style.display === 'none';
            tiles.style.display = isHidden ? 'grid' : 'none';
            
            const header = categoryElement.querySelector('h4');
            if (header) {
                header.textContent = header.textContent.replace(/[▶▼]/, isHidden ? '▼' : '▶');
            }
        }
    },
    
    toggleToolbox() {
        const toolbox = document.getElementById('toolbox');
        const toggleBtn = toolbox.querySelector('.toolbox-toggle');
        
        if (GameState.toolbox.isOpen) {
            toolbox.style.transform = 'translateX(calc(100% - 40px))';
            toggleBtn.textContent = '▶';
            GameState.toolbox.isOpen = false;
        } else {
            toolbox.style.transform = 'translateX(0)';
            toggleBtn.textContent = '◀';
            GameState.toolbox.isOpen = true;
        }
    },
    
    updateCursor() {
        const canvas = document.getElementById('gameCanvas');
        const tileType = Tiles.getTypeById(GameState.toolbox.selectedTile);
        
        if (!tileType) {
            canvas.style.cursor = 'default';
            return;
        }
        
        if (Tiles.isTool(GameState.toolbox.selectedTile)) {
            const tool = Tiles.getToolTypes().find(t => t.id === GameState.toolbox.selectedTile);
            if (tool) {
                switch (tool.action) {
                    case 'erase':
                        canvas.style.cursor = 'crosshair';
                        break;
                    case 'select':
                        canvas.style.cursor = 'pointer';
                        break;
                    default:
                        canvas.style.cursor = 'default';
                }
            }
        } else {
            canvas.style.cursor = 'crosshair';
        }
    },
    
    refreshCategory(category) {
        const container = document.getElementById(`${category}Tiles`);
        if (container) {
            this.populateCategory(container, category, category === 'tools');
        }
    },
    
    refreshAll() {
        this.categories.forEach(category => {
            this.refreshCategory(category);
        });
        
        this.selectTile(GameState.toolbox.selectedTile);
    },
    
    addCustomTile(tileType) {
        this.refreshAll();
    },
    
    removeCustomTile(tileId) {
        const element = document.querySelector(`[data-tile-id="${tileId}"]`);
        if (element) {
            element.remove();
        }
    },
    
    filterTiles(searchTerm) {
        const allTiles = document.querySelectorAll('.tile-option');
        
        allTiles.forEach(tile => {
            const tileId = tile.dataset.tileId;
            const tileType = Tiles.getTypeById(tileId);
            
            if (tileType) {
                const matchesSearch = tileType.name.toLowerCase().includes(searchTerm.toLowerCase());
                const categoryMatches = searchTerm === '' || tile.dataset.category === searchTerm;
                
                tile.style.display = (matchesSearch || categoryMatches) ? 'flex' : 'none';
            }
        });
    },
    
    sortTiles(sortBy = 'name') {
        const categories = ['tracks', 'roads', 'buildings', 'tools'];
        
        categories.forEach(category => {
            const container = document.getElementById(`${category}Tiles`);
            if (!container) return;
            
            const tiles = Array.from(container.children);
            
            tiles.sort((a, b) => {
                const tileA = Tiles.getTypeById(a.dataset.tileId);
                const tileB = Tiles.getTypeById(b.dataset.tileId);
                
                if (!tileA || !tileB) return 0;
                
                switch (sortBy) {
                    case 'name':
                        return tileA.name.localeCompare(tileB.name);
                    case 'category':
                        return tileA.category.localeCompare(tileB.category);
                    case 'id':
                        return tileA.id.localeCompare(tileB.id);
                    default:
                        return 0;
                }
            });
            
            container.innerHTML = '';
            tiles.forEach(tile => container.appendChild(tile));
        });
    },
    
    showTileInfo(tileId) {
        const tileType = Tiles.getTypeById(tileId);
        if (!tileType) return;
        
        const info = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        z-index: 1000; max-width: 300px;">
                <h3>${tileType.name}</h3>
                <p><strong>ID:</strong> ${tileType.id}</p>
                <p><strong>Category:</strong> ${tileType.category}</p>
                <p><strong>Solid:</strong> ${tileType.solid ? 'Yes' : 'No'}</p>
                <p><strong>Connections:</strong> ${tileType.connections.join(', ') || 'None'}</p>
                <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px;">Close</button>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = info;
        document.body.appendChild(div.firstElementChild);
    },
    
    updateDebugInfo() {
        const debugOverlay = document.getElementById('debugOverlay');
        if (!debugOverlay) return;
        
        const stats = GameState.getStats();
        
        document.getElementById('fps').textContent = stats.fps;
        document.getElementById('cameraPos').textContent = `${Math.round(stats.cameraPosition.x)}, ${Math.round(stats.cameraPosition.y)}`;
        document.getElementById('mousePos').textContent = `${Math.round(stats.mousePosition.x)}, ${Math.round(stats.mousePosition.y)}`;
        document.getElementById('tilePos').textContent = `${stats.mousePosition.tileX}, ${stats.mousePosition.tileY}`;
        document.getElementById('gridSize').textContent = stats.tileCount;
        
        debugOverlay.style.display = GameState.ui.showDebug ? 'block' : 'none';
    },
    
    getSelectedTile() {
        return GameState.toolbox.selectedTile;
    },
    
    setSelectedCategory(category) {
        GameState.toolbox.selectedCategory = category;
        
        document.querySelectorAll('.category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        const activeCategory = document.querySelector(`[data-category="${category}"]`);
        if (activeCategory) {
            activeCategory.classList.add('active');
        }
    }
};
