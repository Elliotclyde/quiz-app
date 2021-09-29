import { NavBar } from "./NavBar";
import { QuizHostList } from "./QuizHostList";
import { useFetch } from "../hooks/useFetch";
import { WaitingRoom } from "./WaitingRoom";
import { useEffect, useState, useContext } from "preact/hooks";
import { NewUserModal } from "./NewUserModal";
import { inMemoryStorageForTesting, UserContext } from "../app";

// Needs to
// Load the quiz data
// Sign up for

export function QuizPage({ quizId }) {
  const { user, setUser } = useContext(UserContext);

  function onUserCreated(newUser) {
    if (!inMemoryStorageForTesting) {
      window.localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      window.inMemoryUser = newUser;
    }
    setUser(newUser);
  }

  const listData = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-quiz/",
    quizId === "",
    [quizId]
  );

  const quizData = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-quiz/" + quizId,
    quizId !== ""
  );

  console.log(quizData);
  return (
    <>
      <NavBar />

      {user == null ? <NewUserModal /> : ""}
      {quizId === "" ? (
        listData ? (
          <div>
            <h1>Quizes</h1>
            <QuizHostList listData={listData} />
          </div>
        ) : (
          <div>Loading quizes . . .</div>
        )
      ) : (
        <div>
          <h1>Quiz {quizId}</h1>
          <WaitingRoom
            quiz={quizData}
            isHost={quizData && quizData.quizUser == user?.userId}
            user={user}
          />
        </div>
      )}
    </>
  );
}
