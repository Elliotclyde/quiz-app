import { NavBar } from "./NavBar";
import { QuizRoom } from "./QuizRoom";

// Needs to
// Load the quiz data
// Sign up for

export function QuizPage({ roomId }) {
  return (
    <>
      <NavBar />
      <div>
        <QuizRoom roomId={roomId} />
      </div>
    </>
  );
}
