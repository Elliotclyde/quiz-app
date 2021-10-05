import { dataBase } from "../Database/db.js";
import { getQuizData } from "../Database/getQuizData.js";

export async function deleteQuiz(request, response) {
  // As this will come back from the edit page we don't want to use any edited data
  // So instead grab the data as it currently exists in the db to delete

  getQuizData(request.params.quizId).then(async (res, err) => {
    const answersToDelete = res.questions
      .map((q) => {
        return q.answers;
      })
      .flat();

    // Delete answers first

    answersToDelete.reduce(async (previousPromise, nextAnswer) => {
      await previousPromise;
      return dataBase.deleteAnswer(nextAnswer.answerId);
    }, Promise.resolve());

    // Then questions

    res.questions.reduce(async (previousPromise, nextQuestion) => {
      await previousPromise;

      return dataBase.deleteQuestion(nextQuestion.questionId);
    }, Promise.resolve());

    // Then quiz

    await dataBase.deleteQuiz(request.params.quizId);
    response.json({ result: "deleted" });
    response.end();
  });
}
