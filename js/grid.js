window.Grid = {
    chunks: new Map(),
    
    init() {
        this.chunks.clear();
        // Create initial chunks around origin to ensure grass tiles are always visible
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                this.getChunk(x, y);
            }
        }
    },
    
    getChunk(chunkX, chunkY) {
        const key = Utils.getChunkKey(chunkX, chunkY);
        if (!this.chunks.has(key)) {
            this.chunks.set(key, this.createChunk(chunkX, chunkY));
        }
        return this.chunks.get(key);
    },
    
    createChunk(chunkX, chunkY) {
        const chunk = {
            x: chunkX,
            y: chunkY,
            tiles: Utils.array2D(Utils.CHUNK_SIZE, Utils.CHUNK_SIZE, null),
            needsUpdate: true
        };
        
        for (let y = 0; y < Utils.CHUNK_SIZE; y++) {
            for (let x = 0; x < Utils.CHUNK_SIZE; x++) {
                chunk.tiles[y][x] = this.createTile(
                    chunkX * Utils.CHUNK_SIZE + x,
                    chunkY * Utils.CHUNK_SIZE + y,
                    'grass'
                );
            }
        }
        
        return chunk;
    },
    
    createTile(x, y, type = 'empty', rotation = 0) {
        const tileId = Utils.getTileKey(x, y);
        return {
            id: tileId,
            x: x,
            y: y,
            type: type,
            rotation: rotation,
            neighbors: {},
            lastModified: Date.now()
        };
    },
    
    getTile(x, y) {
        const chunkPos = Utils.tileToChunk(x, y);
        const localPos = {
            x: x - chunkPos.x * Utils.CHUNK_SIZE,
            y: y - chunkPos.y * Utils.CHUNK_SIZE
        };
        
        if (localPos.x < 0 || localPos.x >= Utils.CHUNK_SIZE || 
            localPos.y < 0 || localPos.y >= Utils.CHUNK_SIZE) {
            return null;
        }
        
        const chunk = this.getChunk(chunkPos.x, chunkPos.y);
        return chunk.tiles[localPos.y][localPos.x];
    },
    
    setTile(x, y, type, rotation = 0) {
        const tileType = Tiles.getTypeById(type);
        const width = tileType ? (tileType.width || 1) : 1;
        const height = tileType ? (tileType.height || 1) : 1;
        
        // Check if all positions are valid and can be placed on
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const checkX = x + dx;
                const checkY = y + dy;
                const existingTile = this.getTile(checkX, checkY);
                
                if (!Tiles.canPlaceOn(type, existingTile)) {
                    return false;
                }
            }
        }
        
        // Place the tile in all occupied positions
        let success = false;
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const placeX = x + dx;
                const placeY = y + dy;
                
                const chunkPos = Utils.tileToChunk(placeX, placeY);
                const localPos = {
                    x: placeX - chunkPos.x * Utils.CHUNK_SIZE,
                    y: placeY - chunkPos.y * Utils.CHUNK_SIZE
                };
                
                if (localPos.x >= 0 && localPos.x < Utils.CHUNK_SIZE && 
                    localPos.y >= 0 && localPos.y < Utils.CHUNK_SIZE) {
                    
                    const chunk = this.getChunk(chunkPos.x, chunkPos.y);
                    
                    // Only store the main tile data at the top-left position
                    // Other positions store references to the main tile
                    if (dx === 0 && dy === 0) {
                        chunk.tiles[localPos.y][localPos.x] = this.createTile(placeX, placeY, type, rotation);
                    } else {
                        chunk.tiles[localPos.y][localPos.x] = this.createTile(placeX, placeY, type, rotation);
                        // Mark as part of a larger tile
                        chunk.tiles[localPos.y][localPos.x].isPartOfMultiTile = true;
                        chunk.tiles[localPos.y][localPos.x].mainTileX = x;
                        chunk.tiles[localPos.y][localPos.x].mainTileY = y;
                    }
                    
                    chunk.needsUpdate = true;
                    this.updateNeighbors(placeX, placeY);
                    success = true;
                }
            }
        }
        
        return success;
    },
    
    removeTile(x, y) {
        const tile = this.getTile(x, y);
        if (!tile || tile.type === 'empty') return false;
        
        // If this is part of a multi-tile building, remove the entire building
        if (tile.isPartOfMultiTile && tile.mainTileX !== undefined && tile.mainTileY !== undefined) {
            return this.removeTile(tile.mainTileX, tile.mainTileY);
        }
        
        // Check if this is the main tile of a multi-tile building
        const tileType = Tiles.getTypeById(tile.type);
        if (tileType) {
            const width = tileType.width || 1;
            const height = tileType.height || 1;
            
            // If this is a multi-tile building, remove all parts
            if (width > 1 || height > 1) {
                // Remove all parts of the multi-tile building
                for (let dy = 0; dy < height; dy++) {
                    for (let dx = 0; dx < width; dx++) {
                        const removeX = x + dx;
                        const removeY = y + dy;
                        
                        const chunkPos = Utils.tileToChunk(removeX, removeY);
                        const localPos = {
                            x: removeX - chunkPos.x * Utils.CHUNK_SIZE,
                            y: removeY - chunkPos.y * Utils.CHUNK_SIZE
                        };
                        
                        if (localPos.x >= 0 && localPos.x < Utils.CHUNK_SIZE && 
                            localPos.y >= 0 && localPos.y < Utils.CHUNK_SIZE) {
                            
                            const chunk = this.getChunk(chunkPos.x, chunkPos.y);
                            chunk.tiles[localPos.y][localPos.x] = this.createTile(removeX, removeY, 'empty', 0);
                            chunk.needsUpdate = true;
                            this.updateNeighbors(removeX, removeY);
                        }
                    }
                }
                return true;
            }
        }
        
        // For single tiles, directly set to empty without going through setTile
        const chunkPos = Utils.tileToChunk(x, y);
        const localPos = {
            x: x - chunkPos.x * Utils.CHUNK_SIZE,
            y: y - chunkPos.y * Utils.CHUNK_SIZE
        };
        
        if (localPos.x >= 0 && localPos.x < Utils.CHUNK_SIZE && 
            localPos.y >= 0 && localPos.y < Utils.CHUNK_SIZE) {
            
            const chunk = this.getChunk(chunkPos.x, chunkPos.y);
            chunk.tiles[localPos.y][localPos.x] = this.createTile(x, y, 'empty', 0);
            chunk.needsUpdate = true;
            this.updateNeighbors(x, y);
            return true;
        }
        
        return false;
    },
    
    updateNeighbors(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return;
        
        const directions = {
            north: { x: x, y: y - 1 },
            south: { x: x, y: y + 1 },
            east: { x: x + 1, y: y },
            west: { x: x - 1, y: y }
        };
        
        tile.neighbors = {};
        
        for (const [dir, pos] of Object.entries(directions)) {
            const neighbor = this.getTile(pos.x, pos.y);
            if (neighbor) {
                tile.neighbors[dir] = neighbor;
            }
        }
    },
    
    updateNeighborTile(x, y) {
        const tile = this.getTile(x, y);
        if (tile) {
            this.updateNeighbors(x, y);
            
            const chunkPos = Utils.tileToChunk(x, y);
            const chunk = this.getChunk(chunkPos.x, chunkPos.y);
            chunk.needsUpdate = true;
        }
    },
    
    getTilesInArea(startX, startY, endX, endY) {
        const tiles = [];
        
        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);
        const minY = Math.min(startY, endY);
        const maxY = Math.max(startY, endY);
        
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const tile = this.getTile(x, y);
                if (tile) {
                    tiles.push(tile);
                }
            }
        }
        
        return tiles;
    },
    
    getTilesInRadius(centerX, centerY, radius) {
        const tiles = [];
        const radiusSq = radius * radius;
        
        const minX = Math.floor(centerX - radius);
        const maxX = Math.ceil(centerX + radius);
        const minY = Math.floor(centerY - radius);
        const maxY = Math.ceil(centerY + radius);
        
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                if (dx * dx + dy * dy <= radiusSq) {
                    const tile = this.getTile(x, y);
                    if (tile) {
                        tiles.push(tile);
                    }
                }
            }
        }
        
        return tiles;
    },
    
    getVisibleChunks(cameraX, cameraY, viewportWidth, viewportHeight) {
        const visibleChunks = [];
        
        const startX = Math.floor(cameraX / Utils.TILE_SIZE);
        const startY = Math.floor(cameraY / Utils.TILE_SIZE);
        const endX = Math.ceil((cameraX + viewportWidth) / Utils.TILE_SIZE);
        const endY = Math.ceil((cameraY + viewportHeight) / Utils.TILE_SIZE);
        
        const startChunkX = Utils.tileToChunk(startX, startY).x;
        const startChunkY = Utils.tileToChunk(startX, startY).y;
        const endChunkX = Utils.tileToChunk(endX, endY).x;
        const endChunkY = Utils.tileToChunk(endX, endY).y;
        
        for (let chunkY = startChunkY; chunkY <= endChunkY; chunkY++) {
            for (let chunkX = startChunkX; chunkX <= endChunkX; chunkX++) {
                const chunk = this.getChunk(chunkX, chunkY);
                visibleChunks.push(chunk);
            }
        }
        
        return visibleChunks;
    },
    
    findPath(startX, startY, endX, endY, allowDiagonal = false) {
        const startTile = this.getTile(startX, startY);
        const endTile = this.getTile(endX, endY);
        
        if (!startTile || !endTile) return [];
        
        const openSet = [startTile];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const tileKey = (tile) => Utils.getTileKey(tile.x, tile.y);
        
        gScore.set(tileKey(startTile), 0);
        fScore.set(tileKey(startTile), Utils.distance(startX, startY, endX, endY));
        
        while (openSet.length > 0) {
            let current = openSet[0];
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                if (fScore.get(tileKey(openSet[i])) < fScore.get(tileKey(current))) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            if (current.x === endX && current.y === endY) {
                return this.reconstructPath(cameFrom, current);
            }
            
            openSet.splice(currentIndex, 1);
            closedSet.add(tileKey(current));
            
            const neighbors = this.getWalkableNeighbors(current.x, current.y);
            
            for (const neighbor of neighbors) {
                const neighborKey = tileKey(neighbor);
                
                if (closedSet.has(neighborKey)) continue;
                
                const tentativeGScore = gScore.get(tileKey(current)) + 1;
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(neighborKey)) {
                    continue;
                }
                
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + Utils.distance(neighbor.x, neighbor.y, endX, endY));
            }
        }
        
        return [];
    },
    
    reconstructPath(cameFrom, current) {
        const path = [current];
        const tileKey = (tile) => Utils.getTileKey(tile.x, tile.y);
        
        while (cameFrom.has(tileKey(current))) {
            current = cameFrom.get(tileKey(current));
            path.unshift(current);
        }
        
        return path;
    },
    
    getWalkableNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
        ];
        
        for (const dir of directions) {
            const tile = this.getTile(x + dir.x, y + dir.y);
            if (tile && !Tiles.isSolid(tile.type)) {
                neighbors.push(tile);
            }
        }
        
        return neighbors;
    },
    
    getTileCount() {
        let count = 0;
        for (const chunk of this.chunks.values()) {
            for (let y = 0; y < Utils.CHUNK_SIZE; y++) {
                for (let x = 0; x < Utils.CHUNK_SIZE; x++) {
                    if (chunk.tiles[y][x] && chunk.tiles[y][x].type !== 'empty') {
                        count++;
                    }
                }
            }
        }
        return count;
    },
    
    clear() {
        this.chunks.clear();
    }
};
