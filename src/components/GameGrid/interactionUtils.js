// src/components/GameGrid/interactionUtils.js
export const setupZoomAndPan = ({
  app,
  gridContainer,
  minZoom,
  maxZoom,
  onPanComplete
}) => {
  let isDragging = false;
  let lastPosition = { x: 0, y: 0 };
  let panTimeout = null;

  app.stage.eventMode = 'static';
  app.stage.on('pointerdown', (event) => {
    isDragging = true;
    lastPosition = { x: event.globalX, y: event.globalY };
  });

  app.stage.on('pointermove', (event) => {
    if (isDragging) {
      const dx = event.globalX - lastPosition.x;
      const dy = event.globalY - lastPosition.y;
      
      gridContainer.position.x += dx;
      gridContainer.position.y += dy;
      
      lastPosition = { x: event.globalX, y: event.globalY };

      // Clear existing timeout
      if (panTimeout) {
        clearTimeout(panTimeout);
      }

      // Set new timeout to trigger onPanComplete
      panTimeout = setTimeout(() => {
        onPanComplete();
      }, 100); // Small delay to avoid too frequent updates
    }
  });

  app.stage.on('pointerup', () => {
    isDragging = false;
    onPanComplete();
  });

  app.stage.on('pointerupoutside', () => {
    isDragging = false;
    onPanComplete();
  });

  app.canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    
    const mousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    const worldPos = {
      x: (mousePosition.x - gridContainer.position.x) / gridContainer.scale.x,
      y: (mousePosition.y - gridContainer.position.y) / gridContainer.scale.y
    };
    
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const newScale = gridContainer.scale.x * zoomFactor;
    
    if (newScale >= minZoom && newScale <= maxZoom) {
      gridContainer.scale.set(newScale);
      gridContainer.position.x = mousePosition.x - worldPos.x * gridContainer.scale.x;
      gridContainer.position.y = mousePosition.y - worldPos.y * gridContainer.scale.y;
      
      // Trigger viewport update after zoom
      onPanComplete();
    }
  });
};