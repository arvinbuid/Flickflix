import {useEffect, useRef, useState} from "react";
import {useKey} from "../hooks/useKey";
import StarRating from "../StarRating";
import PropTypes from "prop-types";

const KEY = "96cadb79";

MovieDetails.propTypes = {
  selectedId: PropTypes.string,
  onCloseMovie: PropTypes.func,
  onAddWatched: PropTypes.func,
  watched: PropTypes.array,
};

export default function MovieDetails({selectedId, onCloseMovie, onAddWatched, watched}) {
  const [movie, setMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const watchedMovie = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Poster: poster,
    Released: releasedDate,
    Genre: genre,
    Runtime: runtime,
    imdbRating: imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
  } = movie;

  function handleAddMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      releasedDate,
      poster,
      genre,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRateDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // useKey custom hook
  useKey("Escape", onCloseMovie);

  useEffect(() => {
    // fetch movie id
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => (document.title = "Flickflix");
  }, [title]);

  return (
    <div className='details'>
      {isLoading ? (
        <p className='loader'>Loading...</p>
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>

            <img src={poster} alt={`Poster of ${title}`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {releasedDate} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            {!watchedMovie ? (
              <div className='rating'>
                <StarRating maxRating={10} size={26} onSetRating={setUserRating} />
                {userRating && (
                  <button className='btn-add' onClick={handleAddMovie}>
                    Add to list
                  </button>
                )}
              </div>
            ) : (
              <div className='rating'>
                <p>
                  You rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              </div>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
