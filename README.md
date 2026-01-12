# 🚂 LEGO Loco Web Remake

A modern web-based remake of the classic LEGO Loco game built with vanilla JavaScript and HTML5 Canvas.

![LEGO Loco](https://img.shields.io/badge/LEGO-Loco-red) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange) ![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)

## 🎮 About

LEGO Loco Web Remake is a browser-based construction and simulation game inspired by the classic LEGO Loco. Build intricate track systems, place buildings, and create your own LEGO world entirely in your web browser.

## 🐛 Known Issues & Limitations

- Rail turns are not the correct size yet
- The house and other buildings are the wrong size also
- Train simulation not yet implemented
- No sound effects or music
- Limited to 2D top-down view
- No multiplayer support

## 🚧 Future Development

- [ ] Train movement and simulation
- [ ] Sound system and audio effects
- [ ] Additional building types
- [ ] Save/load multiple game slots
- [ ] Undo/redo functionality
- [ ] Zoom controls
- [ ] Mini-map view
- [ ] Export to image formats


### 🏗️ Building System
- **Track Placement**: Build complex railway networks with straight tracks, curves, and junctions
- **Road Construction**: Create road systems with intersections and crossings
- **Building Placement**: Place various buildings including depots and houses
- **Smart Connections**: Automatic track connection detection and validation

## 🕹️ Controls

| Action | Control |
|--------|---------|
| Place Tile | Left Click |
| Erase Tile | Right Click |
| Pan Camera | WASD / Arrow Keys |
| Save Game | Ctrl+E |
| Load Game | Ctrl+O |
| Screenshot | Ctrl+P |
| Fullscreen | Ctrl+F |

## 🏗️ Tile Categories

### 🛤️ Tracks
- Straight tracks (horizontal, vertical)
- Curved tracks (4 directions)
- Rail splits and junctions (with on/off states)
- Depot buildings (open, closed, occupied states)

### 🛣️ Roads  
- Straight roads (horizontal, vertical)
- Road curves and turns
- Road-rail crossings (open/closed states)
- Sidewalks

### 🏢 Buildings
- Red houses
- Depot variants (all 4 directions, multiple states)
- Building icons and UI elements

### 🛠️ Tools
- Eraser for removing tiles
- Hand for selection
- Various building tools
- UI controls and buttons

## 📁 Project Structure

```
Web-Lego-Loco/
├── index.html              # Main HTML file
├── style.css               # Game styling and UI
├── js/
│   ├── main.js             # Game initialization and loop
│   ├── gameState.js        # Game state management
│   ├── grid.js             # Grid and chunk system
│   ├── tiles.js            # Tile definitions and properties
│   ├── renderer.js         # Canvas rendering engine
│   ├── input.js            # Input handling and controls
│   ├── toolbox.js          # UI toolbox management
│   └── utils.js            # Utility functions
└── assets/
    └── Images/             # All game sprites and tiles
        ├── depot*.png      # Depot building sprites
        ├── rail*.png       # Railway track sprites
        ├── road*.png       # Road and crossing sprites
        ├── toybox*.png     # Toolbox UI elements
        └── ...             # Additional game assets
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (recommended for development)

### Installation
1. Clone or download the repository
2. Serve the files using a local web server:
3. Open the given localhost url in your browser

### Development
- No build process required - pure vanilla JavaScript
- All assets are self-contained

## 🎮 Gameplay

1. **Select a tile** from the toolbox categories
2. **Click on the grid** to place tiles
3. **Build connections** by placing compatible tiles next to each other
4. **Use the eraser** to remove mistakes
5. **Save your creation** using Ctrl+E
6. **Take screenshots** to share your builds

## 🔧 Technical Features

### Architecture
- **Modular Design**: Separate modules for game logic, rendering, and input
- **Component-Based**: Tile system with extensible properties
- **Event-Driven**: Input and game state management
- **Performance Optimized**: Chunk-based grid system for large worlds

### Rendering
- **HTML5 Canvas**: Hardware-accelerated 2D rendering
- **Sprite Batching**: Efficient sprite rendering
- **Camera System**: Smooth pan and zoom capabilities
- **Grid Overlay**: Optional placement assistance

### Game Engine
- **Fixed Timestep**: Consistent game logic regardless of framerate
- **Interpolation**: Smooth visual updates between frames
- **Memory Management**: Automatic cleanup and monitoring
- **Error Recovery**: Robust error handling and user feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

### Development Guidelines
- Maintain vanilla JavaScript approach
- Follow existing code style and patterns
- Test across multiple browsers
- Document new features and tiles

## 📄 License

This project is a fan-made remake and is not affiliated with The LEGO Group. All LEGO-related assets are property of The LEGO Group.

## 🙏 Acknowledgments

- Original LEGO Loco game by Intelligent Games
- The LEGO Group for the amazing LEGO brand
- Web development community for inspiration and tools

---

**Built with ❤️ for LEGO fans everywhere**
