function Loading({ text = 'Loading...' }) {
  return (
    <div className="loading" role="status">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  )
}
export default Loading
