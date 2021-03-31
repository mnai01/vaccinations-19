import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fa fa-globe' aria-hidden='true'></i> vaccine-19
        </Link>
      </h1>
      <ul>
        <li>
          <a href='https://github.com/mnai01'>Ian</a>
        </li>
        <li></li>
      </ul>
    </nav>
  );
};
export default Navbar;
