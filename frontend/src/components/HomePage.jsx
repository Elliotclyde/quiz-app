import { NavBar } from "./NavBar";

export function HomePage() {
  return (
    <>
      <NavBar />
      <div>
        <h1>Open-quiz</h1>
        <ul>
          <li>Make a quiz</li>
          <li>Invite your friends</li>
          <li>Test their knowledge</li>
        </ul>
      </div>
    </>
  );
}
