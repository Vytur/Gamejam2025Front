// src/components/GameGrid/GameGrid.jsx
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { createGrid } from './gridUtils';
import { setupZoomAndPan } from './interactionUtils';
import socketService from '../../services/socketService';

const TILE_SIZE = 50;
const COLORS = {
  PURE: 0x0000FF,      // Blue
  CORRUPTED: 0xFF0000  // Red
};

const GameGrid = () => {
  const pixiContainerRef = useRef(null);
  const gridContainerRef = useRef(null);
  const appRef = useRef(null);
  const tilesRef = useRef({});
  const updateInterval = useRef(null);

  const handleTileClick = (row, col) => {
    console.log('Clicked on tile:', row, col);
    socketService.emit('change_tile', {
      x: col,
      y: row,
      color: 0
    });
  };

  useEffect(() => {
    if (!pixiContainerRef.current) return;

    if (appRef.current) {
      appRef.current.destroy(true);
    }

    while (pixiContainerRef.current.firstChild) {
      pixiContainerRef.current.removeChild(pixiContainerRef.current.firstChild);
    }

    const app = new PIXI.Application();
    appRef.current = app;
    
    app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x333333,
      antialias: true,
    }).then(() => {
      if (!pixiContainerRef.current) return;
      
      pixiContainerRef.current.appendChild(app.canvas);

      const gridContainer = new PIXI.Container();
      gridContainerRef.current = gridContainer;
      app.stage.addChild(gridContainer);

      // Handle initial grid
      socketService.socket.on('init_grid', ({ x, y, grid }) => {
        tilesRef.current = createGrid({
          container: gridContainer,
          grid,
          tileSize: TILE_SIZE,
          onTileClick: handleTileClick,
          colors: COLORS,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
        });
      });

      setupZoomAndPan({
        app,
        gridContainer,
        minZoom: 0.1,
        maxZoom: 3,
        onPanComplete: () => {}
      });

      // Handle individual tile updates
      socketService.socket.on('tile_update', ({ x, y, color }) => {
        console.log('Updating tile:', x, y, color);
        const localX = x;
        const localY = y;
        const key = `${localY}-${localX}`;
        const tile = tilesRef.current[key];

        if (tile) {
          tile.clear()
              .rect(0, 0, TILE_SIZE, TILE_SIZE)
              .fill({ color: color === 0 ? COLORS.PURE : COLORS.CORRUPTED })
              .stroke({ width: 2, color: 0xFFFFFF });
        }
      });

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (updateInterval.current) {
          clearInterval(updateInterval.current);
        }
        socketService.disconnect();
        if (appRef.current) {
          appRef.current.destroy(true);
          appRef.current = null;
        }
      };
    });
  }, []);

  return (
    <div
      ref={pixiContainerRef}
      className="w-full h-full"
      style={{ border: "1px solid #ffffff" }}
    />
  );
};

export default GameGrid;