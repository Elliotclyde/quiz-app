import { Logo } from "./logo";
import { useState } from "preact/hooks";
import { useSSE } from "./hooks/useSSE";

export function App(props) {
  const [message, setMessage] = useState("Loading . . . ");
  useSSE((response) => {
    setMessage(response);
  });
  return (
    <>
      <Logo />
      <p>Hello Vite + Preact!</p>
      <p>
        <h1>{message}</h1>
      </p>
    </>
  );
}
