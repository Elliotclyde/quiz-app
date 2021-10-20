import { useFetch } from "../hooks/useFetch";
import { NavBar } from "./NavBar";
import { useState, useEffect, useContext } from "preact/hooks";
import { QuizEditList } from "./QuizEditList";
import { UserContext } from "../app";
import { NewUserModal } from "./NewUserModal";
import { DeleteQuizModal } from "./DeleteQuizModal";

import { route } from "preact-router";
// Needs to
// Load the quiz data
// Sign up for

export function EditPage({ quizId }) {
  const { user } = useContext(UserContext);
  console.log(quizId);

  const quizData = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-quiz/" + quizId,
    quizId !== ""
  );

  const userListdata = useFetch(
    import.meta.env.VITE_BACKEND_URL + "/get-user-quizes/" + user?.userId,
    quizId === "" && user,
    [quizId]
  );

  return (
    <>
      <NavBar />
      <div className="quiz-edit-wrapper">
        <h1>Quiz editor</h1>
        {quizId != "" ? (
          quizData != null ? (
            <EditForm initialData={quizData} user={user} quizId={quizId} />
          ) : (
            <p>Loading . . .</p>
          )
        ) : (
          <>
            {user == null ? <NewUserModal /> : ""}
            <h1>Select quiz to edit</h1>
            {userListdata != null ? (
              <QuizEditList listData={userListdata} />
            ) : (
              <p>Loading . . .</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

function EditForm({ initialData, quizId, user }) {
  const [data, setData] = useState(initialData);
  const [deleteModalShowing, setDeleteModalShowing] = useState(false);

  useEffect(() => {
    console.log(data);
  });

  function onSubmit(event) {
    event.preventDefault();
    console.log(JSON.stringify(data));
    fetch(import.meta.env.VITE_BACKEND_URL + "/edit-quiz/" + quizId, {
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

  function onSaveAndHost(event) {
    event.preventDefault();
    fetch(import.meta.env.VITE_BACKEND_URL + "/host-quiz", {
      body: JSON.stringify({
        userId: user.userId,
        quizId: parseInt(quizId),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // Read the response as json.
        return response.json();
      })
      .then(function (responseAsJson) {
        console.log(responseAsJson);
        route("/quiz/" + responseAsJson.roomId);
      })
      .catch(function (error) {
        console.log(error);
        console.log("Looks like there was a problem: \n", error);
      });
  }

  function onDeleteQuiz(deleting) {
    if (deleting) {
      fetch(import.meta.env.VITE_BACKEND_URL + "/delete-quiz/" + quizId, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
      })
        .then((res, rej) => {
          return res.json();
        })
        .then((res, rej) => {
          console.log("here");
          if (res.result === "deleted") {
            window.location.href =
              import.meta.env.VITE_FRONTEND_URL + "/editor";
          }
        });
    } else {
      setDeleteModalShowing(false);
    }
  }

  return (
    <>
      {deleteModalShowing ? (
        <DeleteQuizModal onDeleteCallback={onDeleteQuiz} />
      ) : (
        ""
      )}
      <form onSubmit={onSubmit} action="" method="post">
        <div className="title-input-wrapper">
          <label className="title-input-label" htmlFor="title-input">
            Title:
          </label>
          <input
            id="title-input"
            type="text"
            value={data.title}
            name="title"
            onInput={onTitleChange}
          />
        </div>
        {data.questions.map((q, qIndex) => {
          return (
            <div key={qIndex}>
              <div className="question-input-wrapper">
                <label htmlFor={"question-input-text-" + qIndex}>
                  Question {qIndex + 1}:
                </label>
                <input
                  className="question-input"
                  id={"question-input-text-" + qIndex}
                  type="text"
                  name={"questionInputText" + qIndex}
                  onInput={(e) => {
                    onQuestionChange(e, qIndex);
                  }}
                  value={q.body}
                />
              </div>
              {q.answers.map((a, aIndex) => {
                return (
                  <div key={aIndex}>
                    <label htmlFor={"answer-input-text-" + aIndex}>
                      Answer {aIndex + 1}:
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
        <div className="save-wrapper">
          <input type="submit" value="Save" />
          <button onClick={onSaveAndHost}>Save and host</button>
        </div>
      </form>
      <button
        onClick={() => {
          setDeleteModalShowing(true);
        }}
      >
        Delete quiz
      </button>
    </>
  );
}
