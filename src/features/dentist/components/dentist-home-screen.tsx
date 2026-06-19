import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bell, CalendarClock, ClipboardList, History } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { AppointmentStatusBadge } from '@/features/dentist/components/appointment-status-badge';
import { useThemeColors } from '@/features/dentist/hooks/use-theme-colors';
import {
  getNextAppointment,
  getPendingAppointments,
  mockDentistAppointments,
} from '@/features/dentist/mock-data';

/**
 * Home do dentista. Renderizada pela rota `/(dentist)/index`.
 *
 * Usa `Card`/`Button` reais do projeto (não `View`/`Pressable` crus com
 * classes manuais) e `NAV_THEME` (via `useThemeColors`) para colorir os
 * ícones do lucide-react-native conforme o color scheme atual.
 */
export function DentistHomeScreen() {
  const { user } = useAuth();
  const colors = useThemeColors();

  const pendingAppointments = useMemo(() => getPendingAppointments(mockDentistAppointments), []);
  const nextAppointment = useMemo(() => getNextAppointment(mockDentistAppointments), []);

  // `mapFirebaseUser` usa "Paciente" como fallback de nome quando não há
  // displayName/email. Como esta tela é sempre do dentista, ignoramos
  // esse fallback específico.
  const dentistName = user?.name && user.name !== 'Paciente' ? user.name : 'Doutor(a)';

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <View>
        <Text className="text-sm text-muted-foreground">Bom dia,</Text>
        <Text className="text-xl font-semibold text-foreground">{dentistName}</Text>
      </View>

      {pendingAppointments.length > 0 ? (
        <Pressable
          onPress={() => router.push('/(dentist)/requests')}
          accessibilityRole="button"
          accessibilityLabel={`Ver ${pendingAppointments.length} solicitações aguardando confirmação`}
        >
          <Card className="flex-row items-center gap-3 bg-primary/10">
            <Bell color={colors.primary} size={20} />
            <View className="flex-1">
              <Text className="text-xs font-medium text-primary">Aguardando confirmação</Text>
              <Text className="text-base font-semibold text-foreground">
                {pendingAppointments.length} solicitações novas
              </Text>
            </View>
          </Card>
        </Pressable>
      ) : null}

      {nextAppointment ? (
        <Card className="gap-2">
          <View className="flex-row items-center gap-2">
            <CalendarClock color={colors.muted} size={16} />
            <Text className="text-xs text-muted-foreground">Próximo paciente</Text>
          </View>
          <Text className="text-base font-semibold text-foreground">{nextAppointment.procedure}</Text>
          <Text className="text-sm text-muted-foreground">{nextAppointment.patient.name}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">
              {nextAppointment.startTime} - {nextAppointment.endTime}
            </Text>
            <AppointmentStatusBadge status={nextAppointment.status} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text className="text-sm text-muted-foreground">
            Nenhuma consulta confirmada para os próximos dias.
          </Text>
        </Card>
      )}

      <Button
        accessibilityLabel="Ver solicitações de agendamento"
        label="Ver solicitações"
        onPress={() => router.push('/(dentist)/requests')}
      >
        <View className="flex-row items-center gap-2">
          <ClipboardList color={colors.background} size={18} />
          <Text className="text-base font-semibold text-primary-foreground">Ver solicitações</Text>
        </View>
      </Button>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            accessibilityLabel="Ver minha agenda"
            variant="outline"
            onPress={() => router.push('/(dentist)/agenda')}
          >
            <View className="flex-row items-center gap-2">
              <CalendarClock color={colors.text} size={16} />
              <Text className="text-sm text-foreground">Minha agenda</Text>
            </View>
          </Button>
        </View>
        <View className="flex-1">
          <Button accessibilityLabel="Ver histórico de atendimentos" variant="outline">
            <View className="flex-row items-center gap-2">
              <History color={colors.text} size={16} />
              <Text className="text-sm text-foreground">Histórico</Text>
            </View>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
