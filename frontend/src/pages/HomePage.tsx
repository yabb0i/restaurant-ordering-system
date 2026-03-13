import { Link } from 'react-router-dom';
import { Button } from '../components/common';

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920)' }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="text-orange-500">Bistro</span>Delight
            </h1>
            <p className="hero-subtitle">
              Experience exceptional dining with our carefully crafted menu, featuring the finest ingredients and culinary expertise.
            </p>
            <div className="hero-actions">
              <Link to="/menu">
                <Button size="lg">View Menu</Button>
              </Link>
              <Link to="/reservation">
                <Button variant="outline" size="lg" className="btn-outline-white">
                  Make a Reservation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="feature-icon bg-orange-100">
                <svg className="icon-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We source only the freshest, highest-quality ingredients for our dishes.</p>
            </div>

            <div className="text-center p-6">
              <div className="feature-icon bg-orange-100">
                <svg className="icon-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Chefs</h3>
              <p className="text-gray-600">Our talented chefs bring years of experience and passion to every dish.</p>
            </div>

            <div className="text-center p-6">
              <div className="feature-icon bg-orange-100">
                <svg className="icon-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Reservations</h3>
              <p className="text-gray-600">Book your table online in seconds and enjoy a seamless dining experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Order?</h2>
          <p className="cta-text">Browse our menu and place your order for dine-in or takeout.</p>
          <Link to="/menu">
            <Button variant="outline" size="lg" className="btn-outline-white">Order Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
