import { Settings, UserRound } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type AgendaStatus = 'completed' | 'confirmed' | 'pending';

type AgendaAppointment = {
  day: string;
  dentist: string;
  id: string;
  month: 'october' | 'november';
  procedure: string;
  status: AgendaStatus;
  time: string;
  weekday: string;
};

type AgendaTab = 'upcoming' | 'history';

type MyAgendaScreenProps = {
  onOpenAppointmentDetails: () => void;
  onOpenSettings: () => void;
  onSelectTab: (tab: AgendaTab) => void;
  selectedTab: AgendaTab;
};

const appointments: AgendaAppointment[] = [
  {
    day: '12',
    dentist: 'Dr. Carlos Silva',
    id: 'cleaning',
    month: 'october',
    procedure: 'Limpeza e Profilaxia',
    status: 'confirmed',
    time: '09:30',
    weekday: 'QUI',
  },
  {
    day: '16',
    dentist: 'Dra. Marina Costa',
    id: 'orthodontic',
    month: 'october',
    procedure: 'Avaliacao Ortodontica',
    status: 'pending',
    time: '14:00',
    weekday: 'SEG',
  },
  {
    day: '08',
    dentist: 'Dr. Carlos Silva',
    id: 'restoration',
    month: 'november',
    procedure: 'Restauracao',
    status: 'confirmed',
    time: '10:45',
    weekday: 'QUA',
  },
];

const historyAppointments: AgendaAppointment[] = [
  {
    day: '18',
    dentist: 'Dra. Camila Barros',
    id: 'history-cleaning',
    month: 'october',
    procedure: 'Limpeza e Check-up',
    status: 'completed',
    time: '11:00',
    weekday: 'QUA',
  },
  {
    day: '04',
    dentist: 'Dr. Roberto Silva',
    id: 'history-evaluation',
    month: 'october',
    procedure: 'Avaliacao Inicial',
    status: 'completed',
    time: '15:30',
    weekday: 'QUA',
  },
  {
    day: '22',
    dentist: 'Dra. Marina Costa',
    id: 'history-follow-up',
    month: 'november',
    procedure: 'Retorno Ortodontico',
    status: 'completed',
    time: '08:30',
    weekday: 'QUA',
  },
];

const agendaTabs: { label: string; value: AgendaTab }[] = [
  { label: 'Proximas', value: 'upcoming' },
  { label: 'Historico', value: 'history' },
];

const statusStyles: Record<AgendaStatus, { className: string; dotClassName: string; label: string; textClassName: string }> = {
  confirmed: {
    className: 'bg-teal-100 dark:bg-teal-950',
    dotClassName: 'bg-teal-600',
    label: 'Confirmada',
    textClassName: 'text-teal-700 dark:text-teal-300',
  },
  pending: {
    className: 'bg-amber-100 dark:bg-amber-950',
    dotClassName: 'bg-amber-500',
    label: 'Aguardando Confirmacao',
    textClassName: 'text-amber-700 dark:text-amber-300',
  },
  completed: {
    className: 'bg-slate-100 dark:bg-slate-900',
    dotClassName: 'bg-slate-500',
    label: 'Finalizada',
    textClassName: 'text-slate-700 dark:text-slate-300',
  },
};

function BrandHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
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

      <Pressable
        accessibilityLabel="Abrir configuracoes"
        accessibilityRole="button"
        className="p-1"
        onPress={onOpenSettings}
      >
        <Settings color="#334155" size={22} />
      </Pressable>
    </View>
  );
}

function StatusBadge({ status }: { status: AgendaStatus }) {
  const styles = statusStyles[status];

  return (
    <View className={cn('flex-row items-center gap-1 rounded-full px-2 py-1', styles.className)}>
      <View className={cn('h-1.5 w-1.5 rounded-full', styles.dotClassName)} />
      <Text className={cn('text-[10px] font-semibold', styles.textClassName)}>{styles.label}</Text>
    </View>
  );
}

function AgendaCard({
  appointment,
  onOpenAppointmentDetails,
}: {
  appointment: AgendaAppointment;
  onOpenAppointmentDetails: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Abrir detalhes de ${appointment.procedure}`}
      accessibilityRole="button"
      className="rounded-2xl bg-card shadow-sm shadow-black/10"
      onPress={onOpenAppointmentDetails}
    >
      <View className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <View className="absolute bottom-0 left-0 top-0 w-1.5 bg-blue-900 dark:bg-blue-700" />

        <View className="min-h-[112px] flex-row pl-1.5">
          <View className="w-[82px] items-center justify-center bg-blue-50 px-2 py-5 dark:bg-blue-950/30">
            <Text className="text-xs font-bold text-blue-900 dark:text-blue-300">{appointment.weekday}</Text>
            <Text className="text-3xl font-bold leading-9 text-blue-900 dark:text-blue-300">{appointment.day}</Text>
            <Text className="text-xs text-muted-foreground">{appointment.time}</Text>
          </View>

          <View className="flex-1 gap-2.5 px-5 py-5">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="flex-1 text-lg font-bold leading-6 text-foreground">{appointment.procedure}</Text>
              <StatusBadge status={appointment.status} />
            </View>

            <View className="flex-row items-start gap-2">
              <UserRound color="#64748b" size={14} />
              <Text className="flex-1 text-sm leading-5 text-muted-foreground">{appointment.dentist}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function MyAgendaScreen({
  onOpenAppointmentDetails,
  onOpenSettings,
  onSelectTab,
  selectedTab,
}: MyAgendaScreenProps) {
  const octoberAppointments = appointments.filter((appointment) => appointment.month === 'october');
  const novemberAppointments = appointments.filter((appointment) => appointment.month === 'november');
  const historyOctoberAppointments = historyAppointments.filter((appointment) => appointment.month === 'october');
  const historyNovemberAppointments = historyAppointments.filter((appointment) => appointment.month === 'november');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BrandHeader onOpenSettings={onOpenSettings} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="gap-1">
          <Text className="text-3xl font-bold text-foreground">Minha Agenda</Text>
          <Text className="text-sm leading-5 text-muted-foreground">Acompanhe suas consultas e tratamentos.</Text>
        </View>

        <View className="mt-5 flex-row rounded-xl bg-blue-50 p-1 dark:bg-blue-950/30">
          {agendaTabs.map((tab) => {
            const isSelected = selectedTab === tab.value;

            return (
              <Pressable
                accessibilityLabel={`Ver ${tab.label.toLowerCase()}`}
                accessibilityRole="button"
                className={cn('h-11 flex-1 items-center justify-center rounded-lg', isSelected && 'bg-card shadow-sm')}
                key={tab.value}
                onPress={() => onSelectTab(tab.value)}
              >
                <Text className={cn('text-sm font-bold', isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-foreground')}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedTab === 'history' ? (
          <View className="mt-6 gap-6">
            <View className="gap-3">
              <Text className="text-xs font-semibold uppercase text-muted-foreground">Outubro 2023</Text>
              {historyOctoberAppointments.map((appointment) => (
                <AgendaCard
                  appointment={appointment}
                  key={appointment.id}
                  onOpenAppointmentDetails={onOpenAppointmentDetails}
                />
              ))}
            </View>

            <View className="gap-3">
              <Text className="text-xs font-semibold uppercase text-muted-foreground">Novembro 2023</Text>
              {historyNovemberAppointments.map((appointment) => (
                <AgendaCard
                  appointment={appointment}
                  key={appointment.id}
                  onOpenAppointmentDetails={onOpenAppointmentDetails}
                />
              ))}
            </View>
          </View>
        ) : (
          <View className="mt-6 gap-6">
            <View className="gap-3">
              <Text className="text-xs font-semibold uppercase text-muted-foreground">Outubro 2023</Text>
              {octoberAppointments.map((appointment) => (
                <AgendaCard
                  appointment={appointment}
                  key={appointment.id}
                  onOpenAppointmentDetails={onOpenAppointmentDetails}
                />
              ))}
            </View>

            <View className="gap-3">
              <Text className="text-xs font-semibold uppercase text-muted-foreground">Novembro 2023</Text>
              {novemberAppointments.map((appointment) => (
                <AgendaCard
                  appointment={appointment}
                  key={appointment.id}
                  onOpenAppointmentDetails={onOpenAppointmentDetails}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
