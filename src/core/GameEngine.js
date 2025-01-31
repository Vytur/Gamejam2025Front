// src/core/GameEngine.js
import { EventEmitter } from 'events';

export class GameEngine extends EventEmitter {
  constructor() {
    super();
    this.gameState = {
      grid: [],
      players: new Map(),
      localPlayer: null
    };
  }

  updateCursorPosition(position) {
    this.emit('localCursorMove', position);
  }

  handleCursorInit(cursors) {
    cursors.forEach(cursor => {
      this.updatePlayerCursor(cursor.id, { x: cursor.x, y: cursor.y });
    });
  }

  handleNewCursor(cursor) {
    this.updatePlayerCursor(cursor.id, { x: cursor.x, y: cursor.y });
  }

  handleTileClick(x, y) {
    this.emit('tileClick', { x, y });
  }

  updateTile(x, y, color) {
    if (!this.gameState.grid[y]) return;
    this.gameState.grid[y][x] = color;
    this.emit('tileUpdate', { x, y, color });
  }

  setGrid(grid) {
    this.gameState.grid = grid;
    this.emit('gridUpdate', grid);
  }

  updatePlayerCursor(playerId, position) {
    this.gameState.players.set(playerId, position);
    this.emit('playerUpdate', { playerId, position });
  }

  removePlayer(playerId) {
    this.gameState.players.delete(playerId);
    this.emit('playerRemove', playerId);
  }
}