import { Bell } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function AlertsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="gap-5 px-4 pt-14">
        <View>
          <Text className="text-2xl font-bold text-foreground">Alerts</Text>
          <Text className="text-sm text-muted-foreground">Atualizacoes da clinica aparecerao aqui.</Text>
        </View>

        <Card className="gap-3 rounded-2xl">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
            <Bell color="#1e3a5f" size={22} />
          </View>
          <Text className="text-lg font-bold text-foreground">Nenhum alerta novo</Text>
          <Text className="text-sm leading-5 text-muted-foreground">
            Voce recebera lembretes e confirmacoes quando houver novidades.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}
