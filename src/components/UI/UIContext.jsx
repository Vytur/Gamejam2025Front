// src/components/UI/UIContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [windows, setWindows] = useState({
    inventory: false,
    settings: false
  });

  const [inventory, setInventory] = useState({
    coins: 0,
    items: []
  });

  useEffect(() => {

    const handleInventoryInit = (event) => {
        setInventory(event.detail);
      };
  
      const handleInventoryUpdate = (event) => {
        setInventory(prevInventory => ({
          ...prevInventory,
          ...event.detail
        }));
      };

      window.addEventListener('inventory_init', handleInventoryInit);
      window.addEventListener('inventory_update', handleInventoryUpdate);

    return () => {
        window.removeEventListener('inventory_init', handleInventoryInit);
        window.removeEventListener('inventory_update', handleInventoryUpdate);
    };
  }, []);

  const toggleWindow = (windowName) => {
    setWindows(prev => ({
      ...Object.fromEntries(
        Object.keys(prev).map(key => [key, false])
      ),
      [windowName]: !prev[windowName]
    }));
  };

  return (
    <UIContext.Provider value={{ 
      windows, 
      toggleWindow, 
      inventory 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);