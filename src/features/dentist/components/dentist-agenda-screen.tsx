import { RefreshCw } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, SectionList, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppointmentStatusBadge } from '@/features/dentist/components/appointment-status-badge';
import { useThemeColors } from '@/features/dentist/hooks/use-theme-colors';
import { useDentistAppointments } from '@/hooks/use-appointments';
import { useAuthStore } from '@/store/auth.store';
import { type AgendamentoData } from '@/types/appointment';
import { type AppointmentStatus, type DentistAppointment } from '@/types/dentist';
import { cn } from '@/lib/utils';

type AgendaTab = 'history' | 'upcoming';

const MONTH_LABELS = [
  'JANEIRO',
  'FEVEREIRO',
  'MARCO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO',
];

interface MonthSection {
  data: DentistAppointment[];
  title: string;
}

const agendaTabs: { label: string; value: AgendaTab }[] = [
  { label: 'Proximas', value: 'upcoming' },
  { label: 'Historico', value: 'history' },
];

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

function groupByMonth(appointments: DentistAppointment[]): MonthSection[] {
  const sorted = [...appointments].sort((a, b) =>
    `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`),
  );

  const sections = new Map<string, DentistAppointment[]>();
  for (const appointment of sorted) {
    const [year, month] = appointment.date.split('-');
    const label = `${MONTH_LABELS[Number(month) - 1]} ${year}`;
    const bucket = sections.get(label) ?? [];
    bucket.push(appointment);
    sections.set(label, bucket);
  }

  return Array.from(sections.entries()).map(([title, data]) => ({ data, title }));
}

export function DentistAgendaScreen() {
  const colors = useThemeColors();
  const dentistId = useAuthStore((state) => state.user?.id);
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [selectedTab, setSelectedTab] = useState<AgendaTab>(() => (tab === 'history' ? 'history' : 'upcoming'));
  const appointmentsQuery = useDentistAppointments(dentistId);
  const appointments = useMemo(
    () => (appointmentsQuery.data ?? []).map(toDentistAppointment),
    [appointmentsQuery.data],
  );
  const filteredAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    if (selectedTab === 'history') {
      return appointments.filter((appointment) => appointment.date < today);
    }

    return appointments.filter((appointment) => appointment.date >= today);
  }, [appointments, selectedTab]);
  const sections = useMemo(() => groupByMonth(filteredAppointments), [filteredAppointments]);
  const isRefreshing = appointmentsQuery.isFetching && !appointmentsQuery.isLoading;

  async function handleRefreshAppointments() {
    await appointmentsQuery.refetch();
  }

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mb-4 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xl font-semibold text-foreground">Minha agenda</Text>
          <Text className="text-sm text-muted-foreground">Acompanhe suas consultas</Text>
        </View>

        <Button
          accessibilityLabel="Atualizar consultas do dentista"
          className="h-10 rounded-xl border-blue-900 px-3 dark:border-blue-700"
          disabled={appointmentsQuery.isFetching}
          onPress={handleRefreshAppointments}
          size="sm"
          variant="outline"
        >
          <View className="flex-row items-center gap-2">
            {isRefreshing ? (
              <ActivityIndicator color="#1e3a5f" size="small" />
            ) : (
              <RefreshCw color="#1e3a5f" size={15} />
            )}
            <Text className="text-xs font-bold text-blue-900 dark:text-blue-300">
              {isRefreshing ? 'Atualizando' : 'Atualizar'}
            </Text>
          </View>
        </Button>
      </View>

      <View className="mb-4 flex-row rounded-xl bg-blue-50 p-1 dark:bg-blue-950/30">
        {agendaTabs.map((tab) => {
          const isSelected = selectedTab === tab.value;

          return (
            <Pressable
              accessibilityLabel={`Ver ${tab.label.toLowerCase()}`}
              accessibilityRole="button"
              className={cn('h-11 flex-1 items-center justify-center rounded-lg', isSelected && 'bg-card shadow-sm')}
              key={tab.value}
              onPress={() => setSelectedTab(tab.value)}
            >
              <Text className={cn('text-sm font-bold', isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-foreground')}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {appointmentsQuery.error ? (
        <View className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
          <Text className="text-sm font-medium text-destructive">
            Nao foi possivel carregar as consultas. Tente atualizar novamente.
          </Text>
        </View>
      ) : null}

      {appointmentsQuery.isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color={colors.primary} />
          <Text className="text-sm text-muted-foreground">Carregando consultas...</Text>
        </View>
      ) : (
        <SectionList
          ListEmptyComponent={
            <Card>
              <Text className="text-sm text-muted-foreground">
                {selectedTab === 'history'
                  ? 'Nenhum historico encontrado.'
                  : 'Nenhuma consulta encontrada.'}
              </Text>
            </Card>
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const day = item.date.split('-')[2];

            return (
              <Card className="mb-3 flex-row gap-3">
                <View className="items-center justify-center">
                  <Text className="text-lg font-semibold text-foreground">{day}</Text>
                  <Text className="text-xs text-muted-foreground">{item.startTime}</Text>
                </View>
                <View className="flex-1 gap-1">
                  <View className="flex-row items-start justify-between gap-2">
                    <Text className="flex-1 text-base font-semibold text-foreground">{item.procedure}</Text>
                    <AppointmentStatusBadge status={item.status} />
                  </View>
                  <Text className="text-sm text-muted-foreground">{item.patient.name}</Text>
                  <Text className="text-xs text-muted-foreground">
                    {item.startTime} - {item.endTime}
                  </Text>
                </View>
              </Card>
            );
          }}
          renderSectionHeader={({ section }) => (
            <Text className="mb-2 mt-1 text-xs font-medium text-muted-foreground">{section.title}</Text>
          )}
          sections={sections}
        />
      )}
    </View>
  );
}
