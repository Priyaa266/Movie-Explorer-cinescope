// All OMDb API calls live in this file.
const BASE_URL = 'https://www.omdbapi.com/'
const API_KEY = import.meta.env.VITE_OMDB_API_KEY

// OMDb has no genre list or "popular" endpoints, so categories are keyword searches.
export const DEFAULT_QUERY = 'love'
export const CATEGORIES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller']
  .map((name) => ({ id: name, name }))
export const HOME_ROWS = [
  { title: 'Superhero Movies', query: 'avengers' },
  { title: 'Batman Collection', query: 'batman' },
  { title: 'Star Wars Universe', query: 'star wars' },
]

async function request(params) {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') throw new Error('NO_KEY')
  const query = new URLSearchParams({ apikey: API_KEY, ...params })
  let res
  try {
    res = await fetch(`${BASE_URL}?${query}`)
  } catch {
    throw new Error('NETWORK')
  }
  if (res.status === 401) throw new Error('INVALID_KEY')
  if (!res.ok) throw new Error('API')
  const data = await res.json()
  if (data.Response === 'False') {
    const msg = data.Error || ''
    if (/invalid api key|no api key/i.test(msg)) throw new Error('INVALID_KEY')
    if (/limit/i.test(msg)) throw new Error('LIMIT')
    if (/too many results/i.test(msg)) throw new Error('EMPTY')
    if (/not found|incorrect imdb id/i.test(msg)) throw new Error('NOT_FOUND')
    throw new Error('API')
  }
  return data
}

export function errorMessage(err) {
  switch (err.message) {
    case 'NO_KEY':
    case 'INVALID_KEY':
      return 'Invalid or missing API key. Please check your OMDb key in the .env file (and activate it from your email).'
    case 'NETWORK':
      return 'Network error. Please check your internet connection and try again.'
    case 'LIMIT':
      return 'Daily API request limit reached. Please try again tomorrow.'
    case 'NOT_FOUND':
      return 'Movie not found. It may have been removed or the link is invalid.'
    default:
      return 'Unable to load movies. Please try again.'
  }
}

// Converts an OMDb search item to a simple object used by our components
const toMovie = (m) => ({
  id: m.imdbID,
  title: m.Title,
  release_date: m.Year,
  type: m.Type,
  poster: m.Poster && m.Poster !== 'N/A' ? m.Poster : null,
})

// Search by title. Returns { results, totalPages } (10 results per page)
export async function searchMovies(query, page = 1) {
  try {
    const data = await request({ s: query, type: 'movie', page })
    return {
      results: data.Search.map(toMovie),
      totalPages: Math.ceil(Number(data.totalResults) / 10),
    }
  } catch (err) {
    if (err.message === 'NOT_FOUND' || err.message === 'EMPTY') return { results: [], totalPages: 0 }
    throw err
  }
}

// Category filter = keyword search
export const getMoviesByCategory = (category, page = 1) => searchMovies(category, page)

export const getMovieDetails = (imdbId) => request({ i: imdbId, plot: 'full' })
