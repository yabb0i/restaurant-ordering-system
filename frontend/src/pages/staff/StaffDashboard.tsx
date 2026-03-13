import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reservation, Order } from '../../types';
import { reservationApi, orderApi } from '../../services/api';
import { Card, Button } from '../../components/common';

export function StaffDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [res, ord] = await Promise.all([reservationApi.getAll(), orderApi.getAll()]);
        setReservations(res);
        setOrders(ord);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
  const activeOrders = orders.filter(o => o.status !== 'completed');

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
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of today's operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md-grid-cols-4 gap-6 mb-8">
        <Card className="p-6 stat-card">
          <p className="stat-value text-primary">{pendingReservations.length}</p>
          <p className="stat-label">Pending Reservations</p>
        </Card>
        <Card className="p-6 stat-card">
          <p className="stat-value text-secondary">{confirmedReservations.length}</p>
          <p className="stat-label">Confirmed Reservations</p>
        </Card>
        <Card className="p-6 stat-card">
          <p className="stat-value text-blue-600">{activeOrders.length}</p>
          <p className="stat-label">Active Orders</p>
        </Card>
        <Card className="p-6 stat-card">
          <p className="stat-value text-gray-600">{orders.filter(o => o.status === 'completed').length}</p>
          <p className="stat-label">Completed Orders</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md-grid-cols-3 gap-6 mb-8">
        <Link to="/staff/reservations">
          <Card className="p-6" hover>
            <div className="flex items-center gap-4">
              <div className="feature-icon bg-orange-100" style={{ margin: 0, width: '3rem', height: '3rem' }}>
                <svg className="icon-md text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reservations</h3>
                <p className="text-sm text-gray-600">Manage reservations</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/staff/orders">
          <Card className="p-6" hover>
            <div className="flex items-center gap-4">
              <div className="feature-icon bg-blue-100" style={{ margin: 0, width: '3rem', height: '3rem' }}>
                <svg className="icon-md text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-600">View & update orders</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/staff/tables">
          <Card className="p-6" hover>
            <div className="flex items-center gap-4">
              <div className="feature-icon bg-green-100" style={{ margin: 0, width: '3rem', height: '3rem' }}>
                <svg className="icon-md text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tables</h3>
                <p className="text-sm text-gray-600">Assign tables</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md-grid-cols-2 gap-8">
        <Card>
          <div className="card-header">
            <h2 className="text-xl font-semibold">Pending Reservations</h2>
          </div>
          <div className="divide-y">
            {pendingReservations.slice(0, 5).map(res => (
              <div key={res.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{res.customerName}</p>
                  <p className="text-sm text-gray-600">{res.date} at {res.time} - {res.partySize} guests</p>
                </div>
                <Link to="/staff/reservations"><Button size="sm" variant="outline">View</Button></Link>
              </div>
            ))}
            {pendingReservations.length === 0 && (
              <div className="p-6 text-center text-gray-500">No pending reservations</div>
            )}
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <h2 className="text-xl font-semibold">Active Orders</h2>
          </div>
          <div className="divide-y">
            {activeOrders.slice(0, 5).map(order => (
              <div key={order.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customerName} - ${order.total.toFixed(2)}</p>
                </div>
                <span className={`badge badge-${order.status}`}>{order.status}</span>
              </div>
            ))}
            {activeOrders.length === 0 && (
              <div className="p-6 text-center text-gray-500">No active orders</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
