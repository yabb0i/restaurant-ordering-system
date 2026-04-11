import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reservation } from '../../types';
import { reservationApi } from '../../services/api';
import { Button, Card } from '../../components/common';

export function ModifyReservationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: '2',
    specialRequests: '',
  });

  useEffect(() => {
    const loadReservation = async () => {
      if (!id) return;
      try {
        const res = await reservationApi.getById(id);
        if (res) {
          setReservation(res);
          setFormData({
            date: res.date,
            time: res.time,
            partySize: String(res.partySize),
            specialRequests: res.specialRequests || '',
          });
        }
      } catch (error) {
        console.error('Failed to load reservation:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReservation();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!id || !reservation) return;

  setSaving(true);
  try {
  const reservationDateTime = `${formData.date}T${formData.time}:00`;// cmobines seperate data ad time fields into a sigle ISO string. DateTime field

  await reservationApi.update(id, {
  customerName: reservation.customerName,
  customerPhone: reservation.customerPhone,
  partySize: parseInt(formData.partySize),
  reservationTime: reservationDateTime,
  status: reservation.status,
  } as any);

    navigate(`/reservation/confirmation/${id}`);
  } catch (error) {
    console.error('Failed to update reservation:', error);
    alert('Failed to update reservation. Please try again.');
  } finally {
    setSaving(false);
  }
};

  const handleCancel = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    setSaving(true);
    try {
      await reservationApi.cancel(id);
      navigate('/');
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const timeSlots = [];
  for (let hour = 11; hour <= 21; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

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
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  if (reservation.status === 'cancelled') {
    return (
      <div className="container empty-state">
        <h2 className="empty-state-title">Reservation Cancelled</h2>
        <p className="empty-state-text">This reservation has been cancelled.</p>
        <Button onClick={() => navigate('/reservation')}>Make New Reservation</Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modify Reservation</h1>
        <p className="text-gray-600">Update your reservation details</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600"><strong>Name:</strong> {reservation.customerName}</p>
          <p className="text-sm text-gray-600"><strong>Email:</strong> {reservation.customerEmail}</p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>{' '}
            <span className={`badge ${reservation.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'}`}>
              {reservation.status}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
            <div>
              <label className="input-label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="input"
              />
            </div>

            <div>
              <label className="input-label">Time</label>
              <select name="time" value={formData.time} onChange={handleChange} className="select">
                {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
              </select>
            </div>

            <div>
              <label className="input-label">Party Size</label>
              <select name="partySize" value={formData.partySize} onChange={handleChange} className="select">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                  <option key={size} value={size}>{size} {size === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              className="textarea"
              placeholder="Any dietary restrictions, special occasions, etc."
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="danger" onClick={handleCancel} disabled={saving}>
              Cancel Reservation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
