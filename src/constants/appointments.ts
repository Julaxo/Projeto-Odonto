import { type Appointment } from '@/types/appointment';

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-001',
    patientName: 'Carla Mendes',
    procedure: 'Avaliacao inicial',
    startsAt: '2026-06-11T09:00:00-03:00',
    status: 'confirmed',
  },
  {
    id: 'appt-002',
    patientName: 'Rafael Costa',
    procedure: 'Profilaxia',
    startsAt: '2026-06-11T10:30:00-03:00',
    status: 'pending',
  },
  {
    id: 'appt-003',
    patientName: 'Juliana Rocha',
    procedure: 'Clareamento',
    startsAt: '2026-06-11T14:00:00-03:00',
    status: 'confirmed',
  },
];
