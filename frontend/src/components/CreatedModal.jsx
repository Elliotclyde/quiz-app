export function CreatedModal({ quizId }) {
  return (
    <div className="modal-background">
      <div className="modal">
        <h3>Quiz created!</h3>
        <p>
          Send this link to your friends to join or
          <a href={"/edit/" + quizId}>keep editing</a>
        </p>
      </div>
    </div>
  );
}
