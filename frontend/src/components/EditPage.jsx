import { NavBar } from "./NavBar";

// Needs to
// Load the quiz data
// Sign up for

export function EditPage({ quizid }) {
  return (
    <>
      <NavBar />
      <div>
        {quizid ? (
          <>
            <h1>Edit quiz {quizid}</h1>
          </>
        ) : (
          <>
            <h1>Select quiz to edit</h1>
          </>
        )}
      </div>
    </>
  );
}
