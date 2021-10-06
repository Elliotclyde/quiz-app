import { Link, route } from "preact-router";
import { useState, useContext } from "preact/hooks";
import { UserContext } from "../app";
import { NewUserModal } from "./NewUserModal";

const initialQuiz = {
  title: "My quiz",
  user: null,
  questions: [
    {
      body: "What is the population of France?",
      answers: [
        { body: "65,453,399", isCorrect: true },
        { body: "32,392,213", isCorrect: false },
      ],
    },
  ],
};

export function NavBar() {
  const [needsUser, setNeedsUser] = useState(false);
  const { user } = useContext(UserContext);

  function createQuiz(currentUser) {
    initialQuiz.user = currentUser;
    fetch(import.meta.env.VITE_BACKEND_URL + "/create-quiz/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(initialQuiz),
    })
      .then((res, rej) => {
        if (!res.ok) {
        } else return res.json();
      })
      .then((res, rej) => {
        console.log(res);
        setNeedsUser(false);
        route("/editor/" + res.quizId);
      });
  }

  function onCreateClick() {
    if (user) {
      createQuiz(user);
    } else {
      setNeedsUser(true);
    }
  }

  return (
    <nav>
      <Link href="/">Home</Link>
      <button onClick={onCreateClick}>Create</button>
      <Link href="/editor">Edit</Link>
      <Link href="/host">Host</Link>
      {needsUser && !user ? <NewUserModal onAuthCallback={createQuiz} /> : null}
    </nav>
  );
}
