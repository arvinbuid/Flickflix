import PropTypes from "prop-types";
import {useState} from "react";

WatchedBox.propTypes = {
  children: PropTypes.node,
};

export default function WatchedBox({children}) {
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
