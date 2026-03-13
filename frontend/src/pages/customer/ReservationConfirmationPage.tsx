import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Reservation } from '../../types';
import { reservationApi } from '../../services/api';
import { Button, Card } from '../../components/common';

export function ReservationConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservation = async () => {
      if (!id) return;
      try {
        const result = await reservationApi.getById(id);
        setReservation(result || null);
      } catch (error) {
        console.error('Failed to load reservation:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReservation();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-8 max-w-2xl">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container empty-state">
        <h2 className="empty-state-title">Reservation Not Found</h2>
        <p className="empty-state-text">We couldn't find the reservation you're looking for.</p>
        <Link to="/"><Button>Go Home</Button></Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusClass = `badge badge-${reservation.status}`;

  return (
    <div className="container py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="success-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reservation {reservation.status === 'pending' ? 'Received' : 'Confirmed'}!
        </h1>
        <p className="text-gray-600">Thank you for booking with us, {reservation.customerName}!</p>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Confirmation Number</p>
              <p className="text-xl font-bold">#{reservation.id}</p>
            </div>
            <span className={statusClass}>
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formatDate(reservation.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{reservation.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Party Size</p>
              <p className="font-medium">{reservation.partySize} {reservation.partySize === 1 ? 'Guest' : 'Guests'}</p>
            </div>
            {reservation.tableId && (
              <div>
                <p className="text-sm text-gray-500">Table</p>
                <p className="font-medium">Table #{reservation.tableId}</p>
              </div>
            )}
          </div>

          {reservation.specialRequests && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Special Requests</p>
              <p className="font-medium">{reservation.specialRequests}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">Contact Information</p>
            <p className="font-medium">{reservation.customerEmail}</p>
            <p className="font-medium">{reservation.customerPhone}</p>
          </div>
        </div>
      </Card>

      <div className="text-center space-y-4">
        {reservation.status === 'pending' && (
          <p className="text-gray-600">Your reservation is being reviewed. You'll receive a confirmation email shortly.</p>
        )}
        <div className="flex justify-center gap-4">
          <Link to={`/reservation/modify/${reservation.id}`}>
            <Button variant="outline">Modify Reservation</Button>
          </Link>
          <Link to="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    </div>
  );
}
