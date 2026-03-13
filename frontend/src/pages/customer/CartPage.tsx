import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button, Card, Input } from '../../components/common';
import { orderApi } from '../../services/api';

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const order = await orderApi.create({
        userId: 'guest',
        customerName,
        items,
        total: totalPrice,
        tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
      });
      clearCart();
      navigate(`/order/confirmation/${order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <div className="mb-6">
          <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="empty-state-title">Your cart is empty</h2>
        <p className="empty-state-text">Add some delicious items from our menu!</p>
        <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg-grid-cols-3 gap-8">
        <div className="lg-col-span-2">
          <Card>
            <div className="divide-y">
              {items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="p-4 flex items-center gap-4">
                  {menuItem.imageUrl && (
                    <img src={menuItem.imageUrl} alt={menuItem.name} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{menuItem.name}</h3>
                    <p className="text-primary font-medium">${menuItem.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="quantity-btn" onClick={() => updateQuantity(menuItem.id, quantity - 1)}>-</button>
                    <span className="quantity-value">{quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(menuItem.id, quantity + 1)}>+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(menuItem.price * quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(menuItem.id)} className="text-danger text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <Input
                label="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
              <Input
                label="Table Number (optional)"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button variant="primary" className="w-full" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
