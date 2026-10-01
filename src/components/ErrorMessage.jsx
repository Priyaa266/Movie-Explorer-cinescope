function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <p>⚠️ {message}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Try Again</button>}
    </div>
  )
}
export default ErrorMessage
