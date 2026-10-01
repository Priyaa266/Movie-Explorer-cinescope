function GenreFilter({ genres, selected, onSelect }) {
  return (
    <div className="genre-filter">
      <button className={`chip ${!selected ? 'active' : ''}`} onClick={() => onSelect('')}>All</button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`chip ${String(g.id) === String(selected) ? 'active' : ''}`}
          onClick={() => onSelect(String(g.id))}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
export default GenreFilter
