import PropTypes from "prop-types";
import WatchedMovie from "./WatchedMovie";

WatchedMovieList.propTypes = {
  watched: PropTypes.array,
  onDeleteWatchedMovie: PropTypes.func,
};

export default function WatchedMovieList({watched, onDeleteWatchedMovie}) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}
