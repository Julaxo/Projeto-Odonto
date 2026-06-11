import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { SignInForm } from '@/features/auth/components/sign-in-form';

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center gap-8 px-5">
        <View className="gap-2">
          <Text variant="caption">Acesso profissional</Text>
          <Text variant="title">Entre na sua conta</Text>
          <Text variant="muted">Use suas credenciais para acessar a agenda da clinica.</Text>
        </View>
        <SignInForm />
      </View>
    </SafeAreaView>
  );
}
