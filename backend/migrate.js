import { dataBase } from "./Database/db.js";

dataBase.initialise();

// async function seed() {
//   let quiz;
//   let question;
//   let answer;
//   dataBase
//     .newQuiz("cool")
//     .then((res, rej) => {
//       quiz = res;
//       return res;
//     })
//     .then((res, rej) => {
//       return dataBase.newQuestion(
//         "What is the most populous city in New Zealand",
//         quiz.quizid
//       );
//     })
//     .then((res, rej) => {
//       question = res;
//       return res;
//     })
//     .then((res, rej) => {
//       return Promise.all([
//         dataBase.newAnswer("Wellington", false, question.questionid),
//         dataBase.newAnswer("Palmerston North", false, question.questionid),
//         dataBase.newAnswer("Dunedin", false, question.questionid),
//         dataBase.newAnswer("Auckland", true, question.questionid),
//       ]);
//     })
//     .then((res, rej) => {
//       answer = res;
//       return dataBase.getQuizQuestions(quiz.quizid);
//     })
//     .then((res, rej) => {
//       console.log(res);
//       return dataBase.getQuestionAnswers(question.questionid);
//     })
//     .then((res, rej) => {
//       console.log(res);
//     });
// }

// seed();
