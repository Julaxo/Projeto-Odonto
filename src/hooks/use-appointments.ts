import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  confirmDentistAppointment,
  createAppointment,
  getAppointmentById,
  getAppointmentsByDay,
  listAppointments,
  listPatientAppointments,
  listPatientAppointmentsDentist,
} from '@/services/appointments.service';
import { type AgendamentoInput } from '@/types/appointment';

type ConfirmDentistAppointmentInput = {
  appointmentId: string;
  date: string;
  dentistId: string;
  durationMinutes: number;
  startTime: string;
};

export const appointmentQueryKeys = {
  all: ['appointments'] as const,
  byDay: (date: string) => [...appointmentQueryKeys.all, 'day', date] as const,
  byDentist: (dentistId: string) => [...appointmentQueryKeys.all, 'dentist', dentistId] as const,
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

export function useDentistAppointments(dentistId: string | undefined) {
  return useQuery({
    enabled: Boolean(dentistId),
    queryFn: () => listPatientAppointmentsDentist(dentistId ?? ''),
    queryKey: appointmentQueryKeys.byDentist(dentistId ?? ''),
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

export function useConfirmDentistAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      durationMinutes,
      startTime,
    }: ConfirmDentistAppointmentInput) =>
      confirmDentistAppointment({
        appointmentId,
        durationMinutes,
        startTime,
      }),
    onSuccess: async (_result, input) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: appointmentQueryKeys.byDentist(input.dentistId),
        }),
        queryClient.invalidateQueries({
          queryKey: appointmentQueryKeys.byDay(input.date),
        }),
        queryClient.invalidateQueries({
          queryKey: appointmentQueryKeys.detail(input.appointmentId),
        }),
      ]);
    },
  });
}
