import { Link } from "preact-router";

export function NavBar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/create">Create</Link>
      <Link href="/edit">Edit</Link>
      <Link href="/quiz">Quiz</Link>
    </nav>
  );
}
