import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'globalhotel-backend' });
});

app.get('/api/overview', (_req, res) => {
  res.json({
    hotel: 'GlobalHotel',
    modules: ['booking', 'qr-dining', 'dashboards', 'payments', 'multilingual'],
  });
});

app.get('/api/dashboard', (_req, res) => {
  res.json({
    stats: [
      { title: 'Reservations', value: '184', change: '+12% this month' },
      { title: 'Dining Orders', value: '32', change: '8 pending prep' },
      { title: 'Guests', value: '1,208', change: '+96 checked in' },
      { title: 'Staff Tasks', value: '19', change: '4 high priority' },
    ],
    roles: [
      {
        id: 'admin',
        label: 'Admin view',
        summary: 'Manage rooms, dining, payments, and occupancy in one place.',
      },
      {
        id: 'staff',
        label: 'Staff view',
        summary: 'Coordinate arrivals, housekeeping, and restaurant service.',
      },
      {
        id: 'guest',
        label: 'Guest view',
        summary: 'Track bookings, invoices, dining orders, and profile updates.',
      },
    ],
    analytics: [
      { label: 'Occupancy', value: '92%', delta: '+6%' },
      { label: 'Revenue', value: '$84k', delta: '+14%' },
      { label: 'QR Orders', value: '1,240', delta: '+23%' },
      { label: 'Check-ins', value: '318', delta: '+9%' },
    ],
  });
});

app.listen(4000, '0.0.0.0', () => {
  console.log('GlobalHotel backend listening on port 4000');
});
