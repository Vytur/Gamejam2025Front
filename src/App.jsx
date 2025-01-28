import React, { useEffect, useState, useCallback } from "react";
import GameGrid from "./components/GameGrid/GameGrid";
import socketService from "./services/socketService";
import "./App.css";

const App = () => {
  const [message, setMessage] = useState("Welcome to the game!");

  useEffect(() => {
    socketService.connect("http://localhost:11100");

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleTileClick = useCallback((row, col) => {
    console.log(`Tile clicked at (${row}, ${col})`);
    setMessage(`Tile clicked: (${row}, ${col})`);
    socketService.emit("tileClick", { row, col });
  }, []);

  return (
    <div className="game-container">
      {/* GameGrid Canvas */}
      <GameGrid onTileClick={handleTileClick} />

      {/* UI Overlay */}
      <div className="ui-overlay">
        <div className="ui-content">
          <h1 className="text-2xl font-bold text-white mb-2">
            MMO Creeper World - Client
          </h1>
          <p className="text-white">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default App;