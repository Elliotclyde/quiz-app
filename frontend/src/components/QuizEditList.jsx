export function QuizEditList({ listData }) {
  return (
    <div>
      {listData.map((quiz) => {
        return (
          <>
            <h2>{quiz.title}</h2>
            <p>
              <a href={"./editor/" + quiz.quizId}> Edit this quiz</a>
            </p>
          </>
        );
      })}
    </div>
  );
}
