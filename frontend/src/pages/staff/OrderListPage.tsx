import { useState, useEffect } from 'react';
import { Order } from '../../types';
import { orderApi } from '../../services/api';
import { Card, Button } from '../../components/common';

export function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      const updated = await orderApi.updateStatus(id, status);
      setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const nextStatus: Record<Order['status'], Order['status'] | null> = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'completed',
    completed: null,
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage all orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'pending', 'preparing', 'ready', 'completed'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`category-pill capitalize ${filter === status ? 'category-pill-active' : 'category-pill-inactive'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders grid */}
      <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <Card key={order.id} className="flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">Order #{order.id}</p>
                {order.tableNumber && <p className="text-sm text-gray-600">Table {order.tableNumber}</p>}
              </div>
              <span className={`badge badge-${order.status}`}>{order.status}</span>
            </div>

            <div className="p-4 flex-1">
              <p className="font-medium mb-2">{order.customerName}</p>
              <div className="space-y-2">
                {order.items.map(({ menuItem, quantity }) => (
                  <div key={menuItem.id} className="flex justify-between text-sm">
                    <span>{quantity}x {menuItem.name}</span>
                    <span className="text-gray-600">${(menuItem.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {nextStatus[order.status] && (
              <div className="p-4 bg-gray-50 border-t">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleUpdateStatus(order.id, nextStatus[order.status]!)}
                >
                  Mark as {nextStatus[order.status]}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      )}
    </div>
  );
}
