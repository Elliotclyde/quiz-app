export function CreatedModal({ quizId }) {
  return (
    <div className="modal-background">
      <div className="modal">
        <h3>Quiz created!</h3>
        <p>
          Send this link to your friends to join:
          {" " + import.meta.env.VITE_FRONTEND_URL + "/quiz/" + quizId} or
          <a href={"/edit/" + quizId}>keep editing</a>
        </p>
      </div>
    </div>
  );
}
