// src/components/UI/UIManager.jsx
import React from "react";
import { useUI } from "./UIContext";

const UIManager = () => {
  const { windows, toggleWindow, inventory } = useUI();

  return (
    <div className="ui-overlay">
      <div className="coins-display">
        Coins: {inventory.coins}
      </div>

      <button onClick={() => toggleWindow("inventory")}>
        Inventory ({inventory.items.length})
      </button>
      <button onClick={() => toggleWindow("settings")}>Settings</button>

      {windows.inventory && (
        <div className="ui-window">
          <h2>Inventory</h2>
          <div className="inventory-coins">
            <strong>Coins:</strong> {inventory.coins}
          </div>
          
          <div className="inventory-items">
            <h3>Items</h3>
            {inventory.items.length === 0 ? (
              <p>No items in inventory</p>
            ) : (
              <ul>
                {inventory.items.map((item, index) => (
                  <li key={index}>
                    {item.name || 'Unknown Item'}
                    <div className="item-actions">
                      <button onClick={() => console.log(`Use ${item.name}`)}>
                        Use
                      </button>
                      <button onClick={() => console.log(`Drop ${item.name}`)}>
                        Drop
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={() => toggleWindow("inventory")}>Close</button>
        </div>
      )}

      {windows.settings && (
        <div className="ui-window">
          <h2>Settings</h2>
          <button onClick={() => console.log("Toggle Sound")}>Toggle Sound</button>
          <button onClick={() => toggleWindow("settings")}>Close</button>
        </div>
      )}
    </div>
  );
};

export default UIManager;