import { useEffect, useContext } from "preact/hooks";
import { UserContext } from "../app";
import { route } from "preact-router";

// Change this so when you click "host this quiz" it posts a request to start it with this user's id
// Then when we get back the RANDOM UNIQUE ID, we start redirect to that as the host using the preact router route method
//

export function QuizHostList({ listData }) {
  const { user } = useContext(UserContext);

  const userQuizes = listData.filter((quiz) => quiz.quizUser === user?.userId);

  return (
    <div>
      {userQuizes.map((quiz) => {
        return (
          <>
            <h2>{quiz.title}</h2>
            <p>
              <a href={"./quiz/" + quiz.quizId}> Host this quiz</a>
            </p>
          </>
        );
      })}
    </div>
  );
}
