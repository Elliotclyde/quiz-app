import { useEffect, useContext } from "preact/hooks";
import { UserContext } from "../app";

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
