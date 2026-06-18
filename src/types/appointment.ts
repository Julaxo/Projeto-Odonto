import { Timestamp } from "firebase/firestore";

export type AgendamentoStatus = "PENDENTE" | "CONFIRMADO" | "CANCELADO";

export interface AgendamentoInput {
  clienteId: string;
  profissionalId: string;
  dataAgendamento: string; // Ex: "2026-06-17"
  horaInicio: string; // Ex: "09:00"
  horarioFim: string; // Ex: "09:30"
  duracaoMinutos: number; // Ex: 60
}

export interface AgendamentoData {
  id: string;
  clienteId: string;
  dataAgendamento: string;
  horarioInicio: string;
  horarioFim: string;
  duracaoMinutos: number;
  status: AgendamentoStatus;
  criadoEm: Timestamp;
  ultimaAtualizacao: Timestamp;
}
