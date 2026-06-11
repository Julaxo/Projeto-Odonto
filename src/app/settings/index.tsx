import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="gap-6 px-5 py-6">
        <View>
          <Text variant="caption">Preferencias</Text>
          <Text variant="title">Configuracoes</Text>
        </View>
        <Card className="flex-row items-center justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="font-semibold">Tema do aplicativo</Text>
            <Text variant="muted">Alterne entre modo claro e escuro.</Text>
          </View>
          <ThemeToggle />
        </Card>
      </View>
    </SafeAreaView>
  );
}
