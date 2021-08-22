import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

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
    db.serialize(function () {
      let statement = db.prepare("INSERT INTO quiz VALUES(?,?)");
      statement.run(this.quizIdHead, title);
      statement.finalize();
    });
    this.quizIdHead = this.quizIdHead + 1;
    return { quizId: this.quizIdHead, title: title };
  },

  newQuestion: function (body, quizId) {
    db.serialize(function () {
      let statement = db.prepare("INSERT INTO question VALUES(?,?,?)");
      statement.run(this.questionIdHead, body, quizId);
      statement.finalize();
    });
    this.questionIdHead = this.questionIdHead + 1;
    return { questionId: this.questionIdHead, body: body, quizId: quizId };
  },

  newAnswer: function (body, isCorrect, questionId) {
    db.serialize(function () {
      let statement = db.prepare("INSERT INTO answer VALUES(?,?,?,?)");
      statement.run(this.answerIdHead, body, isCorrect, questionId);
      statement.finalize();
    });
    this.answerIdHead = this.answerIdHead + 1;

    return {
      answerIdHead: this.answerIdHead,
      isCorrect: isCorrect,
      body: body,
      questionId: questionId,
    };
  },

  getQuiz: function (id, callback) {
    db.get(`SELECT * FROM quiz WHERE quizid  = ?`, [id], (err, row) => {
      if (err) {
        return console.error(err.messsage);
      }
      callback(row);
    });
  },

  getQuestion: function (id, callback) {
    db.get(`SELECT * FROM question WHERE questionid  = ?`, [id], (err, row) => {
      if (err) {
        return console.error(err.messsage);
      }
      callback(row);
    });
  },
  getAnswer: function (id, callback) {
    db.get(`SELECT * FROM answer WHERE answerid  = ?`, [id], (err, row) => {
      if (err) {
        return console.error(err.messsage);
      }
      callback(row);
    });
  },
  getQuizQuestions: function (id, callback) {
    let data = [];
    db.each(
      `SELECT * FROM question WHERE questionquiz = ?`,
      [id],
      (err, row) => {
        if (err) {
          return console.error(err.messsage);
        }
        data.push(row);
      },
      (err, row) => callback(data)
    );
  },
  getQuestionAnswers: function (id, callback) {
    let data = [];
    db.each(
      `SELECT * FROM answer WHERE answerquestion = ?`,
      [id],
      (err, row) => {
        if (err) {
          return console.error(err.messsage);
        }
        data.push(row);
      },
      (err, row) => {
        callback(data);
      }
    );
  },
};
