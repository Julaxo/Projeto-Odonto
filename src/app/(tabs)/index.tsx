import { ScrollView, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import {
  CalendarCheck,
  ClipboardList,
  Clock,
  History,
  MapPin,
  MessageSquare,
  Plus,
  Settings,
} from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store/auth.store';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuickAccessItem {
  id: string;
  label: string;
  icon: React.FC<{ size: number; color: string }>;
  route: string;
  accessibilityLabel: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'exams',
    label: 'Meus Exames',
    icon: ClipboardList,
    route: '/exams',
    accessibilityLabel: 'Acessar meus exames',
  },
  {
    id: 'history',
    label: 'Histórico Clínico',
    icon: History,
    route: '/clinical-history',
    accessibilityLabel: 'Acessar histórico clínico',
  },
  {
    id: 'directions',
    label: 'Como Chegar',
    icon: MapPin,
    route: '/directions',
    accessibilityLabel: 'Ver como chegar à clínica',
  },
  {
    id: 'contact',
    label: 'Fale Conosco',
    icon: MessageSquare,
    route: '/contact',
    accessibilityLabel: 'Falar com a clínica',
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <View
      className="h-11 w-11 items-center justify-center rounded-full bg-teal-600"
      accessibilityLabel={`Avatar de ${name}`}
    >
      <Text className="text-sm font-semibold text-white">{initials}</Text>
    </View>
  );
}

function GreetingHeader({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bom dia,' : hour < 18 ? 'Boa tarde,' : 'Boa noite,';

  return (
    <View className="flex-row items-center justify-between px-4 pb-4 pt-14">
      <View className="flex-row items-center gap-3">
        <UserAvatar name={name} />
        <View>
          <Text className="text-sm text-muted-foreground">{greeting}</Text>
          <Text className="text-xl font-bold text-foreground">{name}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/settings')}
        accessibilityLabel="Abrir configurações"
        accessibilityRole="button"
        className="p-1"
      >
        <Settings size={22} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

function AppointmentStatusBadge({ status }: { status: 'confirmed' | 'pending' | 'cancelled' }) {
  const config = {
    confirmed: {
      label: 'Confirmado',
      className: 'bg-green-100 dark:bg-green-900/40',
      textClassName: 'text-green-700 dark:text-green-400',
    },
    pending: {
      label: 'Pendente',
      className: 'bg-yellow-100 dark:bg-yellow-900/40',
      textClassName: 'text-yellow-700 dark:text-yellow-400',
    },
    cancelled: {
      label: 'Cancelado',
      className: 'bg-red-100 dark:bg-red-900/40',
      textClassName: 'text-red-700 dark:text-red-400',
    },
  } as const;

  const { label, className, textClassName } = config[status];

  return (
    <View className={`flex-row items-center gap-1 self-start rounded-full px-3 py-1 ${className}`}>
      <CalendarCheck size={12} color={status === 'confirmed' ? '#15803d' : status === 'pending' ? '#a16207' : '#b91c1c'} />
      <Text className={`text-xs font-medium ${textClassName}`}>{label}</Text>
    </View>
  );
}

function NextAppointmentCard() {
  // Em produção, substituir por dados do TanStack Query
  const appointment = {
    status: 'confirmed' as const,
    day: '15',
    month: 'OUT',
    procedure: 'Limpeza e Check-up',
    dentist: 'Dra. Camila Barros',
    startTime: '14:30',
    endTime: '15:30',
    id: '1',
  };

  return (
    <View className="mx-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      {/* Left accent bar */}
      <View className="absolute bottom-4 left-0 top-4 w-1 rounded-full bg-blue-900" />

      {/* Header row: badge + date */}
      <View className="mb-3 flex-row items-start justify-between pl-3">
        <AppointmentStatusBadge status={appointment.status} />
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-900 dark:text-blue-400">
            {appointment.day}
          </Text>
          <Text className="text-xs font-semibold uppercase tracking-widest text-blue-900 dark:text-blue-400">
            {appointment.month}
          </Text>
        </View>
      </View>

      {/* Procedure + dentist */}
      <View className="pl-3">
        <Text className="text-lg font-bold text-foreground">{appointment.procedure}</Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">{appointment.dentist}</Text>
      </View>

      {/* Divider */}
      <View className="mx-3 my-3 h-px bg-border" />

      {/* Time + action */}
      <View className="flex-row items-center justify-between pl-3">
        <View className="flex-row items-center gap-2">
          <Clock size={15} color="gray" />
          <Text className="text-sm text-muted-foreground">
            {appointment.startTime} - {appointment.endTime}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/appointments/${appointment.id}` as never)}
          accessibilityLabel="Ver detalhes da consulta"
          accessibilityRole="button"
        >
          <Text className="text-sm font-semibold text-blue-700 dark:text-blue-400">
            Ver detalhes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RequestAppointmentButton() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/appointments/new' as never)}
      accessibilityLabel="Solicitar novo atendimento"
      accessibilityRole="button"
      activeOpacity={0.85}
      className="mx-4 flex-row items-center justify-center gap-2 rounded-2xl bg-blue-900 py-4"
    >
      <Plus size={20} color="white" strokeWidth={2.5} />
      <Text className="text-base font-semibold text-white">Solicitar Novo Atendimento</Text>
    </TouchableOpacity>
  );
}

function QuickAccessGrid() {
  return (
    <View className="px-4">
      <Text className="mb-3 text-lg font-bold text-foreground">Acesso Rápido</Text>
      <View className="flex-row flex-wrap gap-3">
        {QUICK_ACCESS_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route as never)}
              accessibilityLabel={item.accessibilityLabel}
              accessibilityRole="button"
              activeOpacity={0.75}
              className="w-[47%] rounded-2xl border border-border bg-card p-4"
            >
              <View className="mb-3 h-11 w-11 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                <Icon size={22} color="#1e3a5f" />
              </View>
              <Text className="text-sm font-semibold text-foreground">{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name ?? 'Paciente';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <GreetingHeader name={displayName} />

      {/* Next appointment */}
      <View className="mb-5">
        <NextAppointmentCard />
      </View>

      {/* CTA */}
      <View className="mb-6">
        <RequestAppointmentButton />
      </View>

      {/* Quick access */}
      <QuickAccessGrid />
    </ScrollView>
  );
}