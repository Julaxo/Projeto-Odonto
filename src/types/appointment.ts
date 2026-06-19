export type AgendamentoStatus = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';

export type AppointmentStatus = 'cancelled' | 'completed' | 'confirmed' | 'pending';

export interface AgendamentoInput {
  clienteId: string;
  clienteNome?: string;
  dataAgendamento: string;
  duracaoMinutos: number;
  horarioFim: string;
  horarioInicio: string;
  observacoes?: string;
  procedimento: string;
  profissionalId: string;
  profissionalNome?: string;
}

export interface AgendamentoData extends AgendamentoInput {
  criadoEm: string;
  id: string;
  status: AgendamentoStatus;
  ultimaAtualizacao: string;
}

export type Appointment = {
  dentistName?: string;
  endsAt?: string;
  id: string;
  patientName: string;
  procedure: string;
  startsAt: string;
  status: AppointmentStatus;
};
