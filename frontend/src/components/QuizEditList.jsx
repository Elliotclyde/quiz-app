import { Link, route } from "preact-router";
export function QuizEditList({ listData }) {
  return (
    <div>
      {listData.map((quiz) => {
        return (
          <>
            <h2>{quiz.title}</h2>
            <p>
              <Link href={"/editor/" + quiz.quizId}>Edit this quiz</Link>
            </p>
          </>
        );
      })}
    </div>
  );
}
