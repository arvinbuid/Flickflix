import PropTypes from "prop-types";
import Movie from "./Movie";

MovieList.propTypes = {
  movies: PropTypes.array,
  onSelectedMovie: PropTypes.func,
};

export default function MovieList({movies, onSelectedMovie}) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedMovie={onSelectedMovie} />
      ))}
    </ul>
  );
}
