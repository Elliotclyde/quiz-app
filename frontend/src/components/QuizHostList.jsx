import { useEffect, useContext } from "preact/hooks";
import { UserContext } from "../app";
import { route } from "preact-router";

// Change this so when you click "host this quiz" it posts a request to start it with this user's id
// Then when we get back the RANDOM UNIQUE ID, we start redirect to that as the host using the preact router route method
//

export function QuizHostList({ listData }) {
  const { user } = useContext(UserContext);

  const userQuizes = listData.filter((quiz) => quiz.quizUser === user?.userId);

  function onQuizOpen(event) {
    event.preventDefault();
    fetch(import.meta.env.VITE_BACKEND_URL + "/host-quiz", {
      body: JSON.stringify({
        userId: user.userId,
        quizId: parseInt(event.target.dataset.quizid),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // Read the response as json.
        return response.json();
      })
      .then(function (responseAsJson) {
        route("/quiz/" + responseAsJson.roomId);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div>
      {userQuizes.map((quiz) => {
        return (
          <>
            <h2>{quiz.title}</h2>
            <p>
              <a
                onClick={onQuizOpen}
                data-quizid={quiz.quizId}
                href={"./quiz/" + quiz.quizId}
              >
                {" "}
                Host this quiz
              </a>
            </p>
          </>
        );
      })}
    </div>
  );
}
