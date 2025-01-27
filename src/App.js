import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { io } from "socket.io-client";

const App = () => {
  const [message, setMessage] = useState("Welcome to the game!");
  const pixiContainerRef = useRef(null);
  const appRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:11100");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const gridSize = 20;
    const tileSize = 50;

    const app = new PIXI.Application();
    
    app
      .init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x333333,
        antialias: true,
      })
      .then(() => {
        appRef.current = app;
        pixiContainerRef.current.appendChild(app.canvas);

        const gridContainer = new PIXI.Container();
        gridContainer.position.set(
          window.innerWidth / 2 - (gridSize * tileSize) / 2,
          window.innerHeight / 2 - (gridSize * tileSize) / 2
        );
        app.stage.addChild(gridContainer);

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const tile = new PIXI.Graphics()
              .rect(0, 0, tileSize, tileSize)
              .fill({ color: 0x808080 })
              .stroke({ width: 2, color: 0xFFFFFF });
            
            tile.position.set(col * tileSize, row * tileSize);
            tile.eventMode = 'static';
            
            tile.on("pointerdown", () => {
              console.log(`Tile clicked at (${row}, ${col})`);
              setMessage(`Tile clicked: (${row}, ${col})`);
              socketRef.current?.emit("tileClick", { row, col });
            });

            gridContainer.addChild(tile);
          }
        }

        const handleResize = () => {
          app.renderer.resize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          app.destroy(true);
        };
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">MMO Creeper World - Client</h1>
      <p className="mb-6">{message}</p>
      <div
        ref={pixiContainerRef}
        className="w-full h-full"
        style={{ border: "1px solid #ffffff" }}
      ></div>
    </div>
  );
};

export default App;