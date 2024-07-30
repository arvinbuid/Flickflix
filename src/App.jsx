/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {useEffect, useRef, useState} from "react";
import StarRating from "./StarRating";
import {useMovies} from "./hooks/useMovies";
import {useLocalStorageState} from "./hooks/useLocalStorageState";

const KEY = "96cadb79";

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  // useLocalStorage custom hook
  const [watched, setWatched] = useLocalStorageState([], "watched");

  // useMovies custom hook
  const {movies, isLoading, error} = useMovies(query);

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? "" : id));
  }

  function handleCloseMovie() {
    setSelectedId("");
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    setSelectedId("");
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <ListBox>
          {isLoading && <Loader />}
          {!error & !isLoading && (
            <MovieList onSelectedMovie={handleSelectedMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </ListBox>
        <WatchedBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDeleteWatchedMovie={handleDeleteWatchedMovie} />
            </>
          )}
        </WatchedBox>
      </Main>
    </>
  );
}

function Loader() {
  return <p className='loader'>Loading...</p>;
}

function ErrorMessage({message}) {
  return (
    <div className='error'>
      <span>⛔</span> <p>{message}</p>
    </div>
  );
}

function NavBar({children}) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>Flickflix</h1>
    </div>
  );
}

function Search({query, setQuery}) {
  const inputRef = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputRef.current) return;
        console.log();

        if (e.code === "Enter") {
          inputRef.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback); // cleanup
    },
    [setQuery]
  );

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputRef}
    />
  );
}

function NumResults({movies}) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({children}) {
  return <main className='main'>{children}</main>;
}

function ListBox({children}) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen1((open) => !open)}>
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({movies, onSelectedMovie}) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedMovie={onSelectedMovie} />
      ))}
    </ul>
  );
}

function Movie({movie, onSelectedMovie}) {
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

function MovieDetails({selectedId, onCloseMovie, onAddWatched, watched, onDeleteWatchedMovie}) {
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

  // Listen to escape keypress
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }

    document.addEventListener("keydown", callback);

    () => document.removeEventListener("keydown", callback); // clean up
  }, [onCloseMovie]);

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

{
  /* Right Box */
}
function WatchedBox({children}) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen2((open) => !open)}>
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && children}
    </div>
  );
}

function WatchedSummary({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({watched, onDeleteWatchedMovie}) {
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

function WatchedMovie({movie, onDeleteWatchedMovie}) {
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
