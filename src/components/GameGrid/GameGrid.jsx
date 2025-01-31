// src/components/GameGrid/GameGrid.jsx
import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../../core/GameEngine';
import { NetworkManager } from '../../core/NetworkManager';
import { PixiRenderer } from '../../rendering/PixiRenderer';

const GameGrid = () => {
  const containerRef = useRef(null);
  const gameEngineRef = useRef(null);
  const networkManagerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize core systems
    gameEngineRef.current = new GameEngine();
    networkManagerRef.current = new NetworkManager(gameEngineRef.current);
    rendererRef.current = new PixiRenderer(containerRef.current, gameEngineRef.current);

    // Connect to server and initialize renderer
    networkManagerRef.current.connect('http://localhost:11100');
    rendererRef.current.initialize();

    return () => {
      networkManagerRef.current?.disconnect();
      rendererRef.current?.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ border: "1px solid #ffffff" }}
    />
  );
};

export default GameGrid;