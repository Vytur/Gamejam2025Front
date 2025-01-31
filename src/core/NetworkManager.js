// src/core/NetworkManager.js
import { io } from "socket.io-client";

export class NetworkManager {
  constructor(gameEngine) {
    this.socket = null;
    this.gameEngine = gameEngine;
  }

  connect(url) {
    this.socket = io(url);
    this.setupSocketListeners();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  setupSocketListeners() {
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("init_grid", ({ grid }) => {
      this.gameEngine.setGrid(grid);
    });

    this.socket.on("tile_update", ({ x, y, color }) => {
      this.gameEngine.updateTile(x, y, color);
    });

    this.socket.on("cursors_init", (cursors) => {
      cursors.forEach((cursor) => {
        this.gameEngine.updatePlayerCursor(cursor.id, cursor);
      });
    });

    this.socket.on("cursor_update", (cursor) => {
      this.gameEngine.updatePlayerCursor(cursor.id, cursor);
    });

    this.socket.on("remove_cursor", ({ id }) => {
      this.gameEngine.removePlayer(id);
    });

    this.gameEngine.on("tileClick", ({ x, y }) => {
      this.socket.emit("change_tile", {
        x,
        y,
        color: 0,
      });
    });
  }
}
