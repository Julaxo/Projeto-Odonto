import { AgendamentoData, AgendamentoInput } from "@/types/appointment";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

class AppointmentService {
  private getCollectionRef() {
    return collection(db, "agendamentos");
  }

  /**
   * Auxiliar: Converte string "HH:MM" para minutos inteiros desde o início do dia
   * Formato 24h: 00:00 (meia-noite) até 23:59
   */
  private stringParaMinutos(horario: string): number {
    const [horas, minutos] = horario.split(":").map(Number);
    return horas * 60 + minutos;
  }

  /**
   * Auxiliar: Converte minutos inteiros de volta para uma string "HH:MM"
   * Formato 24h: 00:00 (meia-noite) até 23:59
   * Se ultrapassar 24 horas, faz wrap-around para o dia seguinte
   */
  private minutosParaString(totalMinutos: number): string {
    // Garante que os minutos estejam dentro de 24 horas (1440 minutos)
    const minutosDoDia = totalMinutos % (24 * 60);
    const horas = Math.floor(minutosDoDia / 60);
    const minutos = minutosDoDia % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }

  /**
   * 1. CLIENTE: Solicita um novo agendamento (Status inicial: PENDENTE)
   */
  async solicitarAgendamento(dados: AgendamentoInput): Promise<string> {
    const novoAgendamento = {
      ...dados,
      status: "PENDENTE",
      criadoEm: serverTimestamp(),
      ultimaAtualizacao: serverTimestamp(),
    };

    const docRef = await addDoc(this.getCollectionRef(), novoAgendamento);
    return docRef.id;
  }

  /**
   * 2. AMBOS: Busca os agendamentos de um dia específico (Para renderizar o calendário)
   */
  async buscarAgendamentosPorDia(
    dataAgendamento: string,
  ): Promise<AgendamentoData[]> {
    const q = query(
      this.getCollectionRef(),
      where("dataAgendamento", "==", dataAgendamento),
      where("status", "in", ["PENDENTE", "CONFIRMADO"]),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      docSnapshot =>
        ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }) as AgendamentoData,
    );
  }

  /**
   * 3. DENTISTA: Confirma o agendamento e define o procedimento + tempo real
   */
  async dentistaConfirmar(
    agendamentoId: string,
    duracaoMinutos: number,
    horarioInicio: string,
  ): Promise<void> {
    // Calcula o novo horário de término baseado na duração em minutos
    const minutosInicio = this.stringParaMinutos(horarioInicio);
    const minutosFim = minutosInicio + duracaoMinutos;
    const novoHorarioFim = this.minutosParaString(minutosFim);

    const docRef = doc(db, "agendamentos", agendamentoId);

    await updateDoc(docRef, {
      status: "CONFIRMADO",
      duracaoMinutos,
      horarioFim: novoHorarioFim,
      ultimaAtualizacao: serverTimestamp(),
    });
  }

  /**
   * 6. AMBOS: Cancela ou rejeita o fluxo
   */
  async cancelarAgendamento(agendamentoId: string): Promise<void> {
    const docRef = doc(db, "agendamentos", agendamentoId);

    await updateDoc(docRef, {
      status: "CANCELADO",
      ultimaAtualizacao: serverTimestamp(),
    });
  }
}

export const appointmentService = new AppointmentService();
