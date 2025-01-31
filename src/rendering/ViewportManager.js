// src/rendering/ViewportManager.js
export class ViewportManager {
    constructor(app, container) {
      this.app = app;
      this.container = container;
      this.isDragging = false;
      this.lastPosition = { x: 0, y: 0 };
      this.minZoom = 0.1;
      this.maxZoom = 3;
  
      this.setupInteractions();
    }
  
    setupInteractions() {
      this.app.stage.eventMode = 'static';
      this.setupDragAndPan();
      this.setupZoom();
    }
  
    setupDragAndPan() {
      this.app.stage.on('pointerdown', this.handleDragStart.bind(this));
      this.app.stage.on('pointermove', this.handleDragMove.bind(this));
      this.app.stage.on('pointerup', this.handleDragEnd.bind(this));
      this.app.stage.on('pointerupoutside', this.handleDragEnd.bind(this));
    }
  
    setupZoom() {
      this.app.canvas.addEventListener('wheel', this.handleZoom.bind(this));
    }
  
    handleDragStart(event) {
      this.isDragging = true;
      this.lastPosition = { x: event.globalX, y: event.globalY };
    }
  
    handleDragMove(event) {
      if (!this.isDragging) return;
  
      const dx = event.globalX - this.lastPosition.x;
      const dy = event.globalY - this.lastPosition.y;
      
      this.container.position.x += dx;
      this.container.position.y += dy;
      
      this.lastPosition = { x: event.globalX, y: event.globalY };
    }
  
    handleDragEnd() {
      this.isDragging = false;
    }
  
    handleZoom(event) {
      event.preventDefault();
      
      const mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      
      const worldPos = {
        x: (mousePosition.x - this.container.position.x) / this.container.scale.x,
        y: (mousePosition.y - this.container.position.y) / this.container.scale.y
      };
      
      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      const newScale = this.container.scale.x * zoomFactor;
      
      if (newScale >= this.minZoom && newScale <= this.maxZoom) {
        this.container.scale.set(newScale);
        this.container.position.x = mousePosition.x - worldPos.x * this.container.scale.x;
        this.container.position.y = mousePosition.y - worldPos.y * this.container.scale.y;
      }
    }
  }