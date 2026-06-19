import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CalendarCheck,
  Clock3,
  Info,
  MapPin,
  Settings,
} from 'lucide-react-native';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useAppointment } from '@/hooks/use-appointments';
import { type AgendamentoData, type AgendamentoStatus } from '@/types/appointment';

const statusLabels: Record<AgendamentoStatus, string> = {
  CANCELADO: 'Cancelado',
  CONFIRMADO: 'Confirmado',
  PENDENTE: 'Aguardando Confirmacao',
};

function BrandHeader() {
  return (
    <View className="flex-row items-center justify-between border-b border-border bg-background px-4 pb-3 pt-4">
      <View className="flex-row items-center gap-3">
        <View
          accessibilityLabel="Avatar OdontoLuma"
          className="h-10 w-10 items-center justify-center rounded-full bg-teal-600"
        >
          <Text className="text-xs font-bold text-white">OL</Text>
        </View>
        <Text className="text-xl font-bold text-blue-900 dark:text-blue-300">OdontoLuma</Text>
      </View>

      <TouchableOpacity
        accessibilityLabel="Abrir configuracoes"
        accessibilityRole="button"
        className="p-1"
        onPress={() => router.push('/settings')}
      >
        <Settings color="#334155" size={22} />
      </TouchableOpacity>
    </View>
  );
}

function StatusBadge({ status }: { status: AgendamentoStatus }) {
  const isConfirmed = status === 'CONFIRMADO';
  const isCancelled = status === 'CANCELADO';

  return (
    <View
      className={
        isConfirmed
          ? 'self-start rounded-full bg-teal-100 px-3 py-1 dark:bg-teal-950'
          : isCancelled
            ? 'self-start rounded-full bg-red-100 px-3 py-1 dark:bg-red-950'
            : 'self-start rounded-full bg-amber-100 px-3 py-1 dark:bg-amber-950'
      }
    >
      <Text
        className={
          isConfirmed
            ? 'text-xs font-bold text-teal-700 dark:text-teal-300'
            : isCancelled
              ? 'text-xs font-bold text-red-700 dark:text-red-300'
              : 'text-xs font-bold text-amber-700 dark:text-amber-300'
        }
      >
        {statusLabels[status]}
      </Text>
    </View>
  );
}

function formatAppointmentDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

function AppointmentCard({ appointment }: { appointment: AgendamentoData }) {
  const dentistName = appointment.profissionalNome ?? 'Equipe OdontoLuma';
  const room = appointment.profissionalId ? `Profissional: ${appointment.profissionalId}` : 'Equipe da clinica';

  return (
    <View className="overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/10">
      <View className="flex-row">
        <View className="w-1.5 bg-blue-900 dark:bg-blue-700" />
        <View className="flex-1 gap-4 p-5">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-2xl font-bold capitalize text-foreground">
                {formatAppointmentDate(appointment.dataAgendamento)}
              </Text>
              <Text className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                {appointment.horarioInicio} - {appointment.horarioFim}
              </Text>
            </View>
            <StatusBadge status={appointment.status} />
          </View>

          <View className="h-px bg-border" />

          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-950">
              <CalendarCheck color="#0f766e" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">{dentistName}</Text>
              <View className="mt-1 flex-row items-center gap-1">
                <MapPin color="#64748b" size={14} />
                <Text className="text-sm text-muted-foreground">{room}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
            <Clock3 color="#64748b" size={18} />
            <Text className="flex-1 text-xs leading-5 text-muted-foreground">
              Procedimento solicitado:{' '}
              <Text className="text-xs font-bold text-foreground">{appointment.procedimento}</Text>.
              {' '}Duracao estimada:{' '}
              <Text className="text-xs font-bold text-foreground">{appointment.duracaoMinutos} minutos</Text>.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function AppointmentDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const appointmentId = typeof params.id === 'string' ? params.id : undefined;
  const appointmentQuery = useAppointment(appointmentId);

  function handleGoBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/appointments');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BrandHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          accessibilityLabel="Voltar para agenda"
          accessibilityRole="button"
          className="mb-4 flex-row items-center gap-2 self-start"
          onPress={handleGoBack}
        >
          <ArrowLeft color="#1e3a5f" size={18} />
          <Text className="text-sm font-bold text-blue-900 dark:text-blue-300">Voltar</Text>
        </TouchableOpacity>

        <View className="mb-4 flex-row gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <Info color="#1e3a5f" size={20} />
          <View className="flex-1 gap-1">
            <Text className="text-sm font-bold text-blue-900 dark:text-blue-300">Solicitacao criada</Text>
            <Text className="text-sm leading-5 text-muted-foreground">
              Estes sao os dados enviados para a clinica. A confirmacao do horario e feita pelo dentista.
            </Text>
          </View>
        </View>

        {appointmentQuery.isLoading ? (
          <View className="mt-8 items-center gap-3">
            <ActivityIndicator color="#1e3a5f" />
            <Text className="text-sm text-muted-foreground">Carregando solicitacao...</Text>
          </View>
        ) : appointmentQuery.data ? (
          <AppointmentCard appointment={appointmentQuery.data} />
        ) : (
          <View className="rounded-2xl border border-border bg-card p-5">
            <Text className="text-sm font-semibold text-foreground">Solicitacao nao encontrada.</Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Volte para a agenda e atualize a lista de agendamentos.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
