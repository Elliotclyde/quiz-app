import { dataBase } from "../Database/db.js";

// gets the id from the request and returns quiz data with the id

// TODO: add error handling

export async function getUserQuizes(request, response) {
  dataBase
    .getUserQuizes(request.params.userId)
    .then((res, rej) => {
      return res;
    })
    .then((res, rej) => {
      response.json(res);
    });
}
