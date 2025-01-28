// src/components/GameGrid/GameGrid.jsx
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { createGrid } from './gridUtils';
import { setupZoomAndPan } from './interactionUtils';

const GameGrid = ({ onTileClick }) => {
  const pixiContainerRef = useRef(null);
  const gridContainerRef = useRef(null);
  const appRef = useRef(null);

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

      createGrid({
        container: gridContainer,
        gridSize: 20,
        tileSize: 50,
        onTileClick,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });

      setupZoomAndPan({
        app,
        gridContainer,
        minZoom: 0.1,
        maxZoom: 3,
      });

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (appRef.current) {
          appRef.current.destroy(true);
          appRef.current = null;
        }
      };
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [onTileClick]); // Added onTileClick to dependency array

  return (
    <div
      ref={pixiContainerRef}
      className="w-full h-full"
      style={{ border: "1px solid #ffffff" }}
    />
  );
};

export default GameGrid;