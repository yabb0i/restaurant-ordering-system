import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../../types';
import { orderApi } from '../../services/api';
import { Button, Card } from '../../components/common';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      try {
        const result = await orderApi.getById(id);
        setOrder(result || null);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-8 max-w-2xl">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container empty-state">
        <h2 className="empty-state-title">Order Not Found</h2>
        <p className="empty-state-text">We couldn't find the order you're looking for.</p>
        <Link to="/"><Button>Go Home</Button></Link>
      </div>
    );
  }

  const statusClass = `badge badge-${order.status}`;

  return (
    <div className="container py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="success-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your order, {order.customerName}!</p>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-xl font-bold">#{order.id}</p>
            </div>
            <span className={statusClass}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>

          {order.tableNumber && (
            <p className="text-sm text-gray-600 mb-4"><strong>Table:</strong> {order.tableNumber}</p>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{menuItem.name}</p>
                    <p className="text-sm text-gray-500">Qty: {quantity}</p>
                  </div>
                  <p className="font-medium">${(menuItem.price * quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-gray-600">Your order is being prepared. We'll have it ready for you soon!</p>
        <div className="flex justify-center gap-4">
          <Link to="/menu"><Button variant="outline">Order More</Button></Link>
          <Link to="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    </div>
  );
}
