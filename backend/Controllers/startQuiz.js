import { runningQuizes } from "../index.js";
import { getQuizData } from "../Database/getQuizData.js";
export function startQuiz(request, response, next) {
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
  response.end();
}
