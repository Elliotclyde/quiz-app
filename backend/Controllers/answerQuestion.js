import { runningQuizes } from "../index.js";
import { getQuizData } from "../Database/getQuizData.js";
export function answerQuestion(request, response, next) {
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

  const currentQuizer = runningQuiz.quizers.filter(
    (q) => q.userId === request.params.userId
  )[0];
  // If all on the same question
  if (
    runningQuiz.quizers.filter((quizer) => {
      return quizer.questionOn !== runningQuiz.quizers[0].questionOn;
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
              quiz,
              // Add data of all the answers that were right/wrong
              quizers: runningQuiz.quizers.map((q) => {
                return {
                  name: q.name,
                  userId: q.userId,
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
                quiz,
                // Add data of all the answers that were right/wrong
                quizers: runningQuiz.quizers.map((q) => {
                  return {
                    name: q.name,
                    userId: q.userId,
                    answers: q.answers,
                    score: q.score,
                  };
                }),
              })}\n\n`
            );
          });
        } else {
          // Still questions left? Send event to all quizers that it's time to move to the next question

          runningQuiz.questionOn =
            runningQuizes[request.params.quizId].quizers[0].questionOn;

          runningQuiz.host.write(
            `event: message\ndata:${JSON.stringify({
              type: "nextQuestion",
              answered: {
                name: currentQuizer.name,
                isCorrect:
                  currentQuizer.answers[currentQuizer.questionOn - 1].isCorrect,
              },
              question: quiz.questions[runningQuiz.quizers[0].questionOn],
            })}\n\n`
          );
          runningQuiz.quizers.forEach((client) =>
            client.response.write(
              `event: message\ndata:${JSON.stringify({
                type: "nextQuestion",
                answered: {
                  name: currentQuizer.name,
                  isCorrect:
                    currentQuizer.answers[currentQuizer.questionOn - 1]
                      .isCorrect,
                },
                question:
                  quiz.questions[
                    runningQuizes[request.params.quizId].quizers[0].questionOn
                  ],
              })}\n\n`
            )
          );
        }
      });
    response.end();
  } else {
    runningQuiz.host.write(
      `event: message\ndata:${JSON.stringify({
        type: "answer",
        answered: {
          name: currentQuizer.name,
          isCorrect:
            currentQuizer.answers[currentQuizer.questionOn - 1].isCorrect,
        },
      })}\n\n`
    );
    runningQuiz.quizers.forEach((client) =>
      client.response.write(
        `event: message\ndata:${JSON.stringify({
          type: "answer",
          answered: {
            name: currentQuizer.name,
            isCorrect:
              currentQuizer.answers[currentQuizer.questionOn - 1].isCorrect,
          },
        })}\n\n`
      )
    );
    response.end();
  }
}
