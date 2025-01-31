// src/App.jsx
import React, { useState } from "react";
import GameGrid from "./components/GameGrid/GameGrid";
import "./App.css";

const App = () => {
  const [message] = useState("Welcome to the game!");

  return (
    <div className="game-container">
      <GameGrid />
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