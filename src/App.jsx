/* eslint-disable react/prop-types */

import {useState} from "react";
import {useMovies} from "./hooks/useMovies";
import {useLocalStorageState} from "./hooks/useLocalStorageState";

import Loader from "./components/common/Loader";
import ErrorMessage from "./components/common/ErrorMessage";
import NavBar from "./components/common/NavBar";
import NumResults from "./components/common/NumResults";
import Search from "./components/common/Search";
import Main from "./components/Main";
import ListBox from "./components/ListBox";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";
import WatchedBox from "./components/WatchedBox";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMovieList from "./components/WatchedMovieList";

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
