import { runningQuizes } from "../index.js";

import { dataBase } from "../Database/db.js";
import { getQuizData } from "../Database/getQuizData.js";

export async function joinQuiz(request, response, next) {
  const headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "transfer-encoding": "chunked",
  };
  response.writeHead(200, headers);

  if (
    runningQuizes[request.params.quizId] &&
    runningQuizes[request.params.quizId].quizers.filter(
      (q) => q.userId === request.params.userId
    ).length === 0
  ) {
    dataBase
      .getUser(request.params.userId)
      .then((res, rej) => {
        return res;
      })
      .then((res, rej) => {
        runningQuizes[request.params.quizId].quizers.push({
          userId: request.params.userId,
          name: res.name,
          questionOn: 0,
          response,
          answers: [],
          score: 0,
        });
        runningQuizes[request.params.quizId].quizers.forEach((client) =>
          client.response.write(
            `event: message\ndata:${JSON.stringify({
              type: "join",
              joineedUser: res,
              host: {
                name: runningQuizes[request.params.quizId].host.name,
                userId: runningQuizes[request.params.quizId].host.userId,
              },
              quizers: runningQuizes[request.params.quizId].quizers.map((q) => {
                return { name: q.name, userId: q.userId };
              }),
            })}\n\n`
          )
        );
        runningQuizes[request.params.quizId].host.write(
          `event: message\ndata:${JSON.stringify({
            type: "join",
            joineedUser: res,
            host: {
              name: runningQuizes[request.params.quizId].host.name,
              userId: runningQuizes[request.params.quizId].host.userId,
            },
            quizers: runningQuizes[request.params.quizId].quizers.map((q) => {
              return { name: q.name, userId: q.userId };
            }),
          })}\n\n`
        );
      });
  }

  if (!runningQuizes[request.params.quizId]) {
    //quiz is not already running

    dataBase
      .getUser(request.params.userId)
      .then((res, rej) => res)
      .then((res, rej) => {
        const user = res;
        getQuizData(request.params.quizId)
          .then((res, rej) => res)
          .then(async (res, rej) => {
            if (res.quizUser != request.params.userId) {
              // not your quiz
              response.write(
                `event: message\ndata:${JSON.stringify({
                  type: "failure",
                  reason: "Not hosted",
                })}\n\n`
              );
            } else {
              // start hosting quiz
              let connected = true;
              const host = response;
              host.name = user.name;
              host.userId = user.userId;
              request.on("close", function (err) {
                runningQuizes[request.params.quizId] = null;
              });
              runningQuizes[request.params.quizId] = {
                host,
                quiz: res,
                quizers: [],
                questionOn: -1,
              };
            }
          });
      });
  }
}
