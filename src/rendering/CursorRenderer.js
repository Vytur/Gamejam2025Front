// src/rendering/CursorRenderer.js
import * as PIXI from 'pixi.js';

export class CursorRenderer {
    constructor(container) {
      this.container = container;
      this.cursors = new Map();
      this.cursorTargets = new Map(); // Store target positions for interpolation
      this.setupInterpolation();
    }
  
    setupInterpolation() {
      // Run interpolation at 60fps
      this.interpolationTicker = new PIXI.Ticker();
      this.interpolationTicker.add(this.updatePositions.bind(this));
      this.interpolationTicker.start();
    }
  
    updatePositions(deltaTime) {
      const LERP_FACTOR = 0.2; // Adjust for smoother/faster interpolation
  
      this.cursorTargets.forEach((target, id) => {
        const cursor = this.cursors.get(id);
        if (cursor) {
          // Interpolate position
          cursor.position.x += (target.x * 50 - cursor.position.x) * LERP_FACTOR;
          cursor.position.y += (target.y * 50 - cursor.position.y) * LERP_FACTOR;
        }
      });
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
        // Set initial position immediately to avoid interpolation from (0,0)
        cursor.position.set(position.x * 50, position.y * 50);
      }
      // Update target position for interpolation
      this.cursorTargets.set(id, position);
    }
  
    removeCursor(id) {
      const cursor = this.cursors.get(id);
      if (cursor) {
        this.container.removeChild(cursor);
        this.cursors.delete(id);
        this.cursorTargets.delete(id);
      }
    }
  
    destroy() {
      this.interpolationTicker.destroy();
      this.cursors.clear();
      this.cursorTargets.clear();
    }
  }