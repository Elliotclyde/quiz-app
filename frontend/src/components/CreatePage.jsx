import { useState, useEffect } from "preact/hooks";
import { CreatedModal } from "./CreatedModal";
import { NavBar } from "./NavBar";
import { NewUserModal } from "./NewUserModal";

// Bind a bunch of objects to a form to generate a quiz then send it to the server

export function CreatePage() {
  const [data, setData] = useState({
    title: "",
    user: null,
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
  const [submitted, setSubmitted] = useState("IDLE");

  // If there's no user in local storage, pop up a modal to get name
  //  then on return from server set the local storage as that user

  useEffect(() => {
    const localUser = JSON.parse(window.localStorage.getItem("user"));
    if (localUser) {
      setData((data) => {
        return { ...data, user: localUser };
      });
    }
  }, []);

  function onUserCreated(user) {
    window.localStorage.setItem("user", JSON.stringify(user));
    setData((data) => {
      return { ...data, user: user };
    });
  }

  // After we receive a successful response, show a link to send to friends to invite them to do a quiz

  function onSubmit(event) {
    event.preventDefault();
    console.log(JSON.stringify(data));
    if (submitted == "IDLE") {
      setSubmitted("LOADING");
      fetch(import.meta.env.VITE_BACKEND_URL + "/create-quiz/", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
      })
        .then((res, rej) => {
          if (!res.ok) {
            setSubmitted("ERROR");
          } else return res.json();
        })
        .then((res, rej) => {
          setData(res);
          setSubmitted("COMPLETE");
        });
    }
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

  useEffect(() => {
    console.log(data);
  });

  return (
    <>
      <NavBar />
      <div>
        <h1>Create</h1>
        {data.user === null ? (
          <NewUserModal onUserCreated={onUserCreated} />
        ) : (
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
            {(() => {
              switch (submitted) {
                case "IDLE":
                  return <input type="submit" value="Submit" />;
                case "LOADING":
                  return <p>Creating quiz . . . </p>;
                case "ERROR":
                  return (
                    <div>
                      <p>Ooops! There was an errot</p>{" "}
                      <input type="submit" value="Try again?" />;
                    </div>
                  );
                case "COMPLETE":
                  return <CreatedModal quizId={data.quizId} />;
              }
            })()}
          </form>
        )}
      </div>
    </>
  );
}
