import express, { response } from "express";
import cors from "cors";

import { createQuiz } from "./Controllers/createQuiz.js";
import { getQuiz } from "./Controllers/getQuiz.js";
import { updateQuiz } from "./Controllers/updateQuiz.js";
import { deleteQuiz } from "./Controllers/deleteQuiz.js";

import { createUser } from "./Controllers/createUser.js";
import { getUserQuizes } from "./Controllers/getUserQuizes.js";
import { dataBase } from "./Database/db.js";
import { getQuizData } from "./Database/getQuizData.js";

//TODO:

// The app should return a link after the creation or editing of a quiz has completed.
// Need to have some sort of identity in local storage.
// And to record the id of the person who created the quiz.

// New database table - users
// Stores id and nickname
// quizes need to be owned by a user

// When we create a quiz the front end needs to check if local storage has a user id and send it with the data
// If not, the front end should send the data without a userID
// Then the backend creates a userId, adds it to the database, and sends it back

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

let runningQuizes = {};

const eventStreamCorsOptions = {
  origin: true,
  credentials: true,
};

// Grab a complete quiz

app.get("/", (req, res) => {
  res.json({ Hello: "world" });
});

app.post("/create-user/", createUser);
app.get("/get-user-quizes/:userId", getUserQuizes);

app.post("/create-quiz/", createQuiz);
app.post("/edit-quiz/:quizId", updateQuiz);
app.post("/delete-quiz/:quizId", deleteQuiz);
app.get("/get-quiz/:quizId?", getQuiz);

app.get(
  "/join-quiz/:quizId/:userId",
  cors(eventStreamCorsOptions),
  async function (request, response, next) {
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
          console.log(res);

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
                quizers: runningQuizes[request.params.quizId].quizers.map(
                  (q) => {
                    return { name: q.name, userId: q.userId };
                  }
                ),
              })}\n\n`
            )
          );
          runningQuizes[request.params.quizId].host.write(
            `event: message\ndata:${JSON.stringify({
              type: "join",
              joineedUser: res,
              quizers: runningQuizes[request.params.quizId].quizers.map((q) => {
                return { name: q.name, userId: q.userId };
              }),
            })}\n\n`
          );
        });
    }

    if (!runningQuizes[request.params.quizId]) {
      //quiz is not already running
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
            request.on("close", function (err) {
              runningQuizes[request.params.quizId] = null;
            });
            runningQuizes[request.params.quizId] = {
              host: response,
              quiz: res,
              quizers: [],
              questionOn: -1,
            };
          }
        });
    }

    const clientId = Date.now();

    const newClient = {
      id: clientId,
      response,
    };
  }
);

app.post("/start-quiz/:quizId", function (request, response, next) {
  getQuizData(request.params.quizId)
    .then((quiz, rej) => quiz)
    .then((quiz, rej) => {
      runningQuizes[request.params.quizId].questionOn = 0;
      runningQuizes[request.params.quizId].host.write(
        `event: message\ndata:${JSON.stringify({
          type: "start",
          question: quiz.questions[0],
        })}\n\n`
      );
      runningQuizes[request.params.quizId].quizers.forEach((client) =>
        client.response.write(
          `event: message\ndata:${JSON.stringify({
            type: "start",
            question: quiz.questions[0],
          })}\n\n`
        )
      );
    });

  response.json({ result: "success" });
});

app.post(
  "/answer-question/:quizId/:userId",
  function (request, response, next) {
    console.log(request.rawHeaders);
    const answerIndex = request.body.answerIndex;
    const userId = request.params.userId;
    const runningQuiz = runningQuizes[request.params.quizId];

    const isCorrect =
      runningQuiz.quiz.questions[runningQuiz.questionOn].answers[answerIndex]
        .isCorrect;

    const answerBody =
      runningQuiz.quiz.questions[runningQuiz.questionOn].answers[answerIndex]
        .body;

    runningQuiz.quizers = runningQuiz.quizers.map((quizer) => {
      if (quizer.userId == userId) {
        return {
          ...quizer,
          answers: [
            ...quizer.answers,
            { answerIndex, isCorrect, body: answerBody },
          ],
          questionOn: quizer.questionOn + 1,
          score: isCorrect ? quizer.score + 1 : quizer.score,
        };
      } else return quizer;
    });

    // If all on the same question
    if (
      runningQuiz.quizers.filter((quizer) => {
        console.log(quizer.questionOn);
        return quizer.questionOn != runningQuiz.quizers[0].questionOn;
      }).length == 0
    ) {
      getQuizData(request.params.quizId)
        .then((quiz, rej) => quiz)
        .then((quiz, rej) => {
          // If all on the same question and it's the last one
          if (quiz.questions.length == runningQuiz.quizers[0].questionOn) {
            // Questions finished - return done

            runningQuiz.host.write(
              `event: message\ndata:${JSON.stringify({
                type: "end",
                // Add data of all the answers that were right/wrong
                quizers: runningQuiz.quizers.map((q) => {
                  return {
                    name: q.name,
                    id: q.userId,
                    answers: q.answers,
                    score: q.score,
                  };
                }),
              })}\n\n`
            );
            runningQuiz.quizers.forEach((client) => {
              client.response.write(
                `event: message\ndata:${JSON.stringify({
                  type: "end",
                  // Add data of all the answers that were right/wrong
                  quizers: runningQuiz.quizers.map((q) => {
                    return {
                      name: q.name,
                      id: q.userId,
                      answers: q.answers,
                      score: q.score,
                    };
                  }),
                })}\n\n`
              );
              client.response.end();
            });
          } else {
            // Still questions left? Send event to all quizers that it's time to move to the next question

            runningQuiz.questionOn =
              runningQuizes[request.params.quizId].quizers[0].questionOn;

            runningQuiz.host.write(
              `event: message\ndata:${JSON.stringify({
                type: "nextQuestion",
                question: quiz.questions[runningQuiz.quizers[0].questionOn],
              })}\n\n`
            );
            runningQuiz.quizers.forEach((client) =>
              client.response.write(
                `event: message\ndata:${JSON.stringify({
                  type: "nextQuestion",
                  question:
                    quiz.questions[
                      runningQuizes[request.params.quizId].quizers[0].questionOn
                    ],
                })}\n\n`
              )
            );
          }
        });
    } else {
      runningQuiz.host.write(
        `event: message\ndata:{\"All\":\"Different\"}\n\n`
      );
    }
    response.end();
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
