import { useState, useEffect } from 'react';
import { Reservation } from '../../types';
import { reservationApi } from '../../services/api';
import { Card, Button } from '../../components/common';

export function ReservationListPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationApi.getAll();
      setReservations(data);
    } catch (error) {
      console.error('Failed to load reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      const updated = await reservationApi.confirm(id);
      setReservations(prev => prev.map(r => (r.id === id ? updated : r)));
    } catch (error) {
      console.error('Failed to confirm reservation:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const updated = await reservationApi.cancel(id);
      setReservations(prev => prev.map(r => (r.id === id ? updated : r)));
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    }
  };

  const filteredReservations = reservations.filter(r => filter === 'all' || r.status === filter);

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
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-600 mt-1">Manage all reservations</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`category-pill capitalize ${filter === status ? 'category-pill-active' : 'category-pill-inactive'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Party Size</th>
                <th>Table</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>
                    <p className="font-medium text-gray-900">{reservation.customerName}</p>
                    <p className="text-sm text-gray-500">{reservation.customerEmail}</p>
                    <p className="text-sm text-gray-500">{reservation.customerPhone}</p>
                  </td>
                  <td>
                    <p className="text-gray-900">{reservation.date}</p>
                    <p className="text-sm text-gray-500">{reservation.time}</p>
                  </td>
                  <td>{reservation.partySize} guests</td>
                  <td>{reservation.tableId ? `Table ${reservation.tableId}` : '-'}</td>
                  <td><span className={`badge badge-${reservation.status}`}>{reservation.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => handleConfirm(reservation.id)}>Confirm</Button>
                          <Button size="sm" variant="danger" onClick={() => handleCancel(reservation.id)}>Cancel</Button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <Button size="sm" variant="danger" onClick={() => handleCancel(reservation.id)}>Cancel</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReservations.length === 0 && (
          <div className="p-8 text-center text-gray-500">No reservations found</div>
        )}
      </Card>
    </div>
  );
}
