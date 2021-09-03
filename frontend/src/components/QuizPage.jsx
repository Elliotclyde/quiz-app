import { NavBar } from "./NavBar";
import { QuizHostList } from "./QuizHostList";
import { useFetch } from "../hooks/useFetch";
import { WaitingRoom } from "./WaitingRoom";
import { useEffect, useState } from "preact/hooks";
import { NewUserModal } from "./NewUserModal";

// Needs to
// Load the quiz data
// Sign up for

export function QuizPage({ quizId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(window.localStorage.getItem("user"));
    if (localUser) {
      setUser(localUser);
    }
  }, []);

  function onUserCreated(newUser) {
    window.localStorage.setItem("user", JSON.stringify(newUser));
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

      {user == null ? <NewUserModal onUserCreated={onUserCreated} /> : ""}
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
            isHost={
              quizData &&
              quizData.quizUser ==
                JSON.parse(window.localStorage.getItem("user"))?.userId
            }
            user={JSON.parse(window.localStorage.getItem("user"))}
          />
        </div>
      )}
    </>
  );
}
