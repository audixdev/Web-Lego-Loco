window.Tiles = {
    types: {
        EMPTY: {
            id: 'empty',
            name: 'Empty',
            category: 'basic',
            sprite: null,
            solid: false,
            connections: []
        },
        GRASS: {
            id: 'grass',
            name: 'Grass',
            category: 'ground',
            sprite: 'grid',
            solid: false,
            connections: []
        },
        RAIL_HORIZONTAL: {
            id: 'rail_horizontal',
            name: 'Horizontal Rail',
            category: 'tracks',
            sprite: 'railHorizontal',
            solid: true,
            connections: ['west', 'east']
        },
        RAIL_VERTICAL: {
            id: 'rail_vertical',
            name: 'Vertical Rail',
            category: 'tracks',
            sprite: 'railVertical',
            solid: true,
            connections: ['north', 'south']
        },
        RAIL_TURN_LEFT_UP: {
            id: 'rail_turn_left_up',
            name: 'Left-Up Turn',
            category: 'tracks',
            sprite: 'railTurnLeftUp',
            solid: true,
            connections: ['west', 'north']
        },
        RAIL_TURN_LEFT_DOWN: {
            id: 'rail_turn_left_down',
            name: 'Left-Down Turn',
            category: 'tracks',
            sprite: 'railTurnLeftDown',
            solid: true,
            connections: ['west', 'south']
        },
        RAIL_TURN_RIGHT_UP: {
            id: 'rail_turn_right_up',
            name: 'Right-Up Turn',
            category: 'tracks',
            sprite: 'railTurnRightUp',
            solid: true,
            connections: ['east', 'north']
        },
        RAIL_TURN_RIGHT_DOWN: {
            id: 'rail_turn_right_down',
            name: 'Right-Down Turn',
            category: 'tracks',
            sprite: 'railTurnRightDown',
            solid: true,
            connections: ['east', 'south']
        },
        DEPOT_UP_CLOSED: {
            id: 'depot_up_closed',
            name: 'Depot Up (Closed)',
            category: 'buildings',
            sprite: 'depotUpClosed',
            solid: true,
            connections: ['south']
        },
        DEPOT_UP_OPEN: {
            id: 'depot_up_open',
            name: 'Depot Up (Open)',
            category: 'buildings',
            sprite: 'depotUpOpen',
            solid: true,
            connections: ['south']
        },
        DEPOT_DOWN_CLOSED: {
            id: 'depot_down_closed',
            name: 'Depot Down (Closed)',
            category: 'buildings',
            sprite: 'depotDownClosed',
            solid: true,
            connections: ['north']
        },
        DEPOT_DOWN_OPEN: {
            id: 'depot_down_open',
            name: 'Depot Down (Open)',
            category: 'buildings',
            sprite: 'depotDownOpen',
            solid: true,
            connections: ['north']
        },
        DEPOT_LEFT_CLOSED: {
            id: 'depot_left_closed',
            name: 'Depot Left (Closed)',
            category: 'buildings',
            sprite: 'depotLeftClosed',
            solid: true,
            connections: ['east']
        },
        DEPOT_LEFT_OPEN: {
            id: 'depot_left_open',
            name: 'Depot Left (Open)',
            category: 'buildings',
            sprite: 'depotLeftOpen',
            solid: true,
            connections: ['east']
        },
        DEPOT_RIGHT_CLOSED: {
            id: 'depot_right_closed',
            name: 'Depot Right (Closed)',
            category: 'buildings',
            sprite: 'depotRightClosed',
            solid: true,
            connections: ['west']
        },
        DEPOT_RIGHT_OPEN: {
            id: 'depot_right_open',
            name: 'Depot Right (Open)',
            category: 'buildings',
            sprite: 'depotRightOpen',
            solid: true,
            connections: ['west']
        },
        ROAD_HORIZONTAL: {
            id: 'road_horizontal',
            name: 'Horizontal Road',
            category: 'roads',
            sprite: 'roadHorizontal',
            solid: true,
            connections: ['west', 'east']
        },
        ROAD_VERTICAL: {
            id: 'road_vertical',
            name: 'Vertical Road',
            category: 'roads',
            sprite: 'roadVertical',
            solid: true,
            connections: ['north', 'south']
        },
        ROAD_TURN_LEFT_UP: {
            id: 'road_turn_left_up',
            name: 'Left-Up Road Turn',
            category: 'roads',
            sprite: 'roadTurnLeftUp',
            solid: true,
            connections: ['west', 'north']
        },
        ROAD_TURN_LEFT_DOWN: {
            id: 'road_turn_left_down',
            name: 'Left-Down Road Turn',
            category: 'roads',
            sprite: 'roadTurnLeftDown',
            solid: true,
            connections: ['west', 'south']
        },
        ROAD_TURN_RIGHT_UP: {
            id: 'road_turn_right_up',
            name: 'Right-Up Road Turn',
            category: 'roads',
            sprite: 'roadTurnRightUp',
            solid: true,
            connections: ['east', 'north']
        },
        ROAD_TURN_RIGHT_DOWN: {
            id: 'road_turn_right_down',
            name: 'Right-Down Road Turn',
            category: 'roads',
            sprite: 'roadTurnRightDown',
            solid: true,
            connections: ['east', 'south']
        },
        SIDEWALK: {
            id: 'sidewalk',
            name: 'Sidewalk',
            category: 'roads',
            sprite: 'sidewalk',
            solid: true,
            connections: []
        },
        RED_HOUSE: {
            id: 'red_house',
            name: 'Red House',
            category: 'buildings',
            sprite: 'redHouse',
            solid: true,
            connections: []
        },
        DEPOT_UP_OCCUPIED: {
            id: 'depot_up_occupied',
            name: 'Depot Up (Occupied)',
            category: 'buildings',
            sprite: 'depotUpOccupied',
            solid: true,
            connections: ['south']
        },
        DEPOT_DOWN_OCCUPIED: {
            id: 'depot_down_occupied',
            name: 'Depot Down (Occupied)',
            category: 'buildings',
            sprite: 'depotDownOccupied',
            solid: true,
            connections: ['north']
        },
        DEPOT_LEFT_OCCUPIED: {
            id: 'depot_left_occupied',
            name: 'Depot Left (Occupied)',
            category: 'buildings',
            sprite: 'depotLeftOccupied',
            solid: true,
            connections: ['east']
        },
        DEPOT_RIGHT_OCCUPIED: {
            id: 'depot_right_occupied',
            name: 'Depot Right (Occupied)',
            category: 'buildings',
            sprite: 'depotRightOccupied',
            solid: true,
            connections: ['west']
        },
        RAIL_SPLIT_HORIZONTAL_LEFT_DOWN_OFF: {
            id: 'rail_split_horizontal_left_down_off',
            name: 'Rail Split Horizontal Left Down (Off)',
            category: 'tracks',
            sprite: 'railSplitHorizontalLeftDownOff',
            solid: true,
            connections: ['west', 'south']
        },
        RAIL_SPLIT_HORIZONTAL_LEFT_DOWN_ON: {
            id: 'rail_split_horizontal_left_down_on',
            name: 'Rail Split Horizontal Left Down (On)',
            category: 'tracks',
            sprite: 'railSplitHorizontalLeftDownOn',
            solid: true,
            connections: ['west', 'south']
        },
        RAIL_SPLIT_HORIZONTAL_LEFT_UP_OFF: {
            id: 'rail_split_horizontal_left_up_off',
            name: 'Rail Split Horizontal Left Up (Off)',
            category: 'tracks',
            sprite: 'railSplitHorizontalLeftUpOff',
            solid: true,
            connections: ['west', 'north']
        },
        RAIL_SPLIT_HORIZONTAL_LEFT_UP_ON: {
            id: 'rail_split_horizontal_left_up_on',
            name: 'Rail Split Horizontal Left Up (On)',
            category: 'tracks',
            sprite: 'railSplitHorizontalLeftUpOn',
            solid: true,
            connections: ['west', 'north']
        },
        RAIL_SPLIT_HORIZONTAL_RIGHT_DOWN_OFF: {
            id: 'rail_split_horizontal_right_down_off',
            name: 'Rail Split Horizontal Right Down (Off)',
            category: 'tracks',
            sprite: 'railSplitHorizontalRightDownOff',
            solid: true,
            connections: ['east', 'south']
        },
        RAIL_SPLIT_HORIZONTAL_RIGHT_DOWN_ON: {
            id: 'rail_split_horizontal_right_down_on',
            name: 'Rail Split Horizontal Right Down (On)',
            category: 'tracks',
            sprite: 'railSplitHorizontalRightDownOn',
            solid: true,
            connections: ['east', 'south']
        },
        RAIL_SPLIT_HORIZONTAL_RIGHT_UP_OFF: {
            id: 'rail_split_horizontal_right_up_off',
            name: 'Rail Split Horizontal Right Up (Off)',
            category: 'tracks',
            sprite: 'railSplitHorizontalRightUpOff',
            solid: true,
            connections: ['east', 'north']
        },
        RAIL_SPLIT_HORIZONTAL_RIGHT_UP_ON: {
            id: 'rail_split_horizontal_right_up_on',
            name: 'Rail Split Horizontal Right Up (On)',
            category: 'tracks',
            sprite: 'railSplitHorizontalRightUpOn',
            solid: true,
            connections: ['east', 'north']
        },
        RAIL_SPLIT_VERTICAL_LEFT_DOWN_OFF: {
            id: 'rail_split_vertical_left_down_off',
            name: 'Rail Split Vertical Left Down (Off)',
            category: 'tracks',
            sprite: 'railSplitVerticalLeftDownOff',
            solid: true,
            connections: ['west', 'south']
        },
        RAIL_SPLIT_VERTICAL_LEFT_DOWN_ON: {
            id: 'rail_split_vertical_left_down_on',
            name: 'Rail Split Vertical Left Down (On)',
            category: 'tracks',
            sprite: 'railSplitVerticalLeftDownOn',
            solid: true,
            connections: ['west', 'south']
        },
        RAIL_SPLIT_VERTICAL_LEFT_UP_OFF: {
            id: 'rail_split_vertical_left_up_off',
            name: 'Rail Split Vertical Left Up (Off)',
            category: 'tracks',
            sprite: 'railSplitVerticalLeftUpOff',
            solid: true,
            connections: ['west', 'north']
        },
        RAIL_SPLIT_VERTICAL_LEFT_UP_ON: {
            id: 'rail_split_vertical_left_up_on',
            name: 'Rail Split Vertical Left Up (On)',
            category: 'tracks',
            sprite: 'railSplitVerticalLeftUpOn',
            solid: true,
            connections: ['west', 'north']
        },
        RAIL_SPLIT_VERTICAL_RIGHT_DOWN_OFF: {
            id: 'rail_split_vertical_right_down_off',
            name: 'Rail Split Vertical Right Down (Off)',
            category: 'tracks',
            sprite: 'railSplitVerticalRightDownOff',
            solid: true,
            connections: ['east', 'south']
        },
        RAIL_SPLIT_VERTICAL_RIGHT_DOWN_ON: {
            id: 'rail_split_vertical_right_down_on',
            name: 'Rail Split Vertical Right Down (On)',
            category: 'tracks',
            sprite: 'railSplitVerticalRightDownOn',
            solid: true,
            connections: ['east', 'south']
        },
        RAIL_SPLIT_VERTICAL_RIGHT_UP_OFF: {
            id: 'rail_split_vertical_right_up_off',
            name: 'Rail Split Vertical Right Up (Off)',
            category: 'tracks',
            sprite: 'railSplitVerticalRightUpOff',
            solid: true,
            connections: ['east', 'north']
        },
        RAIL_SPLIT_VERTICAL_RIGHT_UP_ON: {
            id: 'rail_split_vertical_right_up_on',
            name: 'Rail Split Vertical Right Up (On)',
            category: 'tracks',
            sprite: 'railSplitVerticalRightUpOn',
            solid: true,
            connections: ['east', 'north']
        },
        ROAD_RAIL_CROSSING_CLOSED_HORIZONTAL: {
            id: 'road_rail_crossing_closed_horizontal',
            name: 'Road-Rail Crossing Closed (Horizontal)',
            category: 'crossings',
            sprite: 'roadRailCrossingClosedHorizontal',
            solid: true,
            connections: ['west', 'east']
        },
        ROAD_RAIL_CROSSING_CLOSED_VERTICAL: {
            id: 'road_rail_crossing_closed_vertical',
            name: 'Road-Rail Crossing Closed (Vertical)',
            category: 'crossings',
            sprite: 'roadRailCrossingClosedVertical',
            solid: true,
            connections: ['north', 'south']
        },
        ROAD_RAIL_CROSSING_OPEN_HORIZONTAL: {
            id: 'road_rail_crossing_open_horizontal',
            name: 'Road-Rail Crossing Open (Horizontal)',
            category: 'crossings',
            sprite: 'roadRailCrossingOpenHorizontal',
            solid: true,
            connections: ['west', 'east']
        },
        ROAD_RAIL_CROSSING_OPEN_VERTICAL: {
            id: 'road_rail_crossing_open_vertical',
            name: 'Road-Rail Crossing Open (Vertical)',
            category: 'crossings',
            sprite: 'roadRailCrossingOpenVertical',
            solid: true,
            connections: ['north', 'south']
        },
        RED_HOUSE_ICON: {
            id: 'red_house_icon',
            name: 'Red House Icon',
            category: 'ui',
            sprite: 'redHouseIcon',
            solid: false,
            connections: []
        },
        HAND: {
            id: 'hand',
            name: 'Hand',
            category: 'ui',
            sprite: 'hand',
            solid: false,
            connections: []
        }
    },
    
    toolTypes: {
        ERASER: {
            id: 'eraser',
            name: 'Eraser',
            category: 'tools',
            sprite: 'toyboxEraser',
            action: 'erase'
        },
        HAND: {
            id: 'hand',
            name: 'Hand',
            category: 'tools',
            sprite: 'toyboxHand',
            action: 'select'
        },
        BOMB: {
            id: 'bomb',
            name: 'Bomb',
            category: 'tools',
            sprite: 'toyboxBomb',
            action: 'bomb'
        },
        HANDLE: {
            id: 'handle',
            name: 'Handle',
            category: 'tools',
            sprite: 'toyboxHandle',
            action: 'handle'
        },
        HOUSE: {
            id: 'house',
            name: 'House',
            category: 'tools',
            sprite: 'toyboxHouse',
            action: 'place_house'
        },
        PLANTS: {
            id: 'plants',
            name: 'Plants',
            category: 'tools',
            sprite: 'toyboxPlants',
            action: 'place_plants'
        },
        RAILROAD: {
            id: 'railroad',
            name: 'Railroad',
            category: 'tools',
            sprite: 'toyboxRailroad',
            action: 'place_railroad'
        },
        LEFT_ARROW: {
            id: 'left_arrow',
            name: 'Left Arrow',
            category: 'ui',
            sprite: 'toyboxLeftArrow',
            action: 'scroll_left'
        },
        MENU_BUTTON_DOWN: {
            id: 'menu_button_down',
            name: 'Menu Button Down',
            category: 'ui',
            sprite: 'toyboxMenuButtonDown',
            action: 'menu_down'
        },
        MENU_BUTTON_UP: {
            id: 'menu_button_up',
            name: 'Menu Button Up',
            category: 'ui',
            sprite: 'toyboxMenuButtonUp',
            action: 'menu_up'
        },
        TILE_BUTTON_DOWN: {
            id: 'tile_button_down',
            name: 'Tile Button Down',
            category: 'ui',
            sprite: 'toyboxTileButtonDown',
            action: 'tile_down'
        }
    },
    
    // Initialize lookup maps
    _typeMap: null,
    _toolTypeMap: null,
    
    _initMaps() {
        if (this._typeMap) return;
        
        this._typeMap = {};
        Object.values(this.types).forEach(type => {
            this._typeMap[type.id] = type;
        });
        
        this._toolTypeMap = {};
        Object.values(this.toolTypes).forEach(type => {
            this._toolTypeMap[type.id] = type;
        });
    },
    
    getAllTypes() {
        return Object.values(this.types);
    },
    
    getToolTypes() {
        return Object.values(this.toolTypes);
    },
    
    getTypeById(id) {
        this._initMaps();
        return this._typeMap[id] || this._toolTypeMap[id] || null;
    },
    
    getTypesByCategory(category) {
        return this.getAllTypes().filter(type => type.category === category);
    },
    
    getToolTypesByCategory(category) {
        return this.getToolTypes().filter(type => type.category === category);
    },
    
    canConnect(tile1, tile2, direction) {
        if (!tile1 || !tile2) return false;
        
        const type1 = this.getTypeById(tile1.type);
        const type2 = this.getTypeById(tile2.type);
        
        if (!type1 || !type2) return false;
        
        const oppositeDir = Utils.getOppositeDirection(direction);
        
        return type1.connections.includes(direction) && 
               type2.connections.includes(oppositeDir);
    },
    
    getValidConnections(tileType, neighbors) {
        if (!tileType) return [];
        
        const type = this.getTypeById(tileType);
        if (!type) return [];
        
        const validConnections = [];
        
        for (const direction of type.connections) {
            const neighbor = neighbors[direction];
            if (neighbor && this.canConnect({ type: tileType }, neighbor, direction)) {
                validConnections.push(direction);
            }
        }
        
        return validConnections;
    },
    
    rotateTile(tileType, rotations = 1) {
        const type = this.getTypeById(tileType);
        if (!type || type.connections.length === 0) return tileType;
        
        const rotatedConnections = type.connections.map(connection => 
            Utils.rotateDirection(connection, rotations)
        );
        
        const rotatedType = {
            ...type,
            connections: rotatedConnections
        };
        
        return rotatedType.id;
    },
    
    getSpritePath(spriteName) {
        if (!spriteName) return null;
        return `assets/Images/${spriteName}.png`;
    },
    
    getAllSpritePaths() {
        const paths = {};
        
        Object.values(this.types).forEach(type => {
            if (type.sprite) {
                paths[type.sprite] = this.getSpritePath(type.sprite);
            }
        });
        
        Object.values(this.toolTypes).forEach(type => {
            if (type.sprite) {
                paths[type.sprite] = this.getSpritePath(type.sprite);
            }
        });
        
        return paths;
    },
    
    isTrack(tileType) {
        const type = this.getTypeById(tileType);
        return type && type.category === 'tracks';
    },
    
    isRoad(tileType) {
        const type = this.getTypeById(tileType);
        return type && type.category === 'roads';
    },
    
    isBuilding(tileType) {
        const type = this.getTypeById(tileType);
        return type && type.category === 'buildings';
    },
    
    isTool(tileType) {
        return this.toolTypes.hasOwnProperty(tileType);
    },
    
    isSolid(tileType) {
        const type = this.getTypeById(tileType);
        return type && type.solid;
    },
    
    canPlaceOn(tileType, existingTile) {
        if (!existingTile || existingTile.type === 'empty' || existingTile.type === 'grass') return true;
        
        const newType = this.getTypeById(tileType);
        const existingType = this.getTypeById(existingTile.type);
        
        if (!newType || !existingType) return false;
        
        if (this.isTool(tileType)) return true;
        
        return !existingType.solid;
    }
};
