import { Mail, UserRound } from 'lucide-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useAuthStore } from '@/store/auth.store';

export default function PatientProfileScreen() {
  const { signOut } = useAuth();
  const user = useAuthStore((state) => state.user);

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/sign-in');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="gap-5 px-4 pt-14">
        <View>
          <Text className="text-2xl font-bold text-foreground">Profile</Text>
          <Text className="text-sm text-muted-foreground">Dados do paciente conectado.</Text>
        </View>

        <Card className="gap-4 rounded-2xl">
          <View className="flex-row items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-teal-600">
              <UserRound color="#ffffff" size={28} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">{user?.name ?? 'Paciente'}</Text>
              <View className="flex-row items-center gap-2">
                <Mail color="#64748b" size={14} />
                <Text className="text-sm text-muted-foreground">{user?.email ?? 'Sem e-mail conectado'}</Text>
              </View>
            </View>
          </View>
          <Button accessibilityLabel="Sair da conta" label="Sair" onPress={handleSignOut} variant="destructive" />
        </Card>
      </View>
    </SafeAreaView>
  );
}
