import { NavBar } from "./NavBar";

// Needs to
// Load the quiz data
// Sign up for

export function QuizPage({ quizId }) {
  return (
    <>
      <NavBar />
      <div>
        <h1>Quiz {quizId}</h1>
        <p>Loading quiz . . . </p>
        <p>Waiting for other players. . . </p>
      </div>
    </>
  );
}
