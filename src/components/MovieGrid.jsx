import MovieCard from './MovieCard'

function MovieGrid({ movies, genreMap, horizontal = false }) {
  return (
    <div className={horizontal ? 'grid horizontal' : 'grid'}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genreMap={genreMap} />
      ))}
    </div>
  )
}
export default MovieGrid
