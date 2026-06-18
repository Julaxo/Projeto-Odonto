import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Check, User, X } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppointmentStatusBadge } from '@/features/dentist/components/appointment-status-badge';
import { useThemeColors } from '@/features/dentist/hooks/use-theme-colors';
import { mockDentistAppointments } from '@/features/dentist/mock-data';
import type { DentistAppointment } from '@/types/dentist';

/**
 * Lista de solicitações de agendamento aguardando confirmação. Renderizada
 * pela rota `/(dentist)/requests`.
 *
 * NOTE: estado local apenas para feedback imediato (otimista) na lista.
 * Quando o backend existir, troque por mutations do TanStack Query
 * (ex: `useConfirmAppointment`, `useDeclineAppointment`), seguindo o
 * padrão de `src/hooks/use-appointments.ts`.
 */
export function DentistRequestsScreen() {
  const colors = useThemeColors();
  const [appointments, setAppointments] = useState<DentistAppointment[]>(() =>
    mockDentistAppointments.filter((item) => item.status === 'pending'),
  );

  function handleConfirm(id: string) {
    setAppointments((current) => current.filter((item) => item.id !== id));
  }

  function handleDecline(id: string) {
    setAppointments((current) => current.filter((item) => item.id !== id));
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-semibold text-foreground">Solicitações</Text>
      <Text className="mb-4 text-sm text-muted-foreground">Confirme ou recuse os pedidos dos pacientes</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3"
        ListEmptyComponent={
          <Card>
            <Text className="text-sm text-muted-foreground">Nenhuma solicitação pendente no momento.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/(dentist)/requests/[id]', params: { id: item.id } })}
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes da solicitação de ${item.patient.name}`}
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
                  {item.date} · {item.startTime}
                </Text>
              </View>

              <View className="flex-row gap-2 pt-1">
                <View className="flex-1">
                  <Button
                    accessibilityLabel={`Confirmar solicitação de ${item.patient.name}`}
                    size="sm"
                    onPress={(event) => {
                      event.stopPropagation();
                      handleConfirm(item.id);
                    }}
                  >
                    <View className="flex-row items-center gap-1.5">
                      <Check color={colors.background} size={14} />
                      <Text className="text-sm font-semibold text-primary-foreground">Confirmar</Text>
                    </View>
                  </Button>
                </View>
                <View className="flex-1">
                  <Button
                    accessibilityLabel={`Recusar solicitação de ${item.patient.name}`}
                    size="sm"
                    variant="outline"
                    onPress={(event) => {
                      event.stopPropagation();
                      handleDecline(item.id);
                    }}
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
