// index.js
import sqlite3 from "sqlite3";

function getQuizData(quizid) {
  let db = new sqlite3.Database("./db/quiz.db");
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT *,a.body AS answerbody, ques.body AS questionbody FROM answer a 
INNER JOIN question ques ON a.answerquestion=ques.questionid 
INNER JOIN quiz quiz ON ques.questionquiz = quiz.quizid 
WHERE quiz.quizid  = ?;`,
      [quizid],
      (err, row) => {
        if (err) {
          reject(err);
        }
        let result = {
          quizId: row[0].quizid,
          title: row[0].title,
        };
        let questions = [];
        for (let i = 0; i < row.length; i++) {
          let currentRow = row[i];
          if (
            questions.filter((q) => q.questionId == currentRow.questionid)
              .length === 0
          ) {
            questions.push({
              questionId: currentRow.questionid,
              body: currentRow.questionbody,
            });
          }
          questions.forEach((q) => {
            if (q.answers === undefined) {
              q.answers = [];
            }
            if (currentRow.answerquestion === q.questionId) {
              q.answers.push({
                answerId: currentRow.answerid,
                body: currentRow.answerbody,
                isCorrect: currentRow.iscorrect,
                answerQuestion: currentRow.answerquestion,
              });
            }
          });
        }
        result.questions = questions;
        resolve(result);
        db.close();
      }
    );
  });
}
let quiz = await getQuizData(0);
console.log(quiz.questions[1].answers);
