import {useEffect} from "react";

export function useKey(key, action) {
  // Listen to escape keypress
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener("keydown", callback);

    () => document.removeEventListener("keydown", callback); // clean up
  }, [key, action]);

  return {key, action};
}
