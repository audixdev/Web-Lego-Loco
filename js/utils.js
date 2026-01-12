window.Utils = {
    TILE_SIZE: 64,
    CHUNK_SIZE: 16,
    
    screenToWorld(screenX, screenY, cameraX, cameraY) {
        return {
            x: screenX + cameraX,
            y: screenY + cameraY
        };
    },
    
    worldToTile(worldX, worldY) {
        return {
            x: Math.floor(worldX / this.TILE_SIZE),
            y: Math.floor(worldY / this.TILE_SIZE)
        };
    },
    
    screenToTile(screenX, screenY, cameraX, cameraY) {
        const world = this.screenToWorld(screenX, screenY, cameraX, cameraY);
        return this.worldToTile(world.x, world.y);
    },
    
    tileToWorld(tileX, tileY) {
        return {
            x: tileX * this.TILE_SIZE,
            y: tileY * this.TILE_SIZE
        };
    },
    
    chunkToTile(chunkX, chunkY) {
        return {
            x: chunkX * this.CHUNK_SIZE,
            y: chunkY * this.CHUNK_SIZE
        };
    },
    
    tileToChunk(tileX, tileY) {
        return {
            x: Math.floor(tileX / this.CHUNK_SIZE),
            y: Math.floor(tileY / this.CHUNK_SIZE)
        };
    },
    
    getChunkKey(chunkX, chunkY) {
        return `${chunkX},${chunkY}`;
    },
    
    getTileKey(tileX, tileY) {
        return `${tileX},${tileY}`;
    },
    
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    lerp(start, end, t) {
        return start + (end - start) * this.clamp(t, 0, 1);
    },
    
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },
    
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    },
    
    loadImages(srcMap) {
        const promises = Object.entries(srcMap).map(([key, src]) => 
            this.loadImage(src).then(img => ({ key, img }))
        );
        
        return Promise.all(promises).then(results => {
            const images = {};
            results.forEach(({ key, img }) => {
                images[key] = img;
            });
            return images;
        });
    },
    
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
        }
    },
    
    getOppositeDirection(direction) {
        const opposites = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        return opposites[direction] || null;
    },
    
    rotateDirection(direction, rotations = 1) {
        const directions = ['north', 'east', 'south', 'west'];
        const index = directions.indexOf(direction);
        if (index === -1) return direction;
        
        const newIndex = (index + rotations) % 4;
        return directions[newIndex];
    },
    
    isValidPosition(x, y, minX = -Infinity, minY = -Infinity, maxX = Infinity, maxY = Infinity) {
        return x >= minX && x < maxX && y >= minY && y < maxY;
    },
    
    array2D(width, height, fillValue = null) {
        const array = new Array(height);
        for (let y = 0; y < height; y++) {
            array[y] = new Array(width);
            if (fillValue !== null) {
                array[y].fill(fillValue);
            }
        }
        return array;
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
