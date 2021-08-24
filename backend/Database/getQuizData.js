import { dataBase } from "../db.js";

export async function getQuizData(quizId) {
  let databaseQuiz;
  let databaseQuestions;

  return await dataBase
    .getQuiz(quizId)
    .then((res, rej) => {
      databaseQuiz = res;
      console.log(quizId);
      return res;
    })
    .then((res, rej) => {
      return dataBase.getQuizQuestions(databaseQuiz.quizid);
    })
    .then((res, rej) => {
      databaseQuestions = res;
      let promises = [];
      databaseQuestions.forEach((question) => {
        promises.push(dataBase.getQuestionAnswers(question.questionid));
      });
      return Promise.all(promises);
    })
    .then((res, rej) => {
      res.forEach((promise) => console.log(promise));
      databaseQuestions.forEach((question, index) => {
        question.answers = res[index];
      });
      databaseQuiz.questions = databaseQuestions;
      return databaseQuiz;
    });
}
