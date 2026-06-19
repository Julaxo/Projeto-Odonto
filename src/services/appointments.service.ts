import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import {
  type AgendamentoData,
  type AgendamentoInput,
  type AgendamentoStatus,
  type Appointment,
  type AppointmentStatus,
} from "@/types/appointment";

import { db } from "./firebase";

type FirestoreAgendamento = Partial<AgendamentoData> & {
  horaInicio?: string;
};

const APPOINTMENTS_COLLECTION = "agendamentos";
const ACTIVE_STATUSES: AgendamentoStatus[] = ["PENDENTE", "CONFIRMADO"];

function mapStatus(status?: AgendamentoStatus): AppointmentStatus {
  if (status === "CONFIRMADO") {
    return "confirmed";
  }

  if (status === "CANCELADO") {
    return "cancelled";
  }

  return "pending";
}

function combineDateTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

function mapSnapshot(
  snapshot:
    | DocumentSnapshot<DocumentData>
    | QueryDocumentSnapshot<DocumentData>,
): AgendamentoData {
  const data = snapshot.data() as FirestoreAgendamento;
  const horarioInicio = data.horarioInicio ?? data.horaInicio ?? "";

  return {
    clienteId: data.clienteId ?? "",
    clienteNome: data.clienteNome,
    criadoEm: data.criadoEm ?? "",
    dataAgendamento: data.dataAgendamento ?? "",
    duracaoMinutos: data.duracaoMinutos ?? 30,
    horarioFim: data.horarioFim ?? "",
    horarioInicio,
    id: snapshot.id,
    observacoes: data.observacoes,
    procedimento: data.procedimento ?? "Atendimento odontologico",
    profissionalId: data.profissionalId ?? "",
    profissionalNome: data.profissionalNome,
    status: data.status ?? "PENDENTE",
    ultimaAtualizacao: data.ultimaAtualizacao ?? "",
  };
}

function toAppointment(agendamento: AgendamentoData): Appointment {
  return {
    dentistName: agendamento.profissionalNome,
    endsAt: combineDateTime(
      agendamento.dataAgendamento,
      agendamento.horarioFim,
    ),
    id: agendamento.id,
    patientName: agendamento.clienteNome ?? "Paciente",
    procedure: agendamento.procedimento,
    startsAt: combineDateTime(
      agendamento.dataAgendamento,
      agendamento.horarioInicio,
    ),
    status: mapStatus(agendamento.status),
  };
}

function sortByDateTime(a: AgendamentoData, b: AgendamentoData) {
  return `${a.dataAgendamento}T${a.horarioInicio}`.localeCompare(
    `${b.dataAgendamento}T${b.horarioInicio}`,
  );
}

class AppointmentService {
  private getCollectionRef() {
    return collection(db, APPOINTMENTS_COLLECTION);
  }

  private stringParaMinutos(horario: string): number {
    const [horas, minutos] = horario.split(":").map(Number);
    return horas * 60 + minutos;
  }

  private minutosParaString(totalMinutos: number): string {
    const minutosDoDia = totalMinutos % (24 * 60);
    const horas = Math.floor(minutosDoDia / 60);
    const minutos = minutosDoDia % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }

  async solicitarAgendamento(dados: AgendamentoInput): Promise<string> {
    const agora = new Date().toISOString();
    const novoAgendamento: Omit<AgendamentoData, "id"> = {
      ...dados,
      criadoEm: agora,
      status: "PENDENTE",
      ultimaAtualizacao: agora,
    };

    const docRef = await addDoc(this.getCollectionRef(), novoAgendamento);
    return docRef.id;
  }

  async listarAgendamentos(): Promise<AgendamentoData[]> {
    const q = query(this.getCollectionRef(), orderBy("dataAgendamento", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapSnapshot).sort(sortByDateTime);
  }

  async buscarAgendamentoPorId(
    agendamentoId: string,
  ): Promise<AgendamentoData | null> {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, agendamentoId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return mapSnapshot(snapshot);
  }

  async buscarAgendamentosPorDia(
    dataAgendamento: string,
  ): Promise<AgendamentoData[]> {
    const q = query(
      this.getCollectionRef(),
      where("dataAgendamento", "==", dataAgendamento),
      where("status", "in", ACTIVE_STATUSES),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapSnapshot).sort(sortByDateTime);
  }

  async buscarAgendamentosPosteriores(
    clienteId: string,
  ): Promise<AgendamentoData[]> {
    const hojeString = new Date().toISOString().split("T")[0];
    const q = query(
      this.getCollectionRef(),
      where("clienteId", "==", clienteId),
      where("dataAgendamento", ">=", hojeString),
      where("status", "in", ACTIVE_STATUSES),
      orderBy("dataAgendamento", "asc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapSnapshot).sort(sortByDateTime);
  }

  async buscarAgendamentosDentista(): Promise<AgendamentoData[]> {
    const q = query(
      this.getCollectionRef(),
      where("status", "in", ACTIVE_STATUSES),
    );

    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(mapSnapshot).sort(sortByDateTime);

    console.log("[Minha agenda dentista] resposta do banco:", appointments);

    return appointments;
  }

  async dentistaConfirmar(
    agendamentoId: string,
    duracaoMinutos: number,
    horarioInicio: string,
  ): Promise<void> {
    const minutosInicio = this.stringParaMinutos(horarioInicio);
    const novoHorarioFim = this.minutosParaString(
      minutosInicio + duracaoMinutos,
    );
    const docRef = doc(db, APPOINTMENTS_COLLECTION, agendamentoId);

    await updateDoc(docRef, {
      duracaoMinutos,
      horarioFim: novoHorarioFim,
      horarioInicio,
      status: "CONFIRMADO",
      ultimaAtualizacao: new Date().toISOString(),
    });
  }

  async cancelarAgendamento(agendamentoId: string): Promise<void> {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, agendamentoId);

    await updateDoc(docRef, {
      status: "CANCELADO",
      ultimaAtualizacao: new Date().toISOString(),
    });
  }
}

export const appointmentService = new AppointmentService();

export async function createAppointment(
  input: AgendamentoInput,
): Promise<string> {
  return appointmentService.solicitarAgendamento(input);
}

export async function getAppointmentsByDay(
  dataAgendamento: string,
): Promise<AgendamentoData[]> {
  return appointmentService.buscarAgendamentosPorDia(dataAgendamento);
}

export async function getAppointmentById(
  appointmentId: string,
): Promise<AgendamentoData | null> {
  return appointmentService.buscarAgendamentoPorId(appointmentId);
}

export async function listPatientAppointments(
  clienteId: string,
): Promise<AgendamentoData[]> {
  return appointmentService.buscarAgendamentosPosteriores(clienteId);
}

export async function listPatientAppointmentsDentist(
  clienteId: string,
): Promise<AgendamentoData[]> {
  void clienteId;

  return appointmentService.buscarAgendamentosDentista();
}

export async function listAppointments(): Promise<Appointment[]> {
  const agendamentos = await appointmentService.listarAgendamentos();
  return agendamentos.map(toAppointment);
}
