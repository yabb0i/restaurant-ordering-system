import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order, Reservation, MenuItem } from '../../types';
import { orderApi, reservationApi, menuApi } from '../../services/api';
import { Card } from '../../components/common';

export function ManagerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, reservationsData, menuData] = await Promise.all([
          orderApi.getAll(),
          reservationApi.getAll(),
          menuApi.getAll(),
        ]);
        setOrders(ordersData);
        setReservations(reservationsData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;

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
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Business overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md-grid-cols-4 gap-6 mb-8">
        <Card className="p-6 stat-card">
          <p className="stat-value text-secondary">${totalRevenue.toFixed(2)}</p>
          <p className="stat-label">Total Revenue</p>
        </Card>
        <Card className="p-6 stat-card">
          <p className="stat-value text-blue-600">{orders.length}</p>
          <p className="stat-label">Total Orders</p>
        </Card>
        <Card className="p-6 stat-card">
          <p className="stat-value text-primary">{activeReservations}</p>
          <p className="stat-label">Active Reservations</p>
        </Card>
        <Card className="p-6 stat-card">
          <p className="stat-value text-purple-600">{menuItems.length}</p>
          <p className="stat-label">Menu Items</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md-grid-cols-2 gap-6 mb-8">
        <Link to="/manager/menu">
          <Card className="p-6" hover>
            <div className="flex items-center gap-4">
              <div className="feature-icon bg-purple-100" style={{ margin: 0, width: '3rem', height: '3rem' }}>
                <svg className="icon-md text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Menu Management</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove menu items</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/staff">
          <Card className="p-6" hover>
            <div className="flex items-center gap-4">
              <div className="feature-icon bg-orange-100" style={{ margin: 0, width: '3rem', height: '3rem' }}>
                <svg className="icon-md text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Staff Dashboard</h3>
                <p className="text-sm text-gray-600">Access staff operations</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 md-grid-cols-2 gap-8">
        <Card>
          <div className="card-header">
            <h2 className="text-xl font-semibold">Popular Menu Items</h2>
          </div>
          <div className="divide-y">
            {menuItems.slice(0, 5).map(item => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">${item.price.toFixed(2)}</p>
                  <span className={`text-xs ${item.available ? 'text-secondary' : 'text-danger'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-secondary">${order.total.toFixed(2)}</p>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
