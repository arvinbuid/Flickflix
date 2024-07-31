import PropTypes from "prop-types";

WatchedMovie.propTypes = {
  movie: PropTypes.shape({
    imdbID: PropTypes.string,
    poster: PropTypes.string,
    title: PropTypes.string,
    imdbRating: PropTypes.number, // or PropTypes.number, depending on your data
    userRating: PropTypes.number, // or PropTypes.number, depending on your data
    runtime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // depending on your data
  }),
  onDeleteWatchedMovie: PropTypes.func,
};

export default function WatchedMovie({movie, onDeleteWatchedMovie}) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <p>
          <button className='btn-delete' onClick={() => onDeleteWatchedMovie(movie.imdbID)}>
            X
          </button>
        </p>
      </div>
    </li>
  );
}
