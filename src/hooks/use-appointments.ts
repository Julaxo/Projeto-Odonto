import { useQuery } from '@tanstack/react-query';

import { listAppointments } from '@/services/appointments.service';

export function useAppointments() {
  return useQuery({
    queryFn: listAppointments,
    queryKey: ['appointments'],
  });
}
