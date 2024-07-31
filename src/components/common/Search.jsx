import {useRef} from "react";
import {useKey} from "../../hooks/useKey";
import PropTypes from "prop-types";

Search.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
};

export default function Search({query, setQuery}) {
  const inputRef = useRef(null);

  // useKey custom hook
  useKey("Enter", function () {
    if (document.activeElement === inputRef.current) return;
    inputRef.current.focus();
    setQuery("");
  });

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
