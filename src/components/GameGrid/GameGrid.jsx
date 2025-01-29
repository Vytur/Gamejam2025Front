// src/components/GameGrid/GameGrid.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { createGrid, updateGridTiles } from './gridUtils';
import { setupZoomAndPan } from './interactionUtils';
import socketService from '../../services/socketService';

const GRID_SIZE = 100;
const VIEWPORT_SIZE = 20;

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
  const [viewportPosition, setViewportPosition] = useState({ x: GRID_SIZE*0.5, y: GRID_SIZE*0.5 });
  const updateInterval = useRef(null);

  const calculateViewportPosition = () => {
    if (!gridContainerRef.current) return null;

    // Get the center of the screen in world coordinates
    const centerX = -gridContainerRef.current.position.x / gridContainerRef.current.scale.x;
    const centerY = -gridContainerRef.current.position.y / gridContainerRef.current.scale.y;

    // Convert to grid coordinates
    const gridX = Math.floor(centerX / TILE_SIZE);
    const gridY = Math.floor(centerY / TILE_SIZE);

    // Ensure we stay within bounds and align to viewport size
    return {
      x: gridX,
      y: gridY
    };
  };

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
        setViewportPosition({ x, y });
        tilesRef.current = createGrid({
          container: gridContainer,
          grid,
          tileSize: TILE_SIZE,
          onTileClick: handleTileClick,
          colors: COLORS,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
        });

        // Start viewport update interval after initial grid is loaded
        updateInterval.current = setInterval(() => {
          const newPosition = calculateViewportPosition();
          if (newPosition) {
            socketService.emit('move', {
              dx: newPosition.x,
              dy: newPosition.y
            });
          }
        }, 1000); // Check every second
      });

      setupZoomAndPan({
        app,
        gridContainer,
        minZoom: 0.1,
        maxZoom: 3,
        onPanComplete: () => {
          const newPosition = calculateViewportPosition();
          if (newPosition) {
            console.log('New position:', newPosition);
            socketService.emit('move', {
              dx: newPosition.x,
              dy: newPosition.y
            });
          }
        }
      });

      // Handle viewport updates
      socketService.socket.on('update_viewport', ({ x, y, grid }) => {
        setViewportPosition({ x, y });
        console.log('Updating viewport:', x, y);
        console.log('Grid:', grid);
        updateGridTiles({
          tiles: tilesRef.current,
          grid,
          colors: COLORS,
        });
      });

      // Handle individual tile updates
      socketService.socket.on('tile_update', ({ x, y, color }) => {
        console.log('Updating tile:', x, y, color);
        const localX = x;
        const localY = y;
        const key = `${localY}-${localX}`;
        const tile = tilesRef.current[key];
        
        console.log('Local:', localX, localY);
        console.log('Key:', key);
        console.log('Tile:', tile);
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