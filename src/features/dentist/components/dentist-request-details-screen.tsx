import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, X } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppointmentStatusBadge } from '@/features/dentist/components/appointment-status-badge';
import { useThemeColors } from '@/features/dentist/hooks/use-theme-colors';
import { mockDentistAppointments } from '@/features/dentist/mock-data';

/**
 * Detalhes de uma solicitação específica, com ações de confirmar/recusar.
 * Renderizada pela rota `/(dentist)/requests/[id]`.
 *
 * NOTE: hoje busca no array mockado pelo `id` recebido via params. Quando
 * existir backend, troque por uma query do TanStack Query
 * (ex: `useDentistAppointment(id)`).
 */
export function DentistRequestDetailsScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [actionTaken, setActionTaken] = useState<'confirmed' | 'declined' | null>(null);

  const appointment = useMemo(() => mockDentistAppointments.find((item) => item.id === id), [id]);

  if (!appointment) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-sm text-muted-foreground">Solicitação não encontrada.</Text>
      </View>
    );
  }

  const status = actionTaken ?? appointment.status;
  const dayOfMonth = appointment.date.split('-')[2];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        className="flex-row items-center gap-1.5"
      >
        <ArrowLeft color={colors.muted} size={16} />
        <Text className="text-sm text-muted-foreground">Voltar</Text>
      </Pressable>

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
          {appointment.room ? <Text className="text-xs text-muted-foreground">{appointment.room}</Text> : null}
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
        <Text className="text-sm text-muted-foreground">Descrição do procedimento</Text>
        <Card>
          <Text className="text-sm text-foreground">{appointment.description}</Text>
        </Card>
      </View>

      {status === 'pending' ? (
        <View className="gap-2 pt-2">
          <Button accessibilityLabel="Confirmar horário" onPress={() => setActionTaken('confirmed')}>
            <View className="flex-row items-center gap-2">
              <Check color={colors.background} size={18} />
              <Text className="text-base font-semibold text-primary-foreground">Confirmar horário</Text>
            </View>
          </Button>
          <Button
            accessibilityLabel="Recusar ou sugerir outro horário"
            variant="outline"
            onPress={() => setActionTaken('declined')}
          >
            <View className="flex-row items-center gap-2">
              <X color={colors.text} size={18} />
              <Text className="text-base text-foreground">Recusar / sugerir outro horário</Text>
            </View>
          </Button>
        </View>
      ) : (
        <Card>
          <Text className="text-sm text-muted-foreground">
            {status === 'confirmed' ? 'Você confirmou este horário.' : 'Você recusou este horário.'}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}
