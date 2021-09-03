import { useState, useEffect } from "preact/hooks";

export function WaitingRoom({ isHost, user, quiz }) {
  const [quizers, setQuizers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [state, setState] = useState("waiting");
  console.log(quiz);

  useEffect(() => {
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
            setQuizers((quizers) => [...quizers, data.user]);
            break;
          case "nextQuestion":
            setCurrentQuestion(data.question);
            break;
          case "failure":
            break;
          case "end":
            setState("end");
            break;
        }
      });
    }
  }, [quiz]);

  function onAnswerSelect(answerIndex) {
    fetch(
      import.meta.env.VITE_BACKEND_URL + "/answer-question/" + quiz.quizId,
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

  return (
    <div>
      {currentQuestion ? (
        <div>
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
        </div>
      ) : (
        <>
          <h2>Waiting for quizers...</h2>
          <p>{isHost ? "You're hosting" : "You're a guest"}</p>
          <div>
            <h3>Current quizers:</h3>
            {quizers.length == 0
              ? "Noone's joined the quiz yet!"
              : quizers.map((quizer) => {
                  return <p>{quizer.name} has joined the game</p>;
                })}
          </div>

          {isHost && quiz ? (
            <button onClick={onQuizStart}>Start quiz</button>
          ) : null}
        </>
      )}{" "}
    </div>
  );
}
