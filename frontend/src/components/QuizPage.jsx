import { NavBar } from "./NavBar";
import { QuizHostList } from "./QuizHostList";
import { useFetch } from "../hooks/useFetch";
import { QuizRoom } from "./QuizRoom";
import { useEffect, useState, useContext } from "preact/hooks";
import { NewUserModal } from "./NewUserModal";
import { inMemoryStorageForTesting, UserContext } from "../app";

// Needs to
// Load the quiz data
// Sign up for

export function QuizPage({ quizRandomId }) {
  const { user, setUser } = useContext(UserContext);

  const listData = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-quiz/",
    quizRandomId === "",
    [quizRandomId]
  );
  const quizData = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-quiz/" + quizRandomId,
    quizRandomId !== ""
  );

  return (
    <>
      <NavBar />
      {/* Either way we need the user so show the modal to sign up user */}
      {user == null ? <NewUserModal /> : ""}
      {/* If there is no quiz */}
      <div>
        <h1>{quizData?.title}</h1>
        <QuizRoom quiz={quizData} user={user} />
      </div>
    </>
  );
}
