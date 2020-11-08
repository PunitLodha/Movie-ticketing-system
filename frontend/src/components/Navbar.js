import React, { useState } from 'react';
import { MenuItems } from './MenuItems';
import { Button } from './Button';
import './Navbar.css';
import { Link, useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { LogContext } from './LogContext';

const Navbar = () => {
  const { loggedIn, handleLogIn } = useContext(LogContext);
  const [clicked, setClicked] = useState(false);

  const history = useHistory();

  const handleClick = () => {
    setClicked((prevState) => !prevState);
  };

  const handleLogin = () => {
    if (loggedIn) {
      localStorage.clear();
      handleLogIn();
      history.push('/');
    } else {
      history.push('/login');
    }
  };

  const handleLogo = () => {
    history.push('/');
  };

  return (
    <nav className="navbarItems">
      <h1 className="navbar-logo" onClick={handleLogo}>
        Movie <i className="fab fa-react"></i>
      </h1>
      <div className="menu-icon" onClick={handleClick}>
        <i className={clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>
      <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
        {MenuItems.map((item, index) => {
          return (
            <li key={index}>
              <Link className={item.cName} to={item.url}>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <Button onClick={handleLogin}>{loggedIn ? 'Logout' : 'Login'}</Button>
    </nav>
  );
};

export default Navbar;
