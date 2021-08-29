import { dataBase } from "./Database/db.js";

dataBase
  .updateAnswer(0, {
    body: "blablbab",
    isCorrect: 0,
  })
  .then((res, rej) => {
    console.log(res);
  });
