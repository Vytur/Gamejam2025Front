import React from "react";
import GameGrid from "./components/GameGrid/GameGrid";
import UIManager from "./components/UI/UIManager";
import { UIProvider } from "./components/UI/UIContext";
import "./App.css";

const App = () => {
  return (
    <UIProvider>
      <div className="game-container">
        <GameGrid />
        <UIManager />
      </div>
    </UIProvider>
  );
};

export default App;