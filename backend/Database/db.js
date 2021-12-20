import sqlite3 from "sqlite3";

function getdb() {
  return new sqlite3.Database("./db/quiz.db");
}
// -table of quizzes

// -each one has a bunch of questions
// -each question has a bunch of answers
// -one of the answers is right

let quizIdHead = 0;
let questionIdHead = 0;
let answerIdHead = 0;
let userIdHead = 0;

export const dataBase = {
  // create tables
  migrate: function () {
    let db = getdb();
    db.serialize(function () {
      db.run("CREATE TABLE user (userid INTEGER PRIMARY KEY, name TEXT)");
      db.run(
        "CREATE TABLE quiz (quizid INTEGER PRIMARY KEY, title TEXT, quizuser INTEGER, FOREIGN KEY(quizuser) REFERENCES user(userid))"
      );
      db.run(
        "CREATE TABLE question (questionid INTEGER PRIMARY KEY, body TEXT, questionquiz INTEGER, FOREIGN KEY(questionquiz) REFERENCES quiz(quizid))"
      );
      db.run(
        "CREATE TABLE answer (answerid INTEGER PRIMARY KEY, body TEXT, iscorrect INTEGER, answerquestion INTEGER, FOREIGN KEY(answerquestion) REFERENCES question(questionid))"
      );
    });
    db.close();
  },
  initialise: function () {
    let db = getdb();
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT quizid FROM quiz WHERE  quizid = (SELECT MAX(quizid) FROM quiz);",
        [],
        (error, quizRes) => {
          if (quizRes == undefined) {
            quizIdHead = 0;
          } else {
            quizIdHead = quizRes.quizid + 1;
          }

          db.get(
            "SELECT questionid FROM question WHERE  questionid = (SELECT MAX(questionid) FROM question);",
            [],
            (error, questionRes) => {
              if (questionRes == undefined) {
                questionIdHead = 0;
              } else {
                questionIdHead = questionRes.questionid + 1;
              }
              db.get(
                "SELECT answerid FROM answer WHERE answerid = (SELECT MAX(answerid) FROM answer);",
                [],
                (error, answerRes) => {
                  if (answerRes == undefined) {
                    answerIdHead = 0;
                  } else {
                    answerIdHead = answerRes.answerid + 1;
                  }
                  db.get(
                    "SELECT userid FROM user WHERE userid = (SELECT MAX(userid) FROM user);",
                    [],
                    (error, userRes) => {
                      if (userRes == undefined) {
                        userIdHead = 0;
                      } else {
                        userIdHead = userRes.userid + 1;
                      }
                      resolve();
                    }
                  );
                }
              );
            }
          );
        }
      );
      const highestQuestionId = 1;
      const highestAnswerId = 1;
      const highestUserId = 1;
    });
  },
  newUser: function (name) {
    let db = getdb();
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO user VALUES(?,?)";
      const sqlGet = "SELECT * FROM user WHERE userid  = ?";
      db.run(sqlCreate, [userIdHead, name], (req, res) => {
        db.get(sqlGet, [userIdHead], (req, row) => {
          userIdHead = userIdHead + 1;
          db.close();
          resolve(camelCaseifyRow(row));
        });
      });
    });
  },
  newQuiz: function (title, userId) {
    let db = getdb();
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO quiz VALUES(?,?,?)";
      const sqlGet = "SELECT * FROM quiz WHERE quizid  = ?";
      db.run(sqlCreate, [quizIdHead, title, userId], (req, res) => {
        db.get(sqlGet, [quizIdHead], (req, row) => {
          quizIdHead = quizIdHead + 1;
          db.close();
          resolve(camelCaseifyRow(row));
        });
      });
    });
  },

  newQuestion: function (body, quizId) {
    let db = getdb();
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO question VALUES(?,?,?)";
      const sqlGet = "SELECT * FROM question WHERE questionid  = ?";

      db.run(sqlCreate, [questionIdHead, body, quizId], (req, res) => {
        db.get(sqlGet, [questionIdHead], (req, row) => {
          questionIdHead = questionIdHead + 1;
          db.close();
          resolve(camelCaseifyRow(row));
        });
      });
    });
  },

  newAnswer: function (body, isCorrect, questionId) {
    let db = getdb();
    return new Promise((resolve, reject) => {
      const sqlCreate = "INSERT INTO answer VALUES(?,?,?,?)";
      const sqlGet = "SELECT * FROM answer WHERE answerid = ?";
      db.run(
        sqlCreate,
        [answerIdHead, body, isCorrect, questionId],
        (err, res) => {
          if (err) {
            reject(err);
          }
          db.get(sqlGet, [answerIdHead], (err, row) => {
            if (err) {
              reject(err);
            }
            answerIdHead = answerIdHead + 1;
            db.close();
            resolve(camelCaseifyRow(row));
          });
        }
      );
    });
  },
  // Gets all columns from a table where the column equals the value
  get: function (params) {
    const { table, column, value } = params; // In production these strings should be scrubbed to prevent SQL injection
    let db = getdb();
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM ${table} WHERE ${column} = ${value}`,
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(camelCaseifyRow(row));
          db.close();
        }
      );
    });
  },
  getAll: function (params) {
    const { table, column, value } = params; // In production these strings should be scrubbed to prevent SQL injection
    let db = getdb();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM ${table} WHERE ${column} = ${value}`,
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows.map(camelCaseifyRow));
          db.close();
        }
      );
    });
  },
  getQuizData: function (quizid) {
    let db = getdb();
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
              questions.filter((q) => q.questionId == currentRow.questionid) ==
              0
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
  },
  getQuizes: function () {
    let db = getdb();
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM quiz`, (err, rows) => {
        if (err) {
          reject(err);
        }
        db.close();
        resolve(rows.map(camelCaseifyRow));
      });
    });
  },
  updateUser: function (id, props) {
    let db = getdb();
    const { name } = props;
    const sqlUpdate = "UPDATE user SET name = ? WHERE userid = ?";
    const sqlGet = "SELECT * FROM user WHERE userid = ?";
    return new Promise((resolve, reject) => {});
  },
  updateQuiz: function (id, props) {
    let db = getdb();
    const { title } = props;
    const sqlUpdate = "UPDATE quiz SET title = ? WHERE quizid = ?";
    const sqlGet = "SELECT * FROM quiz WHERE quizid = ?";
    return new Promise((resolve, reject) => {
      db.run(sqlUpdate, [title, id], (err, res) => {
        if (err) {
          reject(err);
        }
        db.get(sqlGet, [id], (req, res) => {
          db.close();
          resolve(camelCaseifyRow(res));
        });
      });
    });
  },
  updateQuestion: function (id, props) {
    let db = getdb();
    const { body } = props;
    const sqlUpdate = "UPDATE question SET body = ? WHERE questionid = ?";
    const sqlGet = "SELECT * FROM question WHERE questionid = ?";
    return new Promise((resolve, reject) => {
      db.run(sqlUpdate, [body, id], (err, res) => {
        if (err) {
          reject(err);
        }
        db.get(sqlGet, [id], (req, res) => {
          db.close();
          resolve(camelCaseifyRow(res));
        });
      });
    });
  },
  updateAnswer: function (id, props) {
    let db = getdb();
    const { body, isCorrect } = props;
    const sqlUpdate =
      "UPDATE answer SET body = ?, iscorrect = ? WHERE answerid = ?";
    const sqlGet = "SELECT * FROM answer WHERE answerid = ?";
    return new Promise((resolve, reject) => {
      db.run(sqlUpdate, [body, isCorrect, id], (req, res) => {
        db.get(sqlGet, [id], (err, res) => {
          if (err) {
            reject(err);
          }
          db.close();
          resolve(camelCaseifyRow(res));
        });
      });
    });
  },
  deleteUser: function (id) {
    let db = getdb();
    const sqlGet = "SELECT * FROM user WHERE userid = ?";
    const sqlDelete = "DELETE from user WHERE userid =?";
    let user;
    return new Promise((resolve, reject) => {
      db.get(sqlGet, [id], (req, res) => {
        user = res;
        db.run(sqlDelete, [id], (req, res) => {
          db.close();
          resolve(camelCaseifyRow(user));
        });
      });
    });
  },
  deleteQuiz: function (id) {
    let db = getdb();
    const sqlGet = "SELECT * FROM quiz WHERE quizid = ?";
    const sqlDelete = "DELETE from quiz WHERE quizid=?";
    let quiz;
    return new Promise((resolve, reject) => {
      db.get(sqlGet, [id], (req, res) => {
        quiz = res;
        db.run(sqlDelete, [id], (req, res) => {
          db.close();
          resolve(camelCaseifyRow(quiz));
        });
      });
    });
  },
  deleteQuestion: function (id) {
    let db = getdb();
    const sqlGet = "SELECT * FROM question WHERE questionid = ?";
    const sqlDelete = "DELETE from question WHERE questionid = ?";
    let question;
    return new Promise((resolve, reject) => {
      db.get(sqlGet, [id], (req, res) => {
        question = res;
        db.run(sqlDelete, [id], (req, res) => {
          db.close();
          resolve(camelCaseifyRow(question));
        });
      });
    });
  },
  deleteAnswer: function (id) {
    let db = getdb();
    const sqlGet = "SELECT * FROM answer WHERE answerid = ?";
    const sqlDelete = "DELETE from answer WHERE answerid = ?";
    let answer;
    return new Promise((resolve, reject) => {
      db.get(sqlGet, [id], (req, res) => {
        answer = res;
        db.run(sqlDelete, [id], (req, res) => {
          db.close();
          resolve(camelCaseifyRow(answer));
        });
      });
    });
  },
};

function camelCaseifyRow(row) {
  if (row === undefined || row === null) {
    return row;
  }
  const result = {};
  const keys = Object.keys(row);
  keys.forEach((key) => {
    switch (key) {
      case "quizid":
        result.quizId = row[key];
        break;
      case "userid":
        result.userId = row[key];
        break;
      case "quizuser":
        result.quizUser = row[key];
        break;
      case "questionid":
        result.questionId = row[key];
        break;
      case "answerid":
        result.answerId = row[key];
        break;
      case "questionquiz":
        result.questionQuiz = row[key];
        break;
      case "answerquestion":
        result.answerQuestion = row[key];
        break;
      case "iscorrect":
        result.isCorrect = !!row[key];
        break;
      default:
        result[key] = row[key];
    }
  });
  return result;
}
