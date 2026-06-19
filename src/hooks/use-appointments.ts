import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createAppointment,
  getAppointmentById,
  getAppointmentsByDay,
  listDentistAppointments,
  listAppointments,
  listPatientAppointments,
} from '@/services/appointments.service';
import { type AgendamentoInput } from '@/types/appointment';

export const appointmentQueryKeys = {
  all: ['appointments'] as const,
  byDay: (date: string) => [...appointmentQueryKeys.all, 'day', date] as const,
  byDentist: () => [...appointmentQueryKeys.all, 'dentist'] as const,
  byPatient: (patientId: string) => [...appointmentQueryKeys.all, 'patient', patientId] as const,
  detail: (appointmentId: string) => [...appointmentQueryKeys.all, 'detail', appointmentId] as const,
  lists: () => [...appointmentQueryKeys.all, 'list'] as const,
};

export function useAppointments() {
  return useQuery({
    queryFn: listAppointments,
    queryKey: appointmentQueryKeys.lists(),
  });
}

export function useAppointmentsByDay(date: string) {
  return useQuery({
    enabled: Boolean(date),
    queryFn: () => getAppointmentsByDay(date),
    queryKey: appointmentQueryKeys.byDay(date),
  });
}

export function useAppointment(appointmentId: string | undefined) {
  return useQuery({
    enabled: Boolean(appointmentId),
    queryFn: () => getAppointmentById(appointmentId ?? ''),
    queryKey: appointmentQueryKeys.detail(appointmentId ?? ''),
  });
}

export function usePatientAppointments(patientId: string | undefined) {
  return useQuery({
    enabled: Boolean(patientId),
    queryFn: () => listPatientAppointments(patientId ?? ''),
    queryKey: appointmentQueryKeys.byPatient(patientId ?? ''),
  });
}

export function useDentistAppointments() {
  return useQuery({
    queryFn: listDentistAppointments,
    queryKey: appointmentQueryKeys.byDentist(),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AgendamentoInput) => createAppointment(input),
    onSuccess: async (_appointmentId, input) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.byDay(input.dataAgendamento) }),
        queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.byPatient(input.clienteId) }),
      ]);
    },
  });
}
