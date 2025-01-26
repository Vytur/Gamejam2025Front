export class CursorManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.userCursors = {};
  }

  drawCursor(id, cursor, isCurrentUser = false) {
    this.ctx.beginPath();
    this.ctx.arc(cursor.x, cursor.y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = isCurrentUser ? "blue" : "darkblue";
    this.ctx.fill();

    // Draw user ID
    this.ctx.fillStyle = "black";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(id.slice(0, 5), cursor.x + 15, cursor.y);
  }

  updateCursors(cursors, currentSocketId, gridDrawFunction) {
    // Update stored cursors
    Object.assign(this.userCursors, cursors);

    // Redraw grid and cursors
    gridDrawFunction();

    // Redraw cursors
    Object.entries(this.userCursors).forEach(([id, cursor]) => {
      this.drawCursor(id, cursor, id === currentSocketId);
    });
  }
}
