import { useState } from "preact/hooks";

export function NewUserModal({ onUserCreated }) {
  const [name, setName] = useState("");
  function onSubmit(e) {
    e.preventDefault();
    fetch(import.meta.env.VITE_BACKEND_URL + "/create-user/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ name: name }),
    })
      .then((res, rej) => {
        if (!res.ok) {
        } else return res.json();
      })
      .then((res, rej) => {
        onUserCreated(res);
      });
  }
  function onNameChange(e) {
    setName(e.target.value);
  }
  return (
    <div className="modal-background">
      <div className="modal">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            onChange={onNameChange}
            value={name}
            name="name"
            id=""
          />
        </form>
      </div>
    </div>
  );
}
