import { useEffect } from "preact/hooks";

export function QuizHostList({ listData }) {
  const userQuizes = listData.filter(
    (quiz) =>
      quiz.quizUser === JSON.parse(window.localStorage.getItem("user"))?.userId
  );

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
