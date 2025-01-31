// src/rendering/GridRenderer.js
import * as PIXI from 'pixi.js';

export class GridRenderer {
  constructor(container, options, gameEngine) {
    this.container = container;
    this.tileSize = options.tileSize || 50;
    this.tiles = new Map();
    this.colors = {
      PURE: 0x7e7eff,
      CORRUPTED: 0xff9090
    };
    this.gameEngine = gameEngine;
  }

  renderGrid(grid) {
    this.container.removeChildren();
    this.tiles.clear();

    const gridWidth = grid[0].length * this.tileSize;
    const gridHeight = grid.length * this.tileSize;

    this.container.position.set(
      window.innerWidth / 2 - gridWidth / 2,
      window.innerHeight / 2 - gridHeight / 2
    );

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          this.createTile(col, row, grid[row][col]);
        }
      }
  }

  createTile(x, y, color) {
    const tile = new PIXI.Graphics()
      .rect(0, 0, this.tileSize, this.tileSize)
      .fill({ color: color === 0 ? this.colors.PURE : this.colors.CORRUPTED })
      .stroke({ width: 2, color: 0xFFFFFF });

    tile.position.set(x * this.tileSize, y * this.tileSize);
    tile.eventMode = 'static';
    
    // Add click handler to the tile
    tile.on('pointerdown', () => {
      this.gameEngine.handleTileClick(x, y);
    });

    this.container.addChild(tile);
    this.tiles.set(`${y}-${x}`, tile);

    return tile;
  }

  updateTile(x, y, color) {
    const tile = this.tiles.get(`${y}-${x}`);
    if (tile) {
      tile.clear()
        .rect(0, 0, this.tileSize, this.tileSize)
        .fill({ color: color === 0 ? this.colors.PURE : this.colors.CORRUPTED })
        .stroke({ width: 2, color: 0xFFFFFF });
    }
  }
}