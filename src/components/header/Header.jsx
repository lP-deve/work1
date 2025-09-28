import React from 'react';
import './Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const handleClick = () => {
    if (isLoginPage) {
      navigate('/register');
    } else if (isRegisterPage) {
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <header>
      <div className="logo">
        <img src="HandEye.svg" alt="logo" />
        <p>RedSeam Clothing</p>
      </div>
      <div className="logIn" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src="user.svg" alt="userIcon" />
        <p>{isLoginPage ? 'Register' : 'Log in'}</p>
      </div>
    </header>
  );
};

export default Header;
