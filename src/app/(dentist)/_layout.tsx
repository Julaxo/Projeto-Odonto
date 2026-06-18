import { Redirect, Tabs } from "expo-router";
import { CalendarDays, ClipboardList, Home, User } from "lucide-react-native";

import { useAuth } from "@/features/auth/hooks/use-auth";

/**
 * Layout de tabs para o fluxo "dentista". Espelha
 * `src/app/(tabs)/_layout.tsx`: usuários sem sessão vão para o login.
 *
 * IMPORTANTE: `FirebaseAuthUser` (ver `firebase-auth.service.ts`) não tem
 * um campo de perfil/role — é só `{ email, id, name }`. Por isso este
 * layout não tenta distinguir "dentista" de "paciente" pelo usuário
 * autenticado; ele confia que o usuário só chega em `/(dentist)` porque
 * escolheu "Dentista" na tela de login (ver `sign-in-form.REFERENCE.tsx`).
 *
 * Se no futuro for necessário um gate real (ex: impedir um paciente de
 * navegar manualmente para `/(dentist)` digitando a URL, ou restaurar a
 * escolha após reabrir o app), será preciso persistir esse dado em algum
 * lugar associado ao `uid` (ex: Firestore, ou um campo extra salvo junto
 * com `useAuthStore`), já que o Firebase Auth puro não guarda isso.
 */
export default function DentistTabsLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarAccessibilityLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="requests/index"
        options={{
          title: "Solicitações",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
          tabBarAccessibilityLabel: "Solicitações",
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size} />
          ),
          tabBarAccessibilityLabel: "Minha agenda",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarAccessibilityLabel: "Perfil",
        }}
      />
      <Tabs.Screen
        name="requests/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
