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

export const inMemoryStorageForTesting =
  import.meta.env.VITE_IN_MEMORY_USER === "true";
window.inMemoryUser = null;

function getInitialUser() {
  if (!inMemoryStorageForTesting) {
    return JSON.parse(window.localStorage.getItem("user"));
  } else {
    return window.inMemoryUser;
  }
}

export function App(props) {
  const [user, updateUser] = useState(getInitialUser());

  const userValue = useMemo(
    () => ({
      user,
      setUser: (inputUser) => {
        if (!inMemoryStorageForTesting) {
          window.localStorage.setItem("user", JSON.stringify(inputUser));
        }
        updateUser(inputUser);
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
        <QuizPage path="/quiz/:roomId?" />
      </Router>
    </UserContext.Provider>
  );
}
