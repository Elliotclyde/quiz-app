import { dataBase } from "../Database/db.js";

// gets the id from the request and returns quiz data with the id

// TODO: add error handling

export async function getUserQuizes(request, response) {
  dataBase
    .getAll({ table: "quiz", column: "quizuser", value: request.params.userId })
    .then((res, rej) => {
      return res;
    })
    .then((res, rej) => {
      response.json(res);

      response.end();
    });
}
