import { Link } from 'react-router-dom';
import { Button } from '../components/common';

export function NotFoundPage() {
  return (
    <div className="auth-container">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/"><Button variant="primary">Go Home</Button></Link>
          <Link to="/menu"><Button variant="outline">View Menu</Button></Link>
        </div>
      </div>
    </div>
  );
}
