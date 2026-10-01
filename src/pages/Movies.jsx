import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import GenreFilter from '../components/GenreFilter'
import MovieGrid from '../components/MovieGrid'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { searchMovies, errorMessage, CATEGORIES, DEFAULT_QUERY } from '../services/movieApi'

function Movies() {
  const [params, setParams] = useSearchParams()
  const searchQuery = params.get('q') || ''
  const selectedGenre = params.get('genre') || ''
  const activeQuery = searchQuery || selectedGenre || DEFAULT_QUERY

  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  // Load first page whenever the search or category changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    searchMovies(activeQuery, 1)
      .then((data) => {
        if (cancelled) return
        setMovies(data.results)
        setPage(1)
        setTotalPages(data.totalPages)
      })
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [activeQuery, reload])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const data = await searchMovies(activeQuery, page + 1)
      setMovies((prev) => {
        const ids = new Set(prev.map((m) => m.id))
        return [...prev, ...data.results.filter((m) => !ids.has(m.id))]
      })
      setPage(page + 1)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoadingMore(false)
    }
  }

  let title = 'Browse Movies'
  if (searchQuery) title = `Search results for "${searchQuery}"`
  else if (selectedGenre) title = `${selectedGenre} Movies`

  return (
    <div className="container">
      <h1 className="page-title">{title}</h1>
      <SearchBar
        key={searchQuery}
        initialValue={searchQuery}
        onSearch={(q) => setParams({ q })}
        onClear={() => setParams({})}
      />
      <GenreFilter genres={CATEGORIES} selected={selectedGenre} onSelect={(id) => setParams(id ? { genre: id } : {})} />

      {loading && <Loading text="Loading movies..." />}
      {error && <ErrorMessage message={error} onRetry={() => setReload((r) => r + 1)} />}

      {!loading && !error && movies.length === 0 && (
        <div className="empty">
          <p>😕 No movies found for "{activeQuery}". Try a different search.</p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />
          {page < totalPages && (
            <div className="center">
              <button className="btn" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
export default Movies
