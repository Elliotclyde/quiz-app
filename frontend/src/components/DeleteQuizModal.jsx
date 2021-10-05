export function DeleteQuizModal({ onDeleteCallback }) {
  return (
    <div className="modal-background">
      <div className="modal">
        <h2>Delete this quiz?</h2>
        <button onClick={() => onDeleteCallback(true)}>Yes</button>
        <button onClick={() => onDeleteCallback(false)}>No</button>
      </div>
    </div>
  );
}
