// src/rendering/PixiRenderer.js
import * as PIXI from "pixi.js";
import { ViewportManager } from "./ViewportManager";
import { GridRenderer } from "./GridRenderer";
import { CursorRenderer } from "./CursorRenderer";

export class PixiRenderer {
  constructor(container, gameEngine, options = {}) {
    this.container = container;
    this.gameEngine = gameEngine;
    this.options = {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x333333,
      antialias: true,
      tileSize: 50,
      ...options,
    };

    this.app = null;
    this.gridContainer = null;
    this.gridRenderer = null;
    this.cursorRenderer = null;
    this.viewportManager = null;
  }

  async initialize() {
    this.app = new PIXI.Application();
    await this.app.init(this.options);

    this.container.appendChild(this.app.canvas);

    this.gridContainer = new PIXI.Container();
    this.app.stage.addChild(this.gridContainer);

    // Pass gameEngine to GridRenderer
    this.gridRenderer = new GridRenderer(
      this.gridContainer,
      this.options,
      this.gameEngine
    );
    this.cursorRenderer = new CursorRenderer(this.gridContainer);
    this.viewportManager = new ViewportManager(this.app, this.gridContainer);

    this.setupEventListeners();
    this.setupResizeHandler();
  }

  setupEventListeners() {
    this.gameEngine.on("gridUpdate", (grid) => {
      this.gridRenderer.renderGrid(grid);
    });

    this.gameEngine.on("tileUpdate", ({ x, y, color }) => {
      this.gridRenderer.updateTile(x, y, color);
    });

    this.gameEngine.on("playerUpdate", ({ playerId, position }) => {
      this.cursorRenderer.updateCursor(playerId, position);
    });

    this.gameEngine.on("playerRemove", (playerId) => {
      this.cursorRenderer.removeCursor(playerId);
    });
  }

  setupResizeHandler() {
    const handleResize = () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
    }
  }
}
