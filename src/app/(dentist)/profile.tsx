import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/use-auth';

/**
 * Tela de perfil do dentista. Mínima por enquanto — só identificação e
 * logout. Pode crescer depois para edição de dados profissionais, sala
 * padrão, horários de atendimento etc.
 */
export default function DentistProfileRoute() {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-semibold text-foreground">Perfil</Text>

      <Card className="mt-4 gap-1">
        <Text className="text-base font-semibold text-foreground">{user?.name ?? 'Dentista'}</Text>
        {user?.email ? <Text className="text-sm text-muted-foreground">{user.email}</Text> : null}
      </Card>

      <View className="mt-4">
        <Button accessibilityLabel="Sair da conta" label="Sair" variant="outline" onPress={() => signOut()} />
      </View>
    </View>
  );
}
