export function ResultsTable({ data }) {
  return (
    <>
      <h2>Results</h2>
      <div>
        {data.quizers.map((quizer) => {
          return (
            <>
              <h3>{quizer.name}</h3>
              <table>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Result</th>
                </tr>
                {data.quiz.questions.map((question, index) => {
                  return (
                    <tr>
                      <td>{question.body}</td>
                      <td>{quizer.answers[index].body}</td>
                      <td>{quizer.answers[index].isCorrect ? "✔" : "❌"}</td>
                    </tr>
                  );
                })}
              </table>
              <p>Score: {quizer.score}</p>
            </>
          );
        })}
      </div>
    </>
  );
}
