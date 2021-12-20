import { currentRooms } from "../index.js";

export function answerQuestion(request, response, next) {
  const { roomId, user, answerIndex } = request.body;
  const userId = user.userId;

  const room = currentRooms[roomId];
  const question = room.data.quiz.questions[room.data.currentQuestionIndex];
  const answer = question.answers[answerIndex];

  room.data.quizers.forEach((quizer) => {
    if (quizer.userId === userId) {
      quizer.hasAnswered = true;
      quizer.answers.push(answer);
      if (answer.isCorrect) {
        quizer.score = quizer.score + 1;
      }
    }
  });

  // Check if everyone has answered
  if (room.data.quizers.filter((q) => !q.hasAnswered).length === 0) {
    room.data.quizers.forEach((quizer) => {
      quizer.hasAnswered = false;
    });
    room.data.currentQuestionIndex = room.data.currentQuestionIndex + 1;
  }

  room.connections.forEach((connection) =>
    connection.write(
      `event: message\ndata:${JSON.stringify({
        type: "answer",
        ...room.data,
      })}\n\n`
    )
  );
  // Check if that was the last question
  if (room.data.currentQuestionIndex >= room.data.quiz.questions.length) {
    room.connections.forEach((connection) => {
      connection.end();
      currentRooms[roomId] = null;
    });
  }
}
