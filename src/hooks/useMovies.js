import {useEffect, useState} from "react";

const KEY = "96cadb79";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
          signal: controller.signal,
        });

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found."); // movie not found

        setMovies(data.Search);
        setError("");
      } catch (err) {
        // disconnected
        err.message === "Failed to fetch" &&
          setError("Something went wrong fetching search results.");

        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return {movies, isLoading, error};
}
