import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bell, CalendarClock, ClipboardList, History } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { AppointmentStatusBadge } from '@/features/dentist/components/appointment-status-badge';
import { useThemeColors } from '@/features/dentist/hooks/use-theme-colors';
import { useDentistAppointments } from '@/hooks/use-appointments';
import { type AgendamentoData } from '@/types/appointment';
import { type AppointmentStatus, type DentistAppointment } from '@/types/dentist';

function mapStatus(status: AgendamentoData['status']): AppointmentStatus {
  if (status === 'CONFIRMADO') {
    return 'confirmed';
  }

  return 'pending';
}

function toDentistAppointment(appointment: AgendamentoData): DentistAppointment {
  return {
    date: appointment.dataAgendamento,
    description: appointment.observacoes ?? appointment.procedimento,
    endTime: appointment.horarioFim,
    id: appointment.id,
    patient: {
      id: appointment.clienteId,
      name: appointment.clienteNome ?? 'Paciente',
    },
    procedure: appointment.procedimento,
    requestedAt: appointment.criadoEm,
    status: mapStatus(appointment.status),
    startTime: appointment.horarioInicio,
  };
}

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
  const appointmentsQuery = useDentistAppointments(user?.id);

  const appointments = useMemo(
    () => (appointmentsQuery.data ?? []).map(toDentistAppointment),
    [appointmentsQuery.data],
  );
  const pendingAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'pending'),
    [appointments],
  );
  const nextAppointment = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.status === 'confirmed')
        .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))[0],
    [appointments],
  );

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

      {appointmentsQuery.error ? (
        <Card>
          <Text className="text-sm text-destructive">Nao foi possivel carregar as consultas do dentista.</Text>
        </Card>
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
          <Button
            accessibilityLabel="Ver historico de atendimentos"
            onPress={() => router.push({ pathname: '/(dentist)/agenda', params: { tab: 'history' } })}
            variant="outline"
          >
            <View className="flex-row items-center gap-2">
              <History color={colors.text} size={16} />
              <Text className="text-sm text-foreground">Historico</Text>
            </View>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
