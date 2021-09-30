import { useState, useContext } from "preact/hooks";
import { inMemoryStorageForTesting, UserContext } from "../app";

export function NewUserModal({ onAuthCallback }) {
  const [name, setName] = useState("");
  const { user, setUser } = useContext(UserContext);

  console.log(user);
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
        if (inMemoryStorageForTesting && document.getElementById("id").value) {
          res.userId = parseInt(document.getElementById("id").value);
        }
        setUser(res);
        console.log(res);
        if (onAuthCallback) {
          onAuthCallback(res);
        }
      });
  }

  function onNameChange(e) {
    setName(e.target.value);
  }

  return (
    <div className="modal-background">
      <div className="modal">
        <h2>New user</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="new-name">Enter name:</label>
          <input
            type="text"
            onChange={onNameChange}
            value={name}
            name="name"
            id="new-name"
          />
        </form>
        {inMemoryStorageForTesting ? (
          <>
            <label htmlFor="id">User ID</label>
            <input id="id" type="number" />
          </>
        ) : null}
      </div>
    </div>
  );
}
