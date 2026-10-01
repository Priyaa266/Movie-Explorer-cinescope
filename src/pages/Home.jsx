import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import GenreFilter from '../components/GenreFilter'
import MovieGrid from '../components/MovieGrid'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { searchMovies, errorMessage, CATEGORIES, HOME_ROWS } from '../services/movieApi'

function Home() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    Promise.all(HOME_ROWS.map((r) => searchMovies(r.query)))
      .then((res) => !cancelled && setRows(res.map((r) => r.results)))
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [reload])

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Favorite Movie</h1>
          <p>Search thousands of movies, explore ratings and find what to watch tonight.</p>
          <SearchBar onSearch={(q) => navigate(`/movies?q=${encodeURIComponent(q)}`)} />
          <Link to="/movies" className="btn outline">Browse Movies</Link>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">Browse by Category</h2>
        <GenreFilter
          genres={CATEGORIES}
          selected=""
          onSelect={(id) => navigate(id ? `/movies?genre=${encodeURIComponent(id)}` : '/movies')}
        />
        {loading && <Loading text="Loading movies..." />}
        {error && <ErrorMessage message={error} onRetry={() => setReload((r) => r + 1)} />}
        {!loading && !error && HOME_ROWS.map((row, i) => (
          <div key={row.query}>
            <h2 className="section-title">{row.title}</h2>
            <MovieGrid movies={rows[i] || []} horizontal />
          </div>
        ))}
      </div>
    </>
  )
}
export default Home
