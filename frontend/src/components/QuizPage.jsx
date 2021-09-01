import { NavBar } from "./NavBar";
import { QuizTakeList } from "./QuizTakeList";
import { useFetch } from "../hooks/useFetch";

// Needs to
// Load the quiz data
// Sign up for

export function QuizPage({ quizId }) {
  const listData = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-quiz/",
    quizId === "",
    [quizId]
  );

  return (
    <>
      <NavBar />
      {quizId === "" ? (
        listData ? (
          <div>
            <h1>Quizes</h1>
            <QuizTakeList listData={listData} />
          </div>
        ) : (
          <div>Loading quizes . . .</div>
        )
      ) : (
        <div>
          <h1>Quiz {quizId}</h1>
          <p>Loading quiz . . . </p>
          <p>Waiting for other players. . . </p>
        </div>
      )}
    </>
  );
}
