export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: "DENTISTA" | "PACIENTE" | "ADMIN";
  criadoEm?: string;
}
