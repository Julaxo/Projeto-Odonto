import { BloqueioAgenda } from "@/types/bloqueio-agenda";
import { collection, getDocs, or, query, where } from "firebase/firestore";
import { db } from "./firebase";

export class BloqueioAgendaService {
  private getCollectionRef() {
    return collection(db, "bloqueios_agenda");
  }

  /**
   * Busca os bloqueios de uma data específica e sempre inclui os que possuem 'dataBloqueio' como null.
   * @param dataBloqueio Data a ser filtrada (geralmente em formato string "YYYY-MM-DD" ou null)
   */
  public async obterPorData(
    dataBloqueio: string | null,
  ): Promise<BloqueioAgenda[]> {
    // Usamos o operador lógico 'or' para trazer a data específica OU registros nulos
    const q = query(
      this.getCollectionRef(),
      or(
        where("dataBloqueio", "==", dataBloqueio),
        where("dataBloqueio", "==", null),
      ),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BloqueioAgenda[];
  }
}
