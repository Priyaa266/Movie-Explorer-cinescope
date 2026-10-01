import { NavLink, Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

function Navbar() {
  const navigate = useNavigate()
  return (
    <header className="navbar">
      <Link to="/" className="logo">🎬 Cine<span>Scope</span></Link>
      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
      </nav>
      <div className="nav-search">
        <SearchBar onSearch={(q) => navigate(`/movies?q=${encodeURIComponent(q)}`)} />
      </div>
    </header>
  )
}
export default Navbar
