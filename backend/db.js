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

export const dataBase = {
  quizIdHead: 0,
  questionIdHead: 0,
  answerIdHead: 0,
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
    dataBase.quizIdHead = dataBase.quizIdHead + 1;
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO quiz VALUES(?,?)";
      const sqlGet = "SELECT * FROM quiz WHERE quizid  = ?";
      db.run(sqlCreate, [dataBase.quizIdHead, title], (req, res) => {
        db.get(sqlGet, [dataBase.quizIdHead], (req, res) => {
          resolve(res);
        });
      });
    });
  },

  newQuestion: function (body, quizId) {
    dataBase.questionIdHead = dataBase.questionIdHead + 1;
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO question VALUES(?,?,?)";
      const sqlGet = "SELECT * FROM question WHERE questionid  = ?";

      db.run(sqlCreate, [dataBase.questionIdHead, body, quizId], (req, res) => {
        db.get(sqlGet, [dataBase.questionIdHead], (req, res) => {
          resolve(res);
        });
      });
    });
  },

  newAnswer: function (body, isCorrect, questionId) {
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO answer VALUES(?,?,?,?)";
      const sqlGet = "SELECT * FROM answer WHERE answerid = ?";
      dataBase.answerIdHead = dataBase.answerIdHead + 1;
      db.run(
        sqlCreate,
        [dataBase.answerIdHead, body, isCorrect, questionId],
        (req, res) => {
          db.get(sqlGet, [dataBase.answerIdHead], (req, res) => {
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
