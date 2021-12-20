export function CopyButton({ children }) {
  function onCopyClick(e) {
    navigator.clipboard.writeText(e.target.innerText);
  }
  return <button onClick={onCopyClick}>{children}</button>;
}
