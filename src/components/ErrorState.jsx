export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__message">{message || "Something went wrong."}</p>
      <button type="button" className="error-state__retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
