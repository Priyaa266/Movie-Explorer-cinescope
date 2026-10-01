import { Link } from 'react-router-dom'
import Rating from './Rating'

function MovieCard({ movie }) {
  return (
    <article className="card">
      <Link to={`/movie/${movie.id}`} className="poster-link">
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="no-poster">No Poster Available</div>
        )}
      </Link>
      <div className="card-body">
        <h3 title={movie.title}>{movie.title}</h3>
        {movie.vote_average != null && <Rating value={movie.vote_average} />}
        <p className="muted">Released: {movie.release_date}</p>
        <span className="tag">{movie.type}</span>
        <Link to={`/movie/${movie.id}`} className="btn small">View Details</Link>
      </div>
    </article>
  )
}
export default MovieCard
