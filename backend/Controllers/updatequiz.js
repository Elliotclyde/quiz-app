import { dataBase } from "../Database/db.js";

export async function updateQuiz(req, response) {
  // The quiz has to have an ID already so automatically update the title based on data received- no matter what

  // Check through the rest of the data to see if there is an ID present
  // If there is no ID present then create a new question/answer associated with its parent

  // Then we have to query whether there are any questions with the quiz id but NOT in the returned data
  // And delete these

  // Then any answers associated with a question ID which no longer exists
  // And delete these

  let oldQuizData = await dataBase.getQuizData(req.params.quizId);

  const newQuizData = req.body;

  // First update quiz Id if new

  dataBase.updateQuiz(req.params.quizId, { title: newQuizData.title });

  // Create the brand new questions

  const newQuestions = newQuizData.questions.filter(
    (q) => q.questionId === undefined
  );

  newQuestions.reduce(async (previousPromise, nextQuestion) => {
    await previousPromise;

    const dbQuestion = await dataBase.newQuestion(
      nextQuestion.body,
      req.params.quizId
    );

    await nextQuestion.answers.reduce(async (previousPromise, nextAnswer) => {
      await previousPromise;
      return dataBase.newAnswer(
        nextAnswer.body,
        nextAnswer.isCorrect,
        dbQuestion.questionId
      );
    }, Promise.resolve());
  }, Promise.resolve());

  // Now that we've finished creating the new questions we update the old ones

  const questionsToUpdate = newQuizData.questions.filter(
    (q) => q.questionId !== undefined
  );

  questionsToUpdate.reduce(async (previousPromise, nextQuestion) => {
    await previousPromise;

    // First delete any old answers that are no longer included
    // Important that this happens before adding new ones

    const oldAnswers = oldQuizData.questions.filter(
      (q) => q.questionId == nextQuestion.questionId
    )[0].answers;

    const oldAnswersToDelete = oldAnswers.filter((oldAnswer) => {
      return !nextQuestion.answers
        .map((a) => a.answerId)
        .includes(oldAnswer.answerId);
    });

    oldAnswersToDelete.reduce(async (previousPromise, nextAnswer) => {
      await previousPromise;
      return dataBase.deleteAnswer(nextAnswer.answerId);
    }, Promise.resolve());

    // Create the new answers

    const newAnswers = nextQuestion.answers.filter(
      (a) => a.answerId === undefined
    );
    await newAnswers.reduce(async (previousPromise, nextAnswer) => {
      await previousPromise;
      return dataBase.newAnswer(
        nextAnswer.body,
        nextAnswer.isCorrect,
        nextQuestion.questionId
      );
    }, Promise.resolve());

    // Update the existing answers
    const answersToUpdate = nextQuestion.answers.filter(
      (a) => a.answerId !== undefined
    );

    await answersToUpdate.reduce(async (previousPromise, nextAnswer) => {
      await previousPromise;
      return dataBase.updateAnswer(nextAnswer.answerId, {
        body: nextAnswer.body,
        isCorrect: nextAnswer.isCorrect,
      });
    }, Promise.resolve());
  }, Promise.resolve());

  const oldQuestionsToDelete = oldQuizData.questions.filter((oldQuestion) => {
    return !newQuizData.questions
      .map((q) => q.questionId)
      .includes(oldQuestion.questionId);
  });

  oldQuestionsToDelete.reduce(async (previousPromise, nextQuestion) => {
    await previousPromise;

    const oldAnswersToDelete = oldQuizData.questions.filter(
      (q) => q.questionId == nextQuestion.questionId
    )[0].answers;

    oldAnswersToDelete.reduce(async (previousPromise, nextAnswer) => {
      await previousPromise;
      return dataBase.deleteAnswer(nextAnswer.answerId);
    }, Promise.resolve());

    return dataBase.deleteQuestion(nextQuestion.questionId);
  }, Promise.resolve());
  response.json(newQuizData);
  response.end();
}
