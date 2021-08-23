import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./db/quiz.db");

// -table of quizzes

// -each one has a bunch of questions
// -each question has a bunch of answers
// -one of the answers is right

// db.serialize(function () {
//   db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//     console.log(row.id + ": " + row.info);
//   });
// });

let quizIdHead = 0;
let questionIdHead = 0;
let answerIdHead = 0;

export const dataBase = {
  // create tables
  initialise: function () {
    db.serialize(function () {
      db.run("CREATE TABLE quiz (quizid INTEGER PRIMARY KEY, title TEXT)");
    });
    db.run(
      "CREATE TABLE question (questionid INTEGER PRIMARY KEY, body TEXT, questionquiz INTEGER, FOREIGN KEY(questionquiz) REFERENCES quiz(quizid))"
    );
    db.run(
      "CREATE TABLE answer (answerid INTEGER PRIMARY KEY, body TEXT, iscorrect INTEGER, answerquestion INTEGER, FOREIGN KEY(answerquestion) REFERENCES question(questionid))"
    );
  },
  newQuiz: function (title) {
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO quiz VALUES(?,?)";
      const sqlGet = "SELECT * FROM quiz WHERE quizid  = ?";
      db.run(sqlCreate, [quizIdHead, title], (req, res) => {
        db.get(sqlGet, [quizIdHead], (req, res) => {
          quizIdHead = quizIdHead + 1;
          resolve(res);
        });
      });
    });
  },

  newQuestion: function (body, quizId) {
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO question VALUES(?,?,?)";
      const sqlGet = "SELECT * FROM question WHERE questionid  = ?";

      db.run(sqlCreate, [questionIdHead, body, quizId], (req, res) => {
        db.get(sqlGet, [questionIdHead], (req, res) => {
          questionIdHead = questionIdHead + 1;
          resolve(res);
        });
      });
    });
  },

  newAnswer: function (body, isCorrect, questionId) {
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO answer VALUES(?,?,?,?)";
      const sqlGet = "SELECT * FROM answer WHERE answerid = ?";

      db.run(
        sqlCreate,
        [answerIdHead, body, isCorrect, questionId],
        (req, res) => {
          db.get(sqlGet, [answerIdHead], (req, res) => {
            answerIdHead = answerIdHead + 1;
            resolve(res);
          });
        }
      );
    });
  },

  getQuiz: function (id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM quiz WHERE quizid  = ?`, [id], (err, row) => {
        if (err) {
          return console.error(err.messsage);
        }
        resolve(row);
      });
    });
  },

  getQuestion: function (id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM question WHERE questionid  = ?`,
        [id],
        (err, row) => {
          if (err) {
            return console.error(err.messsage);
          }
          resolve(row);
        }
      );
    });
  },
  getAnswer: function (id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM answer WHERE answerid  = ?`, [id], (err, row) => {
        if (err) {
          return console.error(err.messsage);
        }
        resolve(row);
      });
    });
  },
  getQuizQuestions: function (id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM question WHERE questionquiz = ?`,
        [id],
        (err, rows) => {
          if (err) {
            return console.error(err.messsage);
          }
          resolve(rows);
        }
      );
    });
  },
  getQuestionAnswers: function (id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM answer WHERE answerquestion = ?`,
        [id],
        (err, rows) => {
          if (err) {
            return console.error(err.messsage);
          }
          resolve(rows);
        }
      );
    });
  },
};
