import { api } from '@/services/api';
import { type Appointment } from '@/types/appointment';

export async function listAppointments() {
  const response = await api.get<Appointment[]>('/appointments');

  return response.data;
}
