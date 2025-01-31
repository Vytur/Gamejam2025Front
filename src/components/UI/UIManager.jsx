import React from "react";
import { useUI } from "./UIContext";

const UIManager = () => {
  const { windows, toggleWindow } = useUI();

  return (
    <div className="ui-overlay">
      <button onClick={() => toggleWindow("inventory")}>Toggle Inventory</button>
      <button onClick={() => toggleWindow("settings")}>Settings</button>

      {windows.inventory && (
        <div className="ui-window">
          <h2>Inventory</h2>
          <button onClick={() => console.log("Use Item")}>Use Item</button>
          <button onClick={() => console.log("Drop Item")}>Drop Item</button>
          <button onClick={() => toggleWindow("inventory")}>Close</button>
        </div>
      )}

      {windows.settings && (
        <div className="ui-window">
          <h2>Settings</h2>
          <button onClick={() => console.log("Toggle Sound")}>Toggle Sound</button>
          <button onClick={() => console.log("Change Controls")}>Change Controls</button>
          <button onClick={() => toggleWindow("settings")}>Close</button>
        </div>
      )}
    </div>
  );
};

export default UIManager;