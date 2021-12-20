# A backend for a quiz app

This backend uses [express.js](https://expressjs.com/), [SQLite](https://www.sqlite.org/index.html), and [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

The SQLite database file and logic are in the database folders.

The Controllers folder holds the majority of the logic. Some of these controllers manage simple CRUD functionality:

- createQuiz
- getQuiz
- updateQuiz
- deleteQuiz
- createUser
- getUserQuizes

Others are for the logic of running a quiz:

The user who owns a quiz can host it.
Then the other users can join by following a link.
Then the host can start the quiz.
Then other users answer questions. Each of these events hit endpoints that trigger these controllers:

- hostQuiz
- joinQuiz
- startQuiz
- answerQuestion

Throughout this the host and quizers subscribe to server-sent events to get updated realtime when other quizers answer questions
