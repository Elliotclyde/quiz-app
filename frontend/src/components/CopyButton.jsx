export function CopyButton({ children }) {
  function onCopyClick(e) {
    console.log(e.target.innerText);
    navigator.clipboard.writeText(e.target.innerText);
  }
  return <button onClick={onCopyClick}>{children}</button>;
}
