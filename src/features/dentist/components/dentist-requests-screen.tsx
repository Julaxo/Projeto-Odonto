import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Check, User, X } from 'lucide-react-native';

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

export function DentistRequestsScreen() {
  const colors = useThemeColors();
  const { user } = useAuth();
  const appointmentsQuery = useDentistAppointments(user?.id);
  const [hiddenAppointmentIds, setHiddenAppointmentIds] = useState<string[]>([]);
  const appointments = useMemo(
    () =>
      (appointmentsQuery.data ?? [])
        .map(toDentistAppointment)
        .filter((item) => item.status === 'pending' && !hiddenAppointmentIds.includes(item.id)),
    [appointmentsQuery.data, hiddenAppointmentIds],
  );

  function handleConfirm(id: string) {
    setHiddenAppointmentIds((current) => [...current, id]);
  }

  function handleDecline(id: string) {
    setHiddenAppointmentIds((current) => [...current, id]);
  }

  if (appointmentsQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background p-4">
        <ActivityIndicator color={colors.primary} />
        <Text className="text-sm text-muted-foreground">Carregando solicitacoes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-semibold text-foreground">Solicitacoes</Text>
      <Text className="mb-4 text-sm text-muted-foreground">Confirme ou recuse os pedidos dos pacientes</Text>

      {appointmentsQuery.error ? (
        <Card className="mb-3">
          <Text className="text-sm text-destructive">Nao foi possivel carregar as solicitacoes.</Text>
        </Card>
      ) : null}

      <FlatList
        contentContainerClassName="gap-3"
        data={appointments}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Card>
            <Text className="text-sm text-muted-foreground">Nenhuma solicitacao pendente no momento.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityLabel={`Ver detalhes da solicitacao de ${item.patient.name}`}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/(dentist)/requests/[id]', params: { id: item.id } })}
          >
            <Card className="mb-3 gap-2">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-foreground">{item.procedure}</Text>
                  <View className="flex-row items-center gap-1.5">
                    <User color={colors.muted} size={14} />
                    <Text className="text-sm text-muted-foreground">{item.patient.name}</Text>
                  </View>
                </View>
                <AppointmentStatusBadge status={item.status} />
              </View>

              <View className="flex-row items-center gap-1.5">
                <Calendar color={colors.muted} size={14} />
                <Text className="text-sm text-muted-foreground">
                  {item.date} - {item.startTime}
                </Text>
              </View>

              <View className="flex-row gap-2 pt-1">
                <View className="flex-1">
                  <Button
                    accessibilityLabel={`Confirmar solicitacao de ${item.patient.name}`}
                    onPress={(event) => {
                      event.stopPropagation();
                      handleConfirm(item.id);
                    }}
                    size="sm"
                  >
                    <View className="flex-row items-center gap-1.5">
                      <Check color={colors.background} size={14} />
                      <Text className="text-sm font-semibold text-primary-foreground">Confirmar</Text>
                    </View>
                  </Button>
                </View>
                <View className="flex-1">
                  <Button
                    accessibilityLabel={`Recusar solicitacao de ${item.patient.name}`}
                    onPress={(event) => {
                      event.stopPropagation();
                      handleDecline(item.id);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <View className="flex-row items-center gap-1.5">
                      <X color={colors.text} size={14} />
                      <Text className="text-sm text-foreground">Recusar</Text>
                    </View>
                  </Button>
                </View>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}
