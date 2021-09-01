export function QuizTakeList({ listData }) {
  return (
    <div>
      {listData.map((quiz) => {
        return (
          <>
            <h2>{quiz.title}</h2>
            <p>
              <a href={"./quiz/" + quiz.quizId}> Open this quiz</a>
            </p>
          </>
        );
      })}
    </div>
  );
}
