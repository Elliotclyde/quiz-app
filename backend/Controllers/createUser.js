import { dataBase } from "../Database/db.js";

export function createUser(req, response) {
  const data = req.body;
  // Do checks and validate data here
  // Send back error if data is invalid

  let databaseUser;
  // Add to database
  dataBase
    .newUser(data.name)
    .then((res, rej) => {
      databaseUser = res;
      return res;
    })
    .then((res, rej) => {
      response.json(databaseUser);
    });
}
