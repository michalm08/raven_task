import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';

const Navigation = () => {
  const location = useLocation();
  return (
    <div className="navigation">
      <div
        className={`navigation__element ${
          location.pathname === '/management'
            ? 'navigation__element--active'
            : ''
        }`}
      >
        <Link to="/management">Parking areas</Link>
      </div>
      <div
        className={`navigation__element ${
          location.pathname === '/payment' ? 'navigation__element--active' : ''
        }`}
      >
        <Link to="/payment">Payment</Link>
      </div>
    </div>
  );
};

export default Navigation;
