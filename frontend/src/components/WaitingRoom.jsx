import { useState, useEffect } from "preact/hooks";

export function WaitingRoom({ isHost, user, quiz }) {
  const [quizers, setQuizers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [state, setState] = useState("waiting");

  useEffect(() => {
    console.log(user);
    console.log(quiz);
    if (user && quiz) {
      const evtSource = new EventSource(
        import.meta.env.VITE_BACKEND_URL +
          "/join-quiz/" +
          quiz.quizId +
          "/" +
          user.userId
      );
      evtSource.addEventListener("message", function (event) {
        console.log(event);
        const data = JSON.parse(event.data);
        console.log(data);
        switch (data.type) {
          case "start":
            setState("quizzing");
            setCurrentQuestion(data.question);
            break;
          case "join":
            setQuizers(data.quizers);
            break;
          case "nextQuestion":
            setCurrentQuestion(data.question);
            break;
          case "failure":
            break;
          case "end":
            setQuizers(data.quizers);
            setState("end");
            break;
        }
      });
    }
  }, [quiz, user]);

  function onAnswerSelect(answerIndex) {
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
    )
      .then((res, rej) => {
        return res.json();
      })
      .then((res, rej) => {
        console.log(res);
      });
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

  console.log(state);
  return (
    <div>
      {(() => {
        switch (state) {
          case "waiting":
            return (
              <>
                <h2>Waiting for quizers...</h2>
                <p>{isHost ? "You're hosting" : "You're a guest"}</p>
                <div>
                  <h3>Current quizers:</h3>
                  {quizers.length == 0
                    ? "Noone's joined the quiz yet!"
                    : quizers.map((quizer) => {
                        return <p>{quizer.name} is ready to quiz</p>;
                      })}
                </div>
                {isHost && quiz ? (
                  <button onClick={onQuizStart}>Start quiz</button>
                ) : null}
              </>
            );
          case "quizzing":
            return isHost ? (
              <>
                {" "}
                <h2>Quizers are on question {currentQuestion.questionId}</h2>
              </>
            ) : (
              <>
                <h2>{currentQuestion.body}</h2>
                {currentQuestion.answers.map((a, index) => (
                  <button
                    onClick={() => {
                      onAnswerSelect(index);
                    }}
                  >
                    {a.body}
                  </button>
                ))}
              </>
            );
          case "end":
            return (
              <h2>
                The winner is:
                {
                  quizers.sort((a, b) => {
                    if (a.score > b.score) {
                      return -1;
                    }
                    if (a.score < b.score) {
                      return 1;
                    }
                    return 0;
                  })[0].name
                }
              </h2>
            );
        }
      })()}
    </div>
  );
}
