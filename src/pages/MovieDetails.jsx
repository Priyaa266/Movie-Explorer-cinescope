import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Rating from '../components/Rating'
import { getMovieDetails, errorMessage } from '../services/movieApi'

const clean = (v) => (v && v !== 'N/A' ? v : 'Unknown')

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setMovie(null)
    window.scrollTo(0, 0)
    getMovieDetails(id)
      .then((data) => !cancelled && setMovie(data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Loading text="Loading movie details..." />

  if (error || !movie) {
    return (
      <div className="container">
        <ErrorMessage message={error || 'Unable to load movies. Please try again.'} />
        <button className="btn" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    )
  }

  const hasPoster = movie.Poster && movie.Poster !== 'N/A'
  const genres = movie.Genre && movie.Genre !== 'N/A' ? movie.Genre.split(', ') : []

  return (
    <div className="container details no-backdrop">
      <button className="btn outline" onClick={() => navigate(-1)}>← Back</button>
      <div className="details-layout">
        {hasPoster ? (
          <img className="details-poster" src={movie.Poster} alt={movie.Title} />
        ) : (
          <div className="no-poster details-poster">No Poster Available</div>
        )}
        <div className="details-info">
          <h1>{movie.Title}</h1>
          <Rating value={parseFloat(movie.imdbRating)} />
          <div className="genres">
            {genres.map((g) => <span key={g} className="tag">{g}</span>)}
          </div>
          <h3>Overview</h3>
          <p>{movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No overview available.'}</p>
          <ul className="facts">
            <li><strong>Release Date:</strong> {clean(movie.Released)}</li>
            <li><strong>Runtime:</strong> {clean(movie.Runtime)}</li>
            <li><strong>Language:</strong> {clean(movie.Language)}</li>
            <li><strong>Director:</strong> {clean(movie.Director)}</li>
            <li><strong>Cast:</strong> {clean(movie.Actors)}</li>
            <li><strong>Vote Count:</strong> {clean(movie.imdbVotes)}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default MovieDetails
