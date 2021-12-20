import { dataBase } from "../Database/db.js";

// gets the id from the request and returns quiz data with the id

// TODO: add error handling

export async function getQuiz(request, response) {
  if (request.params.quizId === undefined) {
    dataBase
      .getQuizes()
      .then((res, rej) => {
        return res;
      })
      .then((res, rej) => {
        response.json(res);
      });
  } else {
    const data = await dataBase.getQuizData(request.params.quizId);
    response.json(data);

    response.end();
  }
}
