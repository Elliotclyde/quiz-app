import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { createQuiz } from "./Controllers/createQuiz.js";
import { getQuiz } from "./Controllers/getQuiz.js";
import { updateQuiz } from "./Controllers/updateQuiz.js";
import { deleteQuiz } from "./Controllers/deleteQuiz.js";

import { hostQuiz } from "./Controllers/hostQuiz.js";
import { joinQuiz } from "./Controllers/joinQuiz.js";
import { startQuiz } from "./Controllers/startQuiz.js";
import { answerQuestion } from "./Controllers/answerQuestion.js";

import { createUser } from "./Controllers/createUser.js";
import { getUserQuizes } from "./Controllers/getUserQuizes.js";

import { dataBase } from "./Database/db.js";

//TODO:

dotenv.config();
dataBase.initialise();
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

export let currentRooms = {};
//This lists so when a random rejoin comes in we can check if they're connected to a quiz (if the )
export let activeUsers = {};

const eventStreamCorsOptions = {
  origin: true,
  credentials: true,
};
app.post("/create-user/", createUser);
app.get("/get-user-quizes/:userId", getUserQuizes);

app.post("/create-quiz/", createQuiz);
app.post("/edit-quiz/:quizId", updateQuiz);
app.post("/delete-quiz/:quizId", deleteQuiz);
app.get("/get-quiz/:quizId?", getQuiz);

// for when the host asks to host a quiz - should send back a unique id for the new Url
app.post("/host-quiz/", hostQuiz);
// for when the user first arrives - opens up an event stream - which needs to be a get method so needs to pass
// user id in URL
app.get("/join-quiz/:roomId/:userId", cors(eventStreamCorsOptions), joinQuiz);
// for when the host clicks start
app.post("/start-quiz/", startQuiz);
// for each time the quizers answer a question after
app.post("/answer/", answerQuestion);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
