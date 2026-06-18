/**
 * Tipos do fluxo do dentista (confirmação de agendamentos solicitados pelos
 * pacientes).
 *
 * NOTE sobre perfil de usuário: `FirebaseAuthUser` (em
 * `firebase-auth.service.ts`) é só `{ email, id, name }` — não existe um
 * campo de "role" (paciente/dentista) no usuário autenticado. A escolha
 * de perfil na tela de login é tratada como uma decisão de navegação local
 * (ver `sign-in-form.REFERENCE.tsx`), não como um dado persistido aqui.
 * Se um dia isso precisar ser persistido de fato, o tipo abaixo pode voltar
 * a ser útil associado a algum armazenamento externo ao Firebase Auth
 * (ex: Firestore por uid).
 */

export type AppointmentStatus = "pending" | "confirmed" | "declined";

export interface PatientSummary {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface DentistAppointment {
  id: string;
  patient: PatientSummary;
  procedure: string;
  description: string;
  date: string; // ISO date, ex: "2026-10-16"
  startTime: string; // "14:00"
  endTime: string; // "15:30"
  room?: string;
  status: AppointmentStatus;
  requestedAt: string; // ISO datetime
}

export interface DentistHomeSummary {
  dentistName: string;
  pendingCount: number;
  nextAppointment?: DentistAppointment;
}
