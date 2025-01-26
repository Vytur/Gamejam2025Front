import { initGrid, drawGrid } from "./grid.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const port = 11100;
  // Socket.IO connection
  const socket = io("http://localhost:" + port);

  socket.on("connect", () => {
    console.log("Connected to the server!");
  });

  socket.on("message", (data) => {
    console.log("Received from server:", data);
  });

  initGrid();
  drawGrid();
};
