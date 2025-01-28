// src/App.jsx
import React, { useEffect, useState, useCallback } from 'react';
import GameGrid from './components/GameGrid/GameGrid';
import socketService from './services/socketService';
import './App.css';

const App = () => {
  const [message, setMessage] = useState("Welcome to the game!");

  useEffect(() => {
    socketService.connect('http://localhost:11100');

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleTileClick = useCallback((row, col) => {
    console.log(`Tile clicked at (${row}, ${col})`);
    setMessage(`Tile clicked: (${row}, ${col})`);
    socketService.emit('tileClick', { row, col });
  }, []); // Empty dependency array since we don't use any external values

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">MMO Creeper World - Client</h1>
      <p className="mb-6">{message}</p>
      <GameGrid onTileClick={handleTileClick} />
    </div>
  );
};

export default App;