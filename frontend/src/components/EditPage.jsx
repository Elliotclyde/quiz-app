import { useFetch } from "../hooks/useFetch";
import { NavBar } from "./NavBar";

// Needs to
// Load the quiz data
// Sign up for

export function EditPage({ quizid }) {
  const data = useFetch(import.meta.env.VITE_BACKEND_URL + "/edit/" + quizid);
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
