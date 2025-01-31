// src/rendering/CursorRenderer.js
import * as PIXI from 'pixi.js';

export class CursorRenderer {
  constructor(container) {
    this.container = container;
    this.cursors = new Map();
  }

  createCursor(id) {
    const cursor = new PIXI.Container();
    
    const dot = new PIXI.Graphics();
    dot.fill(0xFFFF00);
    dot.circle(0, 0, 5);
    cursor.addChild(dot);
    
    const text = new PIXI.Text({
      text: id.slice(0, 4),
      style: {
        fontSize: 12,
        fill: 0xFFFF00,
      }
    });
    text.position.set(10, -5);
    cursor.addChild(text);
    
    return cursor;
  }

  updateCursor(id, position) {
    let cursor = this.cursors.get(id);
    if (!cursor) {
      cursor = this.createCursor(id);
      this.cursors.set(id, cursor);
      this.container.addChild(cursor);
    }
    cursor.position.set(position.x * 50, position.y * 50);
  }

  removeCursor(id) {
    const cursor = this.cursors.get(id);
    if (cursor) {
      this.container.removeChild(cursor);
      this.cursors.delete(id);
    }
  }
}