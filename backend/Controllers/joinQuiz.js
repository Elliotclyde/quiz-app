import { currentRooms } from "../index.js";

import { dataBase } from "../Database/db.js";
import { getQuizData } from "../Database/getQuizData.js";

//  This should

//  1. Check whether they are a host (the quiz is theirs)
//  2. If they are a host, check whether they're already hosting a quiz and disconnected, then rejoin that one
//  3. Otherwise, create a new quiz instance, with a RANDOM ID (this is going to be the url) and add the host to activeUsers

//  4. If they are not a host, check whether they're already in a quiz and disconnected, then rejoin that one
//  5. Otherwise, add the quizer to the list of quizers, both in the quiz and in the list of activeUsers
//  6. All the connections need to listen for when they are disconnected and keep a reference to the question they are on, and their answers so far
//  7. This means when they re-join, the endpoint should find the user in activeUsers first.

export async function joinQuiz(request, response, next) {
  const { roomId } = request.params;
  const userId = parseInt(request.params.userId);

  if (!currentRooms[roomId]) {
    return response.status(400).send({
      message: "This room is not being hosted!",
    });
  }

  const headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "transfer-encoding": "chunked",
  };

  response.writeHead(200, headers);

  // First - is this the host joining?

  if (currentRooms[roomId].data.host === userId) {
    console.log("host");

    currentRooms[roomId].data.hostConnected = true;
    currentRooms[roomId].connections.push(response);
    response.write(
      `event: message\ndata:${JSON.stringify({
        type: "host",
        ...currentRooms[roomId].data,
      })}\n\n`
    );

    currentRooms[roomId].connections.forEach((connection) => {
      connection.write(
        `event: message\ndata:${JSON.stringify({
          type: "host",
          ...currentRooms[roomId].data,
        })}\n\n`
      );
    });

    request.on("close", function () {
      if (currentRooms[roomId]) {
        currentRooms[roomId].connections = currentRooms[
          roomId
        ].connections.filter((r) => r != request);
        if (currentRooms[roomId].connections.length === 0) {
          currentRooms[roomId] = null;
        }
        currentRooms[roomId].data.hostConnected = false;
        currentRooms[roomId].connections.forEach((connection) => {
          connection.write(
            `event: message\ndata:${JSON.stringify({
              type: "disconnect",
              ...currentRooms[roomId].data,
            })}\n\n`
          );
        });
        console.log("DISCONNECTED");
      }
    });
  }
  // Now is it a user joining?
  else {
    const userData = await dataBase.getUser(userId);

    if (
      currentRooms[roomId].data.quizers.filter((q) => q.userId == userId)
        .length != 0
    ) {
      currentRooms[roomId].data.quizers.forEach((quizer) => {
        if (quizer.userId == userId) {
          quizer.connected = true;
        }
      });
    } else {
      currentRooms[roomId].data.quizers.push({
        userId,
        name: userData.name,
        hasAnswered: false,
        answers: [],
        score: 0,
        connected: true,
      });
    }
    currentRooms[roomId].connections.push(response);

    currentRooms[roomId].connections.forEach((connection) => {
      connection.write(
        `event: message\ndata:${JSON.stringify({
          type: "join",
          ...currentRooms[roomId].data,
        })}\n\n`
      );
    });
  }

  request.on("close", function () {
    if (currentRooms[roomId]) {
      currentRooms[roomId].connections = currentRooms[
        roomId
      ].connections.filter((r) => r != request);
      if (currentRooms[roomId].connections.length === 0) {
        currentRooms[roomId] = null;
      }
      currentRooms[roomId].data.quizers.forEach((q) => {
        if (q.userId == userId) {
          q.connected = false;
        }
      });
      currentRooms[roomId].connections.forEach((connection) => {
        connection.write(
          `event: message\ndata:${JSON.stringify({
            type: "disconnect",
            ...currentRooms[roomId].data,
          })}\n\n`
        );
      });
      console.log("DISCONNECTED");
    }
  });
}
