import express, { response } from "express";
import cors from "cors";

import { createQuiz } from "./Controllers/createQuiz.js";
import { getQuiz } from "./Controllers/getQuiz.js";
import { updateQuiz } from "./Controllers/updateQuiz.js";
import { deleteQuiz } from "./Controllers/deleteQuiz.js";

import { createUser } from "./Controllers/createUser.js";
import { getUserQuizes } from "./Controllers/getUserQuizes.js";

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

const eventStreamCorsOptions = {
  origin: true,
  credentials: true,
};

const cities = ["London", "Paris", "Vienna", "Shanghai", "Mexico", "Lagos"];

app.get("/events/", cors(eventStreamCorsOptions), async (req, res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "transfer-encoding": "chunked",
  });
  res.flushHeaders();

  let connected = true;
  req.on("close", function (err) {
    connected = false;
  });
  while (connected) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const num = Math.floor(Math.random() * cities.length);
    res.write("event: message\n");
    console.log(cities[num]);
    res.write(`data: ${cities[num]}\n\n`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
