import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">
              <span className="text-orange-500">Bistro</span>Delight
            </h3>
            <p className="footer-text">
              Experience the finest dining with our carefully crafted menu and exceptional service.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/menu" className="footer-link">Menu</Link></li>
              <li><Link to="/reservation" className="footer-link">Reservations</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Hours</h4>
            <ul className="space-y-2 footer-text">
              <li>Mon - Fri: 11am - 10pm</li>
              <li>Sat - Sun: 10am - 11pm</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contact</h4>
            <ul className="space-y-2 footer-text">
              <li>123 Restaurant Street</li>
              <li>City, State 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@bistrodelight.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BistroDelight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
