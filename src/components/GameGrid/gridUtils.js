// src/components/GameGrid/gridUtils.js
import * as PIXI from 'pixi.js';

export const createGrid = ({
  container,
  gridSize,
  tileSize,
  onTileClick,
  windowWidth,
  windowHeight,
}) => {
  // Center the grid
  container.position.set(
    windowWidth / 2 - (gridSize * tileSize) / 2,
    windowHeight / 2 - (gridSize * tileSize) / 2
  );

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const tile = new PIXI.Graphics()
        .rect(0, 0, tileSize, tileSize)
        .fill({ color: 0x808080 })
        .stroke({ width: 2, color: 0xFFFFFF });
      
      tile.position.set(col * tileSize, row * tileSize);
      tile.eventMode = 'static';
      
      tile.on("pointerdown", () => {
        onTileClick(row, col);
      });

      container.addChild(tile);
    }
  }
};