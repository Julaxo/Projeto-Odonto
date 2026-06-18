import type { DentistAppointment } from "@/types/dentist";

/**
 * Dados mockados para a visão do dentista.
 * Mesma lógica do restante do projeto: telas atuais usam dados locais,
 * sem chamada de API real ainda (ver README, seção "Data Fetching e API").
 *
 * Quando o backend estiver pronto, isso deve virar um service em
 * `src/services/dentist.service.ts` consumido via TanStack Query, seguindo
 * o mesmo padrão de `appointments.service.ts`.
 */
export const mockDentistAppointments: DentistAppointment[] = [
  {
    id: "apt-1",
    patient: { id: "pat-1", name: "Marina Costa" },
    procedure: "Avaliação Ortodôntica",
    description: "Avaliação ortodôntica inicial, primeira consulta.",
    date: "2026-10-16",
    startTime: "14:00",
    endTime: "15:30",
    room: "Sala 3 - Especialidades",
    status: "pending",
    requestedAt: "2026-10-10T09:00:00.000Z",
  },
  {
    id: "apt-2",
    patient: { id: "pat-2", name: "Joana Rodrigues" },
    procedure: "Restauração",
    description: "Restauração de um dente, região posterior.",
    date: "2026-11-08",
    startTime: "10:45",
    endTime: "11:30",
    room: "Sala 1",
    status: "pending",
    requestedAt: "2026-10-30T13:20:00.000Z",
  },
  {
    id: "apt-3",
    patient: { id: "pat-3", name: "Pedro Almeida" },
    procedure: "Canal",
    description: "Tratamento de canal, segunda sessão.",
    date: "2026-10-20",
    startTime: "16:00",
    endTime: "17:00",
    room: "Sala 2",
    status: "pending",
    requestedAt: "2026-10-12T08:00:00.000Z",
  },
  {
    id: "apt-4",
    patient: { id: "pat-4", name: "Carlos Silva" },
    procedure: "Limpeza e Profilaxia",
    description: "Limpeza de rotina semestral.",
    date: "2026-10-12",
    startTime: "09:30",
    endTime: "10:15",
    room: "Sala 1",
    status: "confirmed",
    requestedAt: "2026-10-01T11:00:00.000Z",
  },
  {
    id: "apt-5",
    patient: { id: "pat-5", name: "Joana Rodrigues" },
    procedure: "Restauração",
    description: "Restauração de um dente.",
    date: "2026-11-08",
    startTime: "10:45",
    endTime: "11:30",
    room: "Sala 1",
    status: "confirmed",
    requestedAt: "2026-10-28T10:00:00.000Z",
  },
];

export function getPendingAppointments(
  appointments: DentistAppointment[] = mockDentistAppointments,
): DentistAppointment[] {
  return appointments.filter((appointment) => appointment.status === "pending");
}

export function getConfirmedAppointments(
  appointments: DentistAppointment[] = mockDentistAppointments,
): DentistAppointment[] {
  return appointments.filter((appointment) => appointment.status === "confirmed");
}

export function getNextAppointment(
  appointments: DentistAppointment[] = mockDentistAppointments,
): DentistAppointment | undefined {
  return getConfirmedAppointments(appointments).sort((a, b) =>
    `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`),
  )[0];
}
