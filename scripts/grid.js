import { socket } from "./main.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gridSize = 10;
const squareSize = 50;
const gap = 1;

let grid = [];

function initGrid(gridData) {
  // Initialize grid based on received gridData
  for (let x = 0; x < gridSize; x++) {
    grid[x] = [];
    for (let y = 0; y < gridSize; y++) {
      // Use gridData to set the initial state
      //const tile = gridData.find((tile) => tile.x === x && tile.y === y);
      //rid[x][y] = tile?.isPurified ? "green" : "red"; // Example: 'blue' for purified, 'green' otherwise
    }
  }

  // Randomly place 10 initial red tiles
  /*let redTilesPlaced = 0;
  while (redTilesPlaced < 10) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (grid[x][y] === "green") {
      grid[x][y] = "red";
      redTilesPlaced++;
    }
  }*/
}

function drawGrid() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      ctx.fillStyle = grid[x][y];
      ctx.fillRect(
        x * (squareSize + gap),
        y * (squareSize + gap),
        squareSize,
        squareSize
      );
    }
  }
}

function getRedTiles() {
  let redTiles = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid[x][y] === "red") {
        redTiles.push([x, y]);
      }
    }
  }
  return redTiles;
}

function spreadRed() {
  const redTiles = getRedTiles();
  let greenAdjacent = [];

  // Find all green tiles adjacent to red tiles
  redTiles.forEach(([x, y]) => {
    const directions = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    directions.forEach(([dx, dy]) => {
      if (
        dx >= 0 &&
        dx < gridSize &&
        dy >= 0 &&
        dy < gridSize &&
        grid[dx][dy] === "green"
      ) {
        greenAdjacent.push([dx, dy]);
      }
    });
  });

  // Randomly spread from 5 red tiles
  const selectedRedTiles = redTiles.sort(() => 0.5 - Math.random()).slice(0, 5);

  selectedRedTiles.forEach(() => {
    if (greenAdjacent.length > 0) {
      const [x, y] =
        greenAdjacent[Math.floor(Math.random() * greenAdjacent.length)];
      grid[x][y] = "red";
      // Remove this tile from adjacent list to prevent multiple spreads to same tile
      greenAdjacent = greenAdjacent.filter(
        (tile) => tile[0] !== x || tile[1] !== y
      );
    }
  });

  drawGrid();
}

function getSquareAtPosition(x, y) {
  const gridX = Math.floor(x / (squareSize + gap));
  const gridY = Math.floor(y / (squareSize + gap));
  return { gridX, gridY };
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const { gridX, gridY } = getSquareAtPosition(x, y);

  if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
    grid[gridX][gridY] = grid[gridX][gridY] === "red" ? "green" : "red";
    drawGrid();
  }
});

initGrid();
drawGrid();

// Spread red every 5 seconds
setInterval(spreadRed, 5000);

export { grid, initGrid, drawGrid, getRedTiles };

