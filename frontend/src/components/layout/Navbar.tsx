import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../common';

export function Navbar() {
  const { user, logout, isStaff, isManager } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex items-center">
          <Link to="/" className="navbar-brand">
            <span className="text-primary">Bistro</span>
            <span className="font-light text-gray-700">Delight</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/menu" className="navbar-link">Menu</Link>
          <Link to="/reservation" className="navbar-link">Reservations</Link>
          {isStaff && (
            <Link to="/staff" className="navbar-link">Staff Dashboard</Link>
          )}
          {isManager && (
            <Link to="/manager" className="navbar-link">Manager Dashboard</Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="navbar-link relative">
            <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hi, {user.name.split(' ')[0]}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="navbar-mobile">
        <Link to="/menu" className="navbar-mobile-link">Menu</Link>
        <Link to="/reservation" className="navbar-mobile-link">Reservations</Link>
        {isStaff && <Link to="/staff" className="navbar-mobile-link">Staff Dashboard</Link>}
        {isManager && <Link to="/manager" className="navbar-mobile-link">Manager Dashboard</Link>}
      </div>
    </nav>
  );
}
