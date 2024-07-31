import PropTypes from "prop-types";
import Logo from "./Logo";

NavBar.propTypes = {
  children: PropTypes.node,
};

export default function NavBar({children}) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}
