import { nanoid } from "nanoid";
import { currentRooms } from "../index.js";
import { dataBase } from "../Database/db.js";
import { getQuizData } from "../Database/getQuizData.js";

export async function hostQuiz(req, response) {
  const userId = parseInt(req.body.userId);
  const quizId = parseInt(req.body.quizId);

  const quizData = await getQuizData(quizId);
  const userData = await dataBase.getUser(userId);

  const roomId = nanoid();

  currentRooms[roomId] = {
    data: {
      quiz: quizData,
      host: userId,
      hostConnected: false,
      quizers: [],
      currentQuestionIndex: 0,
      hasStarted: false,
    },
    connections: [],
  };

  response.json({ roomId });
}
