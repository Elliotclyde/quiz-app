import { useState, useEffect } from "preact/hooks";
import { NavBar } from "./NavBar";

// Bind a bunch of objects to a form to generate a quiz then send it to the server

// Needs to be refactored to be controlled

export function CreatePage() {
  const [data, setData] = useState({
    title: "",
    questions: [
      {
        body: "",
        answers: [
          { body: "", isCorrect: true },
          { body: "", isCorrect: false },
        ],
      },
    ],
  });

  function onSubmit(event) {
    event.preventDefault();
    console.log(JSON.stringify(data));
    fetch(import.meta.env.VITE_BACKEND_URL + "/create-quiz/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
    });
  }

  function onTitleChange(event) {
    setData((currentData) => {
      return { ...currentData, title: event.target.value };
    });
  }
  function onQuestionChange(event, qIndex) {
    setData((currentData) => {
      return {
        ...currentData,
        questions: currentData.questions.map((q, index) => {
          if (index == qIndex) {
            return {
              ...q,
              body: event.target.value,
            };
          } else return q;
        }),
      };
    });
  }
  function onAnswerChange(event, qIndex, aIndex) {
    setData((currentData) => {
      return {
        ...currentData,
        questions: currentData.questions.map((q, currentQuestionIndex) => {
          if (currentQuestionIndex == qIndex) {
            return {
              ...q,
              answers: currentData.questions[qIndex].answers.map(
                (a, currentAnswerIndex) => {
                  if (currentAnswerIndex == aIndex) {
                    return { ...a, body: event.target.value };
                  } else return a;
                }
              ),
            };
          } else return q;
        }),
      };
    });
  }

  function onAddQuestion(event) {
    event.preventDefault();
    setData((currentData) => {
      return {
        ...currentData,
        questions: [
          ...currentData.questions,
          {
            body: "",
            answers: [
              { body: "", isCorrect: true },
              { body: "", isCorrect: false },
            ],
          },
        ],
      };
    });
  }

  function onAddAnswer(event, qIndex) {
    event.preventDefault();
    setData((currentData) => {
      return {
        ...currentData,
        questions: currentData.questions.map((q, index) => {
          if (index == qIndex) {
            return {
              ...q,
              answers: [...q.answers, { body: "", isCorrect: false }],
            };
          } else return q;
        }),
      };
    });
  }

  function onAnswerIsCorrectChange(qIndex, aIndex, value) {
    setData((currentData) => {
      return {
        ...currentData,
        questions: currentData.questions.map((q, index) => {
          if (index == qIndex) {
            return {
              ...q,
              answers: q.answers.map((a, index) => {
                return index === aIndex
                  ? { ...a, isCorrect: value == "on" ? true : false }
                  : { ...a, isCorrect: false };
              }),
            };
          } else return q;
        }),
      };
    });
  }

  useEffect(() => {
    console.log(data);
  });

  return (
    <>
      <NavBar />
      <div>
        <h1>Create</h1>
        <form onSubmit={onSubmit} action="" method="post">
          <label htmlFor="title-input">Title</label>
          <input
            id="title-input"
            type="text"
            value={data.title}
            name="title"
            onInput={onTitleChange}
          />
          {data.questions.map((q, qIndex) => {
            return (
              <div key={qIndex}>
                <label htmlFor={"question-input-text-" + qIndex}>
                  Question
                </label>
                <input
                  id={"question-input-text-" + qIndex}
                  type="text"
                  name={"questionInputText" + qIndex}
                  onInput={(e) => {
                    onQuestionChange(e, qIndex);
                  }}
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
                        onInput={(e) => {
                          onAnswerChange(e, qIndex, aIndex);
                        }}
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
                            qIndex,
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
                  onClick={(e) => {
                    onAddAnswer(e, qIndex);
                  }}
                >
                  Add answer
                </button>
              </div>
            );
          })}
          <button onClick={onAddQuestion}>Add Question</button>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}
