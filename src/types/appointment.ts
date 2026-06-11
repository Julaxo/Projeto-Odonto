export type AppointmentStatus = 'confirmed' | 'pending' | 'completed';

export type Appointment = {
  id: string;
  patientName: string;
  procedure: string;
  startsAt: string;
  status: AppointmentStatus;
};
