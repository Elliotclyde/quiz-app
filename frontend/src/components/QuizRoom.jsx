import { useState, useEffect } from "preact/hooks";
import { ResultsTable } from "./ResultsTable";

const sortByScore = (a, b) => {
  if (a.score > b.score) {
    return -1;
  }
  if (a.score < b.score) {
    return 1;
  }
  return 0;
};

export function QuizRoom({ user, quiz }) {
  const [data, setData] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [state, setState] = useState("waiting");
  const [recentlyAnsweredQuizer, setRecentlyAnsweredQuizer] = useState(null);
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false);

  const quizers = data?.quizers || [];

  const isHost = quiz?.quizUser == user?.userId;

  useEffect(() => {
    if (user && quiz) {
      const evtSource = new EventSource(
        import.meta.env.VITE_BACKEND_URL +
          "/join-quiz/" +
          quiz.quizId +
          "/" +
          user.userId
      );
      evtSource.addEventListener("message", respondToEvent);

      return () => {
        evtSource.removeEventListener("message", respondToEvent);
        evtSource.close();
      };
    }
  }, [quiz, user]);

  function respondToEvent(event) {
    const data = JSON.parse(event.data);
    console.log(data.type);
    switch (data.type) {
      case "start":
        setState("quizzing");
        setCurrentQuestion(data.question);
        break;
      case "join":
        setData(data);
        break;
      case "nextQuestion":
        setCurrentQuestion(data.question);
        setRecentlyAnsweredQuizer(data.answered);
        setHasAnsweredQuestion(false);
        break;
      case "failure":
        break;
      case "answer":
        setRecentlyAnsweredQuizer(data.answered);
        break;
      case "end":
        setData(data);
        setState("end");
        break;
    }
  }

  function onAnswerSelect(answerIndex) {
    setHasAnsweredQuestion(true);
    fetch(
      import.meta.env.VITE_BACKEND_URL +
        "/answer-question/" +
        quiz.quizId +
        "/" +
        user.userId,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ user: user, answerIndex: answerIndex }),
      }
    );
  }

  function onQuizStart() {
    fetch(import.meta.env.VITE_BACKEND_URL + "/start-quiz/" + quiz.quizId, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
    })
      .then((res, rej) => {
        return res.json();
      })
      .then((res, rej) => {
        console.log(res);
      });
  }

  return (
    <div>
      {(() => {
        switch (state) {
          case "waiting":
            return (
              <>
                {isHost ? (
                  <>
                    <h2>Waiting for quizers...</h2>
                    <p>You're hosting</p>
                    <p>Send your friends this link to join:</p>
                    <p>
                      {import.meta.env.VITE_FRONTEND_URL +
                        "/quiz/" +
                        quiz?.quizId}
                    </p>
                  </>
                ) : (
                  <>
                    <h2>
                      Waiting for host {data?.host?.name} to start the quiz
                    </h2>
                  </>
                )}
                <div>
                  <h3>Current quizers:</h3>
                  {quizers.length == 0
                    ? "Noone's joined the quiz yet!"
                    : quizers.map((quizer) => {
                        return quizer.userId == user.userId ? (
                          <p>You are ready to quiz</p>
                        ) : (
                          <p>
                            {quizer.name.charAt(0).toUpperCase() +
                              quizer.name.slice(1)}{" "}
                            is ready to quiz
                          </p>
                        );
                      })}
                </div>
                {isHost && quiz ? (
                  <button disabled={quizers.length == 0} onClick={onQuizStart}>
                    Start quiz
                  </button>
                ) : null}
              </>
            );
          case "quizzing":
            return isHost ? (
              <>
                <h2>Quizers are on question {currentQuestion.questionId}</h2>
              </>
            ) : (
              <>
                <h2>{currentQuestion.body}</h2>
                {currentQuestion.answers.map((a, index) => (
                  <button
                    disabled={hasAnsweredQuestion}
                    onClick={() => {
                      onAnswerSelect(index);
                    }}
                  >
                    {a.body}
                  </button>
                ))}
                {recentlyAnsweredQuizer ? (
                  <p>
                    {recentlyAnsweredQuizer.name} just answered
                    {recentlyAnsweredQuizer.isCorrect
                      ? " correctly"
                      : " incorrectly"}
                  </p>
                ) : null}
              </>
            );
          // Show some nicer data here
          case "end":
            return (function () {
              const winner = quizers.sort(sortByScore)[0];

              return (
                <>
                  <h2>{getWinnerMessage(quizers, user)}</h2>
                  <ResultsTable data={data} />
                </>
              );
            })();
        }
      })()}
    </div>
  );
}

function getWinnerMessage(quizers, user) {
  const orderedByScore = quizers.sort(sortByScore);

  const winners = orderedByScore.filter((quizer) => {
    return quizer.score === orderedByScore[0].score;
  });

  if (winners.length == 1) {
    if (orderedByScore[0].userId == user.userId) {
      return "You win!";
    } else {
      return "The winner is: " + orderedByScore[0].name;
    }
  } else {
    return "It was a draw between: " + winners.map((w) => w.name).join(", ");
  }
}
