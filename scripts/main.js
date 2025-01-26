import { GridManager } from "./GridManager.js";
import { CursorManager } from "./CursorManager.js";

const canvas = document.getElementById("canvas");
const port = 11100;
const socket = io("http://localhost:" + port);

// Initialize grid and cursor managers
const gridManager = new GridManager();
const cursorManager = new CursorManager(canvas);

function resizeCanvas() {
  canvas.width =
    gridManager.gridSize * (gridManager.squareSize + gridManager.gap);
  canvas.height =
    gridManager.gridSize * (gridManager.squareSize + gridManager.gap);
}

// Resize and initialize canvas
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Initial grid draw
gridManager.drawGrid(canvas.getContext("2d"));

// Socket.IO event handlers
socket.on("grid-init", (serverGrid) => {
  gridManager.grid = serverGrid;
  gridManager.drawGrid(canvas.getContext("2d"));
});

socket.on("grid-update", (serverGrid) => {
  gridManager.grid = serverGrid;
  gridManager.drawGrid(canvas.getContext("2d"));
});

socket.on("cursor-update", (cursors) => {
  cursorManager.updateCursors(cursors, socket.id, () =>
    gridManager.drawGrid(canvas.getContext("2d"))
  );
});

// Click event to modify grid
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const { gridX, gridY } = gridManager.getSquareAtPosition(x, y);
  const newColor = gridManager.toggleTile(gridX, gridY);

  if (newColor) {
    socket.emit("grid-modify", { x: gridX, y: gridY, color: newColor });
    gridManager.drawGrid(canvas.getContext("2d"));
  }
});

// Cursor movement tracking
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  socket.emit("cursor-move", { x, y });
});

// Spread red tiles every 5 seconds
setInterval(() => {
  const updatedGrid = gridManager.spreadRed();
  socket.emit("grid-update", updatedGrid);
  gridManager.drawGrid(canvas.getContext("2d"));
}, 5000);
