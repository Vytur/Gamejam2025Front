// src/rendering/ViewportManager.js
export class ViewportManager {
  constructor(app, container, gameEngine) {
    this.app = app;
    this.container = container;
    this.gameEngine = gameEngine;
    this.isDragging = false;
    this.lastPosition = { x: 0, y: 0 };
    this.minZoom = 0.1;
    this.maxZoom = 3;
    this.tileSize = 50;

    // Throttling setup
    this.lastCursorUpdate = 0;
    this.CURSOR_UPDATE_INTERVAL = 100; // 100ms = 10 updates per second
    this.pendingCursorUpdate = null;

    this.setupInteractions();
    this.setupCursorTracking();
  }

  setupCursorTracking() {
    this.app.canvas.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
  }

  handleMouseMove(event) {
    const currentTime = Date.now();

    // Clear any pending timeouts
    if (this.pendingCursorUpdate) {
      clearTimeout(this.pendingCursorUpdate);
    }

    // If we haven't updated recently, update immediately
    if (currentTime - this.lastCursorUpdate >= this.CURSOR_UPDATE_INTERVAL) {
      this.updateCursorPosition(event);
      this.lastCursorUpdate = currentTime;
    } else {
      // Otherwise, schedule an update for when the interval has passed
      this.pendingCursorUpdate = setTimeout(() => {
        this.updateCursorPosition(event);
        this.lastCursorUpdate = Date.now();
      }, this.CURSOR_UPDATE_INTERVAL - (currentTime - this.lastCursorUpdate));
    }
  }

  updateCursorPosition(event) {
    const bounds = this.app.canvas.getBoundingClientRect();
    const position = this.convertScreenToGridPosition(event, bounds);
    this.gameEngine.updateCursorPosition(position);
  }

  convertScreenToGridPosition(event, bounds) {
    return {
      x:
        (event.clientX - bounds.left - this.container.position.x) /
        (this.tileSize * this.container.scale.x),
      y:
        (event.clientY - bounds.top - this.container.position.y) /
        (this.tileSize * this.container.scale.y),
    };
  }

  setupInteractions() {
    this.app.stage.eventMode = "static";
    this.setupDragAndPan();
    this.setupZoom();
  }

  setupDragAndPan() {
    this.app.stage.on("pointerdown", this.handleDragStart.bind(this));
    this.app.stage.on("pointermove", this.handleDragMove.bind(this));
    this.app.stage.on("pointerup", this.handleDragEnd.bind(this));
    this.app.stage.on("pointerupoutside", this.handleDragEnd.bind(this));
  }

  setupZoom() {
    this.app.canvas.addEventListener("wheel", this.handleZoom.bind(this));
  }

  handleDragStart(event) {
    this.isDragging = false; // Don't start dragging immediately
    this.startPosition = { x: event.globalX, y: event.globalY };
  }
  
  handleDragMove(event) {
    if (!this.startPosition) return;
  
    const dx = event.globalX - this.startPosition.x;
    const dy = event.globalY - this.startPosition.y;
    const dragThreshold = 20; // Adjust this threshold as needed
  
    // Only enable dragging if movement exceeds the threshold
    if (!this.isDragging && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) {
      this.isDragging = true;
    }
  
    if (this.isDragging) {
      this.container.position.x += dx;
      this.container.position.y += dy;
      this.startPosition = { x: event.globalX, y: event.globalY };
    }
  }
  
  handleDragEnd(event) {
    this.startPosition = null;
    this.isDragging = false;
  }

  handleZoom(event) {
    event.preventDefault();

    const mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    const worldPos = {
      x: (mousePosition.x - this.container.position.x) / this.container.scale.x,
      y: (mousePosition.y - this.container.position.y) / this.container.scale.y,
    };

    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const newScale = this.container.scale.x * zoomFactor;

    if (newScale >= this.minZoom && newScale <= this.maxZoom) {
      this.container.scale.set(newScale);
      this.container.position.x =
        mousePosition.x - worldPos.x * this.container.scale.x;
      this.container.position.y =
        mousePosition.y - worldPos.y * this.container.scale.y;
    }
  }
}
