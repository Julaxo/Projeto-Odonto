import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { MOCK_APPOINTMENTS } from '@/constants/appointments';
import { AppointmentCard } from '@/features/dashboard/components/appointment-card';
import { MetricCard } from '@/features/dashboard/components/metric-card';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6 px-5 py-6">
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1">
              <Text variant="caption">Clinica odontologica</Text>
              <Text variant="title">Dashboard</Text>
            </View>
            <ThemeToggle />
          </View>

          <View className="flex-row gap-3">
            <MetricCard label="Consultas hoje" value="8" />
            <MetricCard label="Confirmadas" value="6" />
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text variant="subtitle">Proximas consultas</Text>
              <Link href="/(tabs)/appointments" accessibilityLabel="Ver agenda completa" accessibilityRole="link">
                <Text className="font-semibold text-primary">Ver agenda</Text>
              </Link>
            </View>
            {MOCK_APPOINTMENTS.slice(0, 2).map((appointment) => (
              <AppointmentCard appointment={appointment} key={appointment.id} />
            ))}
          </View>

          <Link href="/(auth)/sign-in" asChild>
            <Button accessibilityLabel="Abrir tela de acesso" label="Acessar conta" variant="outline" />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
