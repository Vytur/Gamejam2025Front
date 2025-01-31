import React, { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [windows, setWindows] = useState({});

  const toggleWindow = (name) => {
    setWindows((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <UIContext.Provider value={{ windows, toggleWindow }}>
      {children}
    </UIContext.Provider>
  );
};