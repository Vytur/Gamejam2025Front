// src/core/NetworkManager.js
import { io } from "socket.io-client";

export class NetworkManager {
  static instance = null;
  socket = null;
  eventListeners = {};

  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.setupSocketListeners = this.setupSocketListeners.bind(this);
  }

  static getInstance(gameEngine) {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager(gameEngine);
    }
    return NetworkManager.instance;
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

  setupSocketListeners() {
    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.socket.emit("request_cursors");
      this.socket.emit("request_inventory");
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

    // Cursor initialization
    this.socket.on("cursors_init", (cursors) => {
      this.gameEngine.handleCursorInit(cursors);
    });

    // New cursor joined
    this.socket.on("new_cursor", (cursor) => {
      this.gameEngine.handleNewCursor(cursor);
    });

    // Cursor updates from other players
    this.socket.on("cursor_update", (cursor) => {
      this.gameEngine.updatePlayerCursor(cursor.id, {
        x: cursor.x,
        y: cursor.y,
      });
    });

    // Remove disconnected cursor
    this.socket.on("remove_cursor", ({ id }) => {
      this.gameEngine.removePlayer(id);
    });

    this.gameEngine.on("localCursorMove", (position) => {
      this.socket.emit("cursor_move", position);
    });

    this.gameEngine.on("tileClick", ({ x, y }) => {
      this.socket.emit("change_tile", {
        x,
        y,
        color: 0,
      });
    });

    this.socket.on("inventory_init", (data) => {
      window.dispatchEvent(new CustomEvent("inventory_init", { detail: data }));
    });

    this.socket.on("inventory_update", (data) => {
      window.dispatchEvent(
        new CustomEvent("inventory_update", { detail: data })
      );
    });
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => {
        callback(data);
      });
    }
  }
}
