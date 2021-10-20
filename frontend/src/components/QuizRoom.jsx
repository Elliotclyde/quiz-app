import { useState, useEffect, useContext, useRef } from "preact/hooks";
import { ResultsTable } from "./ResultsTable";
import { CopyButton } from "./CopyButton";
import { UserContext } from "../app";
import { NewUserModal } from "./NewUserModal";
import { QuizersTable } from "./QuizersTable";

// A lot to do here

const sortByScore = (a, b) => {
  if (a.score > b.score) {
    return -1;
  }
  if (a.score < b.score) {
    return 1;
  }
  return 0;
};

let evtSource;

export function QuizRoom({ roomId }) {
  const { user } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const stateRef = useRef("loading");

  const quizers = data?.quizers || [];

  const isHost = data?.host === user?.userId;

  const currentQuestion = data
    ? data.quiz.questions[data.currentQuestionIndex]
    : null;

  const hasAnswered = data
    ? data.quizers.filter((q) => q.userId == user?.userId)[0]?.hasAnswered
    : null;

  const allConnected = data
    ? data.hostConnected &&
      data.quizers.filter((q) => !q.connected).length === 0
    : false;

  useEffect(() => {
    if (user) {
      evtSource = new EventSource(
        import.meta.env.VITE_BACKEND_URL +
          "/join-quiz/" +
          roomId +
          "/" +
          user.userId
      );
      evtSource.addEventListener("message", respondToEvent);

      return () => {
        evtSource.removeEventListener("message", respondToEvent);
        evtSource.close();
      };
    }
  }, [user, roomId]);

  function respondToEvent(event) {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "host":
        if (data.hasStarted) {
          setState("quizzing");
        } else {
          setState("waiting");
        }
        setData(data);
        break;

      case "start":
        setState("quizzing");
        setData(data);
        break;

      case "join":
        if (data.hasStarted) {
          setState("quizzing");
        } else {
          setState("waiting");
        }
        setData(data);
        break;

      case "disconnect":
        setData(data);
        break;
      case "nextQuestion":
        setData(data);
        break;
      case "failure":
        break;
      case "answer":
        setData(data);
        if (data.currentQuestionIndex >= data.quiz.questions.length) {
          setState("end");
          evtSource.removeEventListener("message", respondToEvent);
          evtSource.close();
        }
        break;
    }
  }

  function onAnswerSelect(answerIndex) {
    fetch(import.meta.env.VITE_BACKEND_URL + "/answer/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ roomId, user, answerIndex }),
    });
  }

  function onQuizStart() {
    fetch(import.meta.env.VITE_BACKEND_URL + "/start-quiz", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        roomId,
      }),
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
      {/* Either way we need the user so show the modal to sign up user */}
      {user == null ? <NewUserModal /> : ""}
      {(() => {
        switch (state) {
          case "loading":
            return " . . . ";
          case "waiting":
            return (
              <>
                {isHost ? (
                  <>
                    <h2>Waiting for quizers...</h2>
                    <p>You're hosting</p>
                    <p>Send your friends this link to join:</p>
                    <CopyButton>
                      {import.meta.env.VITE_FRONTEND_URL + "/quiz/" + roomId}
                    </CopyButton>
                  </>
                ) : data.hostConnected ? (
                  <h2>Waiting for host to start the quiz</h2>
                ) : (
                  <h2>Host disconnected. Waiting for them to reconnect.</h2>
                )}
                <div>
                  <h3>Current quizers:</h3>
                  {quizers.length == 0
                    ? "Noone's joined the quiz yet!"
                    : quizers.map((quizer) => {
                        return quizer.userId == user.userId ? (
                          <p>You are ready to quiz</p>
                        ) : quizer.connected ? (
                          <p>
                            {quizer.name.charAt(0).toUpperCase() +
                              quizer.name.slice(1)}{" "}
                            is ready to quiz
                          </p>
                        ) : (
                          <p>
                            {quizer.name.charAt(0).toUpperCase() +
                              quizer.name.slice(1)}{" "}
                            has disconnected
                          </p>
                        );
                      })}
                </div>
                {isHost ? (
                  <button
                    disabled={data?.quizers.length == 0 || !allConnected}
                    onClick={onQuizStart}
                  >
                    Start quiz
                  </button>
                ) : null}
              </>
            );
          case "quizzing":
            return isHost ? (
              <>
                <h2>Quizers are on question {data.currentQuestionIndex + 1}</h2>
                <QuizersTable data={data} />
              </>
            ) : (
              <>
                <h2>Question {data.currentQuestionIndex + 1}</h2>
                <h3>{currentQuestion.body}</h3>
                {currentQuestion.answers.map((a, index) => (
                  <button
                    disabled={hasAnswered || !allConnected}
                    onClick={() => {
                      onAnswerSelect(index);
                    }}
                  >
                    {a.body}
                  </button>
                  // Here we'll put a view of who is connected and who has answered right or wrong
                ))}
                <QuizersTable data={data} />
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
