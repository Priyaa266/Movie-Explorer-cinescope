function Rating({ value }) {
  if (!value) return <span className="rating muted">Not rated</span>
  return <span className="rating">⭐ {value.toFixed(1)} / 10</span>
}
export default Rating
