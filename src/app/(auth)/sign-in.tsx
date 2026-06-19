import { Redirect } from 'expo-router';
import { LockKeyhole } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { SignInForm } from '@/features/auth/components/sign-in-form';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function SignInScreen() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#1e3a5f" />
        </View>
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return <Redirect href={role === 'dentist' ? '/(dentist)' : '/(tabs)'} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center gap-6 px-5">
        <View className="items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30">
            <LockKeyhole color="#1e3a5f" size={28} />
          </View>
          <View className="items-center gap-1">
            <Text className="text-2xl font-bold text-blue-900 dark:text-blue-300">OdontoLuma</Text>
            <Text className="text-center text-sm text-muted-foreground">Acesse ou crie sua conta para acompanhar sua agenda odontologica.</Text>
          </View>
        </View>

        <Card className="gap-5 rounded-2xl p-5">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">Acesso</Text>
            <Text className="text-sm text-muted-foreground">Use o Firebase Auth para entrar ou criar um novo cadastro.</Text>
          </View>
          <SignInForm />
        </Card>
      </View>
    </SafeAreaView>
  );
}
