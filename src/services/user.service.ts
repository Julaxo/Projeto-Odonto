import { Usuario } from "@/types/users";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export class UsuarioService {
  private getCollectionRef() {
    // Alinhado com a coleção "users" definida nas suas Security Rules do Firestore
    return collection(db, "usuarios");
  }

  /**
   * Cria um novo registro de usuário associando o UID do Firebase Auth diretamente como ID do documento.
   * @param uid ID único gerado pelo Firebase Auth
   * @param usuario Dados cadastrais do usuário (ex: nome, email, role)
   */
  public async criar(uid: string, usuario: Omit<Usuario, "id">): Promise<void> {
    const docRef = doc(this.getCollectionRef(), uid);
    await setDoc(docRef, usuario);
  }

  /**
   * Obtém os dados de um usuário a partir do token de autenticação (JWT) decodificando seu payload.
   * @param token ID Token (JWT) obtido diretamente do fluxo de autenticação do cliente
   */
  public async obterPorToken(uid: string): Promise<Usuario | null> {
    const docRef = doc(this.getCollectionRef(), uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Usuario;
  }
}
