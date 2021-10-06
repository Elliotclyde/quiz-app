import { QuizPage } from "./components/QuizPage";
import { HomePage } from "./components/HomePage";
import { EditPage } from "./components/EditPage";
import { HostPage } from "./components/HostPage";
import { useState, useMemo } from "preact/hooks";
import { useSSE } from "./hooks/useSSE";
import Router from "preact-router";
import { createContext } from "preact";

export const UserContext = createContext({ user: null, setUser: () => {} });

// Quiz page
// By

export const inMemoryStorageForTesting = true;
window.inMemoryUser = null;

function getInitialUser() {
  if (!inMemoryStorageForTesting) {
    return JSON.parse(window.localStorage.getItem("user"));
  } else {
    return window.inMemoryUser;
  }
}

export function App(props) {
  const [user, setUser] = useState(getInitialUser());

  const userValue = useMemo(
    () => ({
      user,
      setUser: (inputUser) => {
        setUser(inputUser);
        if (!inMemoryStorageForTesting) {
          window.localStorage.setItem("user", JSON.stringify(inputUser));
        }
      },
    }),
    [user]
  );

  return (
    <UserContext.Provider value={userValue}>
      <Router>
        <HomePage path="/" />
        <EditPage path="/editor/:quizId?" />
        <HostPage path="/host/:quizId?" />
        <QuizPage path="/quiz/:quizRandomId?" />
      </Router>
    </UserContext.Provider>
  );
}
