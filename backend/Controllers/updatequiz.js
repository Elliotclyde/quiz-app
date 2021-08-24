import { dataBase } from "../Database/db.js";

export function updateQuiz(req, response) {
  // The quiz has to have an ID already so automatically update the title based on data received- no matter what

  // Check through the rest of the data to see if there is an ID present
  // If there is no ID present then create a new question/answer associated with its parent

  // Then we have to query whether there are any questions with the quiz id but NOT in the returned data
  // And delete these

  // Then any answers associated with a question ID which no longer exists
  // And delete these

  const oldQuizData = await getQuizData(request.params.quizId);
  const newQuizData = req.body;

  // First update quiz Id if new

  dataBase.updateQuiz(request.params.quizId, { title: newQuizData.title });

  // Next, create any new questions/answers
  newQuizData.questions.forEach((newQuestion) => {
    // if newQuestion.id is undefined, add to database

    newQuestion.answers.forEach((oldAnswer) => {
      // if newQuestion.id is undefined, add to database
    });
  });

  // Next, update or, if needed, delete any old questions
  oldQuizData.questions.forEach((oldQuestion) => {
    // Check if there is a new question with the same id.
    // If so, update the body with the new question's body
    // If there is no new question with a matching id, delete the old question from the database

    oldQuestion.answers.forEach((oldAnswer) => {});
  });
}

// export function createQuiz(req, response) {
//     const data = req.body;
//     // Do checks and validate data here
//     // Send back error if data is invalid

//     let databaseQuiz;
//     let databaseQuestions;
//     // Add to database
//     dataBase
//       .newQuiz(data.title)
//       .then((res, rej) => {
//         databaseQuiz = res;

//         console.log(res);
//         return res;
//       })
//       .then((res, rej) => {
//         return mapQuestions(data.questions, databaseQuiz.quizid);
//       })
//       .then(async (res, rej) => {
//         databaseQuestions = res;
//         let answerArray = [];

//         for (const [index, question] of databaseQuestions.entries()) {
//           answerArray.push(
//             await mapAnswers(data.questions[index].answers, question.questionid)
//           );
//         }

//         return Promise.all(answerArray);
//       })
//       .then((res, rej) => {
//         databaseQuestions.forEach((question) => {
//           question.answers = [];
//           res.forEach((arr) => {
//             arr.forEach((answer) => {
//               if (answer.answerquestion === question.questionid) {
//                 question.answers.push(answer);
//               }
//             });
//           });
//         });
//         databaseQuiz.questions = databaseQuestions;
//         response.json(databaseQuiz);
//       });
//   }
