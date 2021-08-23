import { useState } from "preact/hooks";
import { NavBar } from "./NavBar";

// Bind a bunch of objects to a form to generate a quiz then send it to the server

// Needs to be refactored to be controlled

export function CreatePage() {
  const [questions, setQuestions] = useState([
    {
      body: "",
      answers: [
        { body: "", isCorrect: true },
        { body: "", isCorrect: false },
      ],
    },
  ]);
  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(Object.fromEntries(data.entries()));
  }

  function onAddQuestion() {
    setQuestions((currentQs) => {
      return [
        ...currentQs,
        {
          body: "",
          answers: [
            { body: "", isCorrect: true },
            { body: "", isCorrect: false },
          ],
        },
      ];
    });
  }

  function onAddAnswer(qIndex) {
    setQuestions((currentQs) => {
      return currentQs.map((q, index) => {
        if (index == qIndex) {
          return {
            ...q,
            answers: [...q.answers, { body: "", isCorrect: false }],
          };
        } else return q;
      });
    });
  }

  function onAnswerIsCorrectChange(qIndex, aIndex, value) {
    setQuestions((currentQs) => {
      return currentQs.map((q, index) => {
        if (index == qIndex) {
          return {
            ...q,
            answers: q.answers.map((a, index) => {
              return index === aIndex
                ? { ...a, isCorrect: value }
                : { ...a, isCorrect: false };
            }),
          };
        } else return q;
      });
    });
  }

  return (
    <>
      <NavBar />
      <div>
        <h1>Create</h1>
        <form onSubmit={onSubmit} action="" method="post">
          <label htmlFor="title-input">Title</label>
          <input id="title-input" type="text" name="title" />
          {questions.map((q, index) => {
            return (
              <div key={index}>
                <label htmlFor={"question-input-text-" + index}>Question</label>
                <input
                  id={"question-input-text-" + index}
                  type="text"
                  name={"questionInputText" + index}
                />
                {q.answers.map((a, aIndex) => {
                  return (
                    <div key={aIndex}>
                      <label htmlFor={"answer-input-text-" + aIndex}>
                        Answer {aIndex + 1}
                      </label>
                      <input
                        id={"answer-input-text-" + aIndex}
                        type="text"
                        name={"answerInputText" + aIndex}
                      />
                      <label htmlFor={"answer-input-is-correct-" + aIndex}>
                        Correct?
                      </label>
                      <input
                        id={"answer-input-is-correct-" + aIndex}
                        type="checkbox"
                        name={"answerInputIsCorrect" + aIndex}
                        checked={a.isCorrect}
                        onChange={(e) => {
                          onAnswerIsCorrectChange(
                            index,
                            aIndex,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  );
                })}
                <button
                  disabled={q.answers.length >= 4}
                  onClick={() => {
                    onAddAnswer(index);
                  }}
                >
                  Add answer
                </button>
              </div>
            );
          })}
        </form>
        <button onClick={onAddQuestion}>Add Question</button>
      </div>
    </>
  );
}
