import express, { response } from "express";
import cors from "cors";

import { createQuiz } from "./Controllers/createQuiz.js";
import { getQuiz } from "./Controllers/getQuiz.js";
import { updateQuiz } from "./Controllers/updateQuiz.js";
import { deleteQuiz } from "./Controllers/deleteQuiz.js";

import { joinQuiz } from "./Controllers/joinQuiz.js";
import { startQuiz } from "./Controllers/startQuiz.js";
import { answerQuestion } from "./Controllers/answerQuestion.js";

import { createUser } from "./Controllers/createUser.js";
import { getUserQuizes } from "./Controllers/getUserQuizes.js";

import { dataBase } from "./Database/db.js";
//TODO:

/*

Instead of the way create/edit works, it should immediately create a blank quiz and then start to edit it. 

At the bottom of the create/edit page it should show a "save" button which will just save it and a "save and host" button.

This will take you to the quiz page.

Also the quizzing page needs to show something

Also after you're finished editing it it 

*/
dataBase.initialise();
const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

export let runningQuizes = {};

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

app.get("/join-quiz/:quizId/:userId", cors(eventStreamCorsOptions), joinQuiz);

app.post("/start-quiz/:quizId", startQuiz);

app.post("/answer-question/:quizId/:userId", answerQuestion);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
