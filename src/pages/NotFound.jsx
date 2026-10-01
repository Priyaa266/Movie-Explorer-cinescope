import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container center">
      <h1 className="big">404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="btn">Go Home</Link>
    </div>
  )
}
export default NotFound
