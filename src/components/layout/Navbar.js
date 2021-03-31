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
          <Link to={{ pathname: 'https://github.com/mnai01' }}>Ian</Link>
        </li>
        <li>
          <Link to='/test'>Test</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
