import { useFetch } from "../hooks/useFetch";
import { NavBar } from "./NavBar";
import { useState, useEffect } from "preact/hooks";

// Needs to
// Load the quiz data
// Sign up for

export function EditPage({ quizid }) {
  const data = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-quiz/" + quizid
  );

  return (
    <>
      <NavBar />
      <div>
        {quizid ? (
          data != null ? (
            <EditForm initialData={data} quizid={quizid} />
          ) : (
            <p>Loading . . .</p>
          )
        ) : (
          <>
            <h1>Select quiz to edit</h1>
          </>
        )}
      </div>
    </>
  );
}

function EditForm({ initialData, quizid }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    console.log(data);
  });

  function onSubmit(event) {
    event.preventDefault();
    console.log(JSON.stringify(data));
    fetch(import.meta.env.VITE_BACKEND_URL + "/edit-quiz/" + quizid, {
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
  function onRemoveQuestion(event, qIndex) {
    setData((currentData) => {
      return {
        ...currentData,
        questions: [
          ...currentData.questions.filter((question, index) => index != qIndex),
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

  function onRemoveAnswer(event, qIndex, aIndex) {
    event.preventDefault();
    setData((currentData) => {
      return {
        ...currentData,
        questions: [
          ...currentData.questions.map((question, index) => {
            if (index != qIndex) {
              return question;
            } else {
              return {
                ...question,
                answers: question.answers.filter(
                  (answer, index) => index != aIndex
                ),
              };
            }
          }),
        ],
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
  // TODO: Add option to
  function onDeleteQuiz() {
    fetch(import.meta.env.VITE_BACKEND_URL + "/delete-quiz/" + quizid, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
    });
  }

  return (
    <>
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
              <label htmlFor={"question-input-text-" + qIndex}>Question</label>
              <input
                id={"question-input-text-" + qIndex}
                type="text"
                name={"questionInputText" + qIndex}
                onInput={(e) => {
                  onQuestionChange(e, qIndex);
                }}
                value={q.body}
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
                      value={a.body}
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
                        onAnswerIsCorrectChange(qIndex, aIndex, e.target.value);
                      }}
                    />
                    <button
                      disabled={q.answers.length <= 2}
                      onClick={(event) => {
                        onRemoveAnswer(event, qIndex, aIndex);
                      }}
                    >
                      Remove Answer
                    </button>
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
              <button
                disabled={data.questions.length <= 1}
                onClick={(event) => {
                  onRemoveQuestion(event, qIndex);
                }}
              >
                Remove Question
              </button>
            </div>
          );
        })}
        <button onClick={onAddQuestion}>Add Question</button>
        <input type="submit" value="Submit" />
      </form>
      <button onClick={onDeleteQuiz}>Delete quiz</button>
    </>
  );
}
