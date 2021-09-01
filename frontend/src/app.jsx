import { CreatePage } from "./components/CreatePage";
import { QuizPage } from "./components/QuizPage";
import { HomePage } from "./components/HomePage";
import { EditPage } from "./components/EditPage";
import { useState } from "preact/hooks";
import { useSSE } from "./hooks/useSSE";
import Router from "preact-router";

export function App(props) {
  return (
    <Router>
      <HomePage path="/" />
      <CreatePage path="/create" />
      <QuizPage path="/quiz/:quizId?" />
      <EditPage path="/edit/:quizId?" />
    </Router>
  );
}
