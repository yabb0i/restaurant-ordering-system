import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/common';
import { reservationApi } from '../../services/api';

export function ReservationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    partySize: '2',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone number is required';
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.date = 'Date cannot be in the past';
    }
    if (!formData.time) newErrors.time = 'Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const reservation = await reservationApi.create({
        userId: 'guest',
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        date: formData.date,
        time: formData.time,
        partySize: parseInt(formData.partySize),
        specialRequests: formData.specialRequests,
      });
      navigate(`/reservation/confirmation/${reservation.id}`);
    } catch (error) {
      console.error('Failed to create reservation:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [];
  for (let hour = 11; hour <= 21; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Reservation</h1>
        <p className="text-gray-600">Book your table for a memorable dining experience</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              error={errors.customerName}
              placeholder="John Doe"
            />
            <Input
              label="Email"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
              error={errors.customerEmail}
              placeholder="john@example.com"
            />
          </div>

          <Input
            label="Phone Number"
            name="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={handleChange}
            error={errors.customerPhone}
            placeholder="(555) 123-4567"
          />

          <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
            <div>
              <label className="input-label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`input ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && <p className="input-error-text">{errors.date}</p>}
            </div>

            <div>
              <label className="input-label">Time</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`select ${errors.time ? 'input-error' : ''}`}
              >
                <option value="">Select time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {errors.time && <p className="input-error-text">{errors.time}</p>}
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
            <label className="input-label">Special Requests (optional)</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              className="textarea"
              placeholder="Any dietary restrictions, special occasions, etc."
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Booking...' : 'Book Reservation'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
