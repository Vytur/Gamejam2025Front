export class GridManager {
  constructor(gridSize = 10, squareSize = 50, gap = 1) {
    this.gridSize = gridSize;
    this.squareSize = squareSize;
    this.gap = gap;
    this.grid = this.initGrid();
  }

  initGrid() {
    const grid = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill("green")
    );

    // Randomly place 10 initial red tiles
    let redTilesPlaced = 0;
    while (redTilesPlaced < 10) {
      const x = Math.floor(Math.random() * this.gridSize);
      const y = Math.floor(Math.random() * this.gridSize);
      if (grid[x][y] === "green") {
        grid[x][y] = "red";
        redTilesPlaced++;
      }
    }
    return grid;
  }

  drawGrid(ctx) {
    // Clear canvas before drawing
    ctx.clearRect(
      0,
      0,
      this.gridSize * (this.squareSize + this.gap),
      this.gridSize * (this.squareSize + this.gap)
    );

    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        ctx.fillStyle = this.grid[x][y];
        ctx.fillRect(
          x * (this.squareSize + this.gap),
          y * (this.squareSize + this.gap),
          this.squareSize,
          this.squareSize
        );
      }
    }
  }

  getSquareAtPosition(x, y) {
    const gridX = Math.floor(x / (this.squareSize + this.gap));
    const gridY = Math.floor(y / (this.squareSize + this.gap));
    return { gridX, gridY };
  }

  toggleTile(x, y) {
    if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
      this.grid[x][y] = this.grid[x][y] === "red" ? "green" : "red";
      return this.grid[x][y];
    }
    return null;
  }

  spreadRed() {
    const redTiles = this.getRedTiles();
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
          dx < this.gridSize &&
          dy >= 0 &&
          dy < this.gridSize &&
          this.grid[dx][dy] === "green"
        ) {
          greenAdjacent.push([dx, dy]);
        }
      });
    });

    // Randomly spread from 5 red tiles
    const selectedRedTiles = redTiles
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    selectedRedTiles.forEach(() => {
      if (greenAdjacent.length > 0) {
        const [x, y] =
          greenAdjacent[Math.floor(Math.random() * greenAdjacent.length)];
        this.grid[x][y] = "red";
        // Remove this tile from adjacent list
        greenAdjacent = greenAdjacent.filter(
          (tile) => tile[0] !== x || tile[1] !== y
        );
      }
    });

    return this.grid;
  }

  getRedTiles() {
    const redTiles = [];
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if (this.grid[x][y] === "red") {
          redTiles.push([x, y]);
        }
      }
    }
    return redTiles;
  }
}
