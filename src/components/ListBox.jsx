import {useState} from "react";
import PropTypes from "prop-types";

ListBox.propTypes = {
  children: PropTypes.node,
};

export default function ListBox({children}) {
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
