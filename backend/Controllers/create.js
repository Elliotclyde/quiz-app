import { dataBase } from "../db.js";

export function create(req, response) {
  const data = req.body;
  console.log(data);
  // Do checks and validate data here
  // Send back error if data is invalid

  let databaseQuiz;
  let databaseQuestions;
  // Add to database
  dataBase
    .newQuiz(data.title)
    .then((res, rej) => {
      databaseQuiz = res;
      return res;
    })
    .then((res, rej) => {
      return mapQuestions(data.questions, databaseQuiz.quizid);
    })
    .then(async (res, rej) => {
      databaseQuestions = res;
      let answerArray = [];

      for (const [index, question] of databaseQuestions.entries()) {
        answerArray.push(
          await mapAnswers(data.questions[index].answers, question.questionid)
        );
      }

      return Promise.all(answerArray);
    })
    .then((res, rej) => {
      console.log(res);
      databaseQuestions.forEach((question) => {
        question.answers = [];
        res.forEach((arr) => {
          arr.forEach((answer) => {
            if (answer.answerquestion === question.questionid) {
              question.answers.push(answer);
            }
          });
        });
      });
      databaseQuiz.questions = databaseQuestions;
      response.json(databaseQuiz);
    });
}

const mapQuestions = async (qs, quizId) => {
  let actions = [];
  for (const x of qs) {
    let promise = await dataBase.newQuestion(x.body, quizId);
    actions.push(promise);
  }
  return actions;
};

const mapAnswers = async (as, questionId) => {
  let actions = [];
  for (const x of as) {
    let promise = await dataBase.newAnswer(x.body, x.isCorrect, questionId);
    actions.push(promise);
  }
  return actions;
};
