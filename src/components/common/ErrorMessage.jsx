import PropTypes from "prop-types";

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default function ErrorMessage({message}) {
  return (
    <div className='error'>
      <span>⛔</span> <p>{message}</p>
    </div>
  );
}
