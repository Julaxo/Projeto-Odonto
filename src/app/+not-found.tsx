import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Text className="text-center" variant="title">
          Tela nao encontrada.
        </Text>
        <Link href="/" accessibilityLabel="Voltar para o inicio" accessibilityRole="link">
          <Text className="font-semibold text-primary">Voltar para o inicio</Text>
        </Link>
      </View>
    </>
  );
}
