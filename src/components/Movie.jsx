import PropTypes from "prop-types";

Movie.propTypes = {
  movie: PropTypes.shape({
    imdbID: PropTypes.string,
    Poster: PropTypes.string,
    Title: PropTypes.string,
    Year: PropTypes.string,
  }),
  onSelectedMovie: PropTypes.func,
};

export default function Movie({movie, onSelectedMovie}) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
