window.onload = function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Example: Draw a rectangle
  context.fillStyle = "blue";
  context.fillRect(50, 50, 150, 100);

  const port = 11100;
  // Socket.IO connection
  const socket = io("http://localhost:" + port);

  socket.on("connect", () => {
    console.log("Connected to the server!");
  });

  socket.on("message", (data) => {
    console.log("Received from server:", data);
  });
};
