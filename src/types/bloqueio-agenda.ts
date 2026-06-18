/**
 * Bloqueio de horário na agenda
 */
export interface BloqueioAgenda {
  id: string;
  dataBloqueio: string | null; // null para bloqueios recorrentes
  horarioBloqueioInicio: string; // Ex: "12:00"
  horarioBloqueioFim: string; // Ex: "13:00"
}
