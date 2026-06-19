import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, X } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppointmentStatusBadge } from '@/features/dentist/components/appointment-status-badge';
import { useThemeColors } from '@/features/dentist/hooks/use-theme-colors';
import { useAppointment } from '@/hooks/use-appointments';
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

export function DentistRequestDetailsScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointmentQuery = useAppointment(typeof id === 'string' ? id : undefined);
  const [actionTaken, setActionTaken] = useState<AppointmentStatus | null>(null);
  const appointment = appointmentQuery.data ? toDentistAppointment(appointmentQuery.data) : null;

  if (appointmentQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background p-4">
        <ActivityIndicator color={colors.primary} />
        <Text className="text-sm text-muted-foreground">Carregando solicitacao...</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-sm text-muted-foreground">Solicitacao nao encontrada.</Text>
      </View>
    );
  }

  const status = actionTaken ?? appointment.status;
  const dayOfMonth = appointment.date.split('-')[2];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Pressable
        accessibilityLabel="Voltar"
        accessibilityRole="button"
        className="flex-row items-center gap-1.5"
        onPress={() => router.back()}
      >
        <ArrowLeft color={colors.muted} size={16} />
        <Text className="text-sm text-muted-foreground">Voltar</Text>
      </Pressable>

      {appointmentQuery.error ? (
        <Card>
          <Text className="text-sm text-destructive">Nao foi possivel atualizar os dados da solicitacao.</Text>
        </Card>
      ) : null}

      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
          <Text className="text-sm font-semibold text-primary">
            {appointment.patient.name
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')}
          </Text>
        </View>
        <View>
          <Text className="text-base font-semibold text-foreground">{appointment.patient.name}</Text>
          <Text className="text-xs text-muted-foreground">{appointment.date}</Text>
        </View>
      </View>

      <Card className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-foreground">Dia {dayOfMonth}</Text>
          <AppointmentStatusBadge status={status} />
        </View>
        <Text className="text-sm text-muted-foreground">
          {appointment.startTime} - {appointment.endTime}
        </Text>
      </Card>

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Descricao do procedimento</Text>
        <Card>
          <Text className="text-sm text-foreground">{appointment.description}</Text>
        </Card>
      </View>

      {status === 'pending' ? (
        <View className="gap-2 pt-2">
          <Button accessibilityLabel="Confirmar horario" onPress={() => setActionTaken('confirmed')}>
            <View className="flex-row items-center gap-2">
              <Check color={colors.background} size={18} />
              <Text className="text-base font-semibold text-primary-foreground">Confirmar horario</Text>
            </View>
          </Button>
          <Button
            accessibilityLabel="Recusar ou sugerir outro horario"
            onPress={() => setActionTaken('declined')}
            variant="outline"
          >
            <View className="flex-row items-center gap-2">
              <X color={colors.text} size={18} />
              <Text className="text-base text-foreground">Recusar / sugerir outro horario</Text>
            </View>
          </Button>
        </View>
      ) : (
        <Card>
          <Text className="text-sm text-muted-foreground">
            {status === 'confirmed' ? 'Voce confirmou este horario.' : 'Voce recusou este horario.'}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}
