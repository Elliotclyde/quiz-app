import express, { response } from "express";
import { createQuiz } from "./Controllers/createquiz.js";
import { getQuiz } from "./Controllers/getquiz.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

// Grab a complete quiz

app.get("/", (req, res) => {
  res.json({ Hello: "world" });
});

app.post("/create-quiz/", createQuiz);

app.get("/get-quiz/:quizId", getQuiz);

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
