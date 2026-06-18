import { ConfiguracoesAgenda } from "@/types/configuracoes-agenda";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

class ConfiguracoesAgendaService {
  private getCollectionRef() {
    return collection(db, "configuracoes_agenda");
  }

  /**
   * Obtém as configurações da agenda pelo ID (ex: 'padrao' ou UID do dentista).
   * @param {string} id
   */
  async obterConfiguracoes(): Promise<ConfiguracoesAgenda> {
    try {
      const docRef = doc(this.getCollectionRef(), "3PoWZXL3klp9mwuUQMSj");
      const docSnap = await getDoc(docRef);

      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as ConfiguracoesAgenda;
    } catch (error) {
      console.error("Erro ao obter configurações:", error);
      throw error;
    }
  }
}

// Exportamos uma instância única (Singleton) para ser usada em todo o app
export const configuracoesAgendaService = new ConfiguracoesAgendaService();
