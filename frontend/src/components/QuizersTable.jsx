export function QuizersTable({ data }) {
  return (
    <>
      <h2>Players</h2>
      <div>
        <table>
          <tr>
            <th>Player</th>
            <th>Result</th>
            <th>Connected</th>
          </tr>
          {data.quizers.map((quizer) => {
            return (
              <tr>
                <td>{quizer.name}</td>
                <td>
                  {(function () {
                    if (!quizer.hasAnswered) {
                      return "...";
                    } else {
                      return quizer.answers[quizer.answers.length - 1].isCorrect
                        ? "✔"
                        : "❌";
                    }
                  })()}
                </td>

                <td>{quizer.connected ? "connected" : "disconnected"}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
}
