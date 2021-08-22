import express, { response } from "express";
import cors from "cors";
import { dataBase } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

dataBase.initialise();

const { quizId } = dataBase.newQuiz("cool");
const { questionId } = dataBase.newQuestion(
  "What is the most populous city in NZ?",
  quizId
);

dataBase.newAnswer("Auckland", true, questionId);
dataBase.newAnswer("Wellington", false, questionId);
dataBase.newAnswer("Dunedin", false, questionId);
dataBase.newAnswer("Palmerston North", false, questionId);

dataBase.getQuiz(quizId, (quiz) => {
  let currentQuizId = quiz.quizid;
  let questions = [];

  dataBase.getQuizQuestions(currentQuizId, (data) => {
    data.forEach((q) => {
      console.log(q.questionid);
      dataBase.getQuestionAnswers(q.questionid, (data) => {
        q.answers = data;
        questions.push(q);
      });
    });
  });
  setTimeout(() => {
    questions.map((q) => {
      console.log(q.body);
      q.answers.map((a) =>
        console.log(a.body + (a.iscorrect == 1 ? " correct" : ""))
      );
    });
  }, 10);
});

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
