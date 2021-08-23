import express, { response } from "express";
import cors from "cors";
import { dataBase } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

dataBase.initialise();

async function migrate() {
  let quiz;
  let question;
  let answer;
  dataBase
    .newQuiz("cool")
    .then((res, rej) => {
      quiz = res;
      return res;
    })
    .then((res, rej) => {
      return dataBase.newQuestion(
        "What is the most populous city in New Zealand",
        quiz.quizid
      );
    })
    .then((res, rej) => {
      question = res;
      return res;
    })
    .then((res, rej) => {
      return Promise.all([
        dataBase.newAnswer("Wellington", false, question.questionid),
        dataBase.newAnswer("Palmerston North", false, question.questionid),
        dataBase.newAnswer("Dunedin", false, question.questionid),
        dataBase.newAnswer("Auckland", true, question.questionid),
      ]);
    })
    .then((res, rej) => {
      answer = res;
      return dataBase.getQuizQuestions(quiz.quizid);
    })
    .then((res, rej) => {
      console.log(res);
      return dataBase.getQuestionAnswers(question.questionid);
    })
    .then((res, rej) => {
      console.log(res);
    });
}

migrate();

// Grab a complete quiz

app.get("/", (req, res) => {
  res.json({ Hello: "world" });
});

app.post("/create-quiz/", (req, res) => {
  console.log(req.body.title);
});

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
