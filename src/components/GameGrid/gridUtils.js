// src/components/GameGrid/gridUtils.js
import * as PIXI from 'pixi.js';

export const createGrid = ({
  container,
  grid,
  tileSize,
  onTileClick,
  colors,
  windowWidth,
  windowHeight,
}) => {
  // Clear existing children
  container.removeChildren();

  // Center the grid
  container.position.set(
    windowWidth / 2 - (grid[0].length * tileSize) / 2,
    windowHeight / 2 - (grid.length * tileSize) / 2
  );

  const tiles = {};

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const tile = new PIXI.Graphics()
        .rect(0, 0, tileSize, tileSize)
        .fill({ color: grid[row][col] === 0 ? colors.PURE : colors.CORRUPTED })
        .stroke({ width: 2, color: 0xFFFFFF });
      
      tile.position.set(col * tileSize, row * tileSize);
      tile.eventMode = 'static';
      
      tile.on("pointerdown", () => {
        onTileClick(row, col);
      });

      container.addChild(tile);
      tiles[`${row}-${col}`] = tile;
    }
  }

  return tiles;
};