import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useAuthStore } from '@/store/auth.store';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const user = useAuthStore((state) => state.user);

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/sign-in');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="gap-6 px-5 py-6">
        <View>
          <Text variant="caption">Perfil</Text>
          <Text variant="title">{user?.name ?? 'Profissional'}</Text>
          <Text variant="muted">{user?.email ?? 'Sem conta conectada'}</Text>
        </View>
        <Card className="gap-2">
          <Text className="font-semibold">Conta</Text>
          <Text variant="muted">Dados do profissional conectado e preferencias da experiencia mobile.</Text>
        </Card>
        <Button accessibilityLabel="Sair da conta" label="Sair" onPress={handleSignOut} variant="destructive" />
      </View>
    </SafeAreaView>
  );
}
