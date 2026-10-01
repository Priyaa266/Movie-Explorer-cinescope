function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} CineScope – Movie Explorer</p>
      <p className="muted">Movie data provided by the OMDb API.</p>
    </footer>
  )
}
export default Footer
