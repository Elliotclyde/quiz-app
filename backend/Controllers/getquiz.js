import { getQuizData } from "../Database/getQuizData.js";

// gets the id from the request and returns quiz data with the id

// TODO: add error handling

export async function getQuiz(request, response) {
  const data = await getQuizData(request.params.quizId);
  response.json(data);
}
