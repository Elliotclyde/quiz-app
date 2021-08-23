import { NavBar } from "./NavBar";

export function QuizPage({ quizid }) {
  return (
    <>
      <NavBar />
      <div>
        <h1>Quiz {quizid}</h1>
        <p>Loading quiz . . . </p>
        <p>Waiting for other players. . . </p>
      </div>
    </>
  );
}
