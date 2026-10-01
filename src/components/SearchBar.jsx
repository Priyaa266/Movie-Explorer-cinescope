import { useState } from 'react'

function SearchBar({ initialValue = '', onSearch, onClear }) {
  const [value, setValue] = useState(initialValue)
  const [hint, setHint] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = value.trim()
    if (!q) {
      setHint('Please type a movie name to search.')
      return
    }
    setHint('')
    onSearch(q)
  }

  const handleClear = () => {
    setValue('')
    setHint('')
    if (onClear) onClear()
  }

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <div className="search-row">
        <input
          type="text"
          value={value}
          placeholder="Search movies..."
          aria-label="Search movies"
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button type="button" className="clear-btn" onClick={handleClear} aria-label="Clear search">✕</button>
        )}
        <button type="submit" className="btn">Search</button>
      </div>
      {hint && <small className="hint">{hint}</small>}
    </form>
  )
}
export default SearchBar
