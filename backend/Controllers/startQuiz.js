import { currentRooms } from "../index.js";

export function startQuiz(request, response, next) {
  const roomId = request.body.roomId;

  currentRooms[roomId].data.hasStarted = true;

  currentRooms[roomId].connections.forEach((connection) => {
    connection.write(
      `event: message\ndata:${JSON.stringify({
        type: "start",
        ...currentRooms[roomId].data,
      })}\n\n`
    );
  });

  response.json({ result: "success" });
  response.end();
}
