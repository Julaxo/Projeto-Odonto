import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Settings,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAppointmentsByDay, useCreateAppointment } from '@/hooks/use-appointments';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

type CalendarDay = {
  date: string;
  day: string;
  id: string;
  isMuted: boolean;
  isPast: boolean;
};

type TimeSlot = {
  id: string;
  label: string;
};

const requestAppointmentSchema = z.object({
  date: z.string().min(1, 'Selecione uma data.'),
  description: z.string().max(300, 'Use no maximo 300 caracteres.').optional(),
  slot: z.string().min(1, 'Selecione um horario.'),
});

type RequestAppointmentFormValues = z.infer<typeof requestAppointmentSchema>;

const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

const timeSlots: TimeSlot[] = [
  { id: '09:00', label: '09:00' },
  { id: '09:30', label: '09:30' },
  { id: '10:00', label: '10:00' },
  { id: '10:30', label: '10:30' },
  { id: '11:00', label: '11:00' },
  { id: '14:00', label: '14:00' },
  { id: '14:30', label: '14:30' },
  { id: '15:00', label: '15:00' },
  { id: '15:30', label: '15:30' },
  { id: '16:00', label: '16:00' },
];

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMinutes(time: string, minutesToAdd: number) {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const nextHours = Math.floor(totalMinutes / 60);
  const nextMinutes = totalMinutes % 60;

  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getCalendarDays(monthDate: Date): CalendarDay[] {
  const today = normalizeDate(new Date());
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const normalizedDate = normalizeDate(date);
    const dateKey = formatDateKey(date);

    return {
      date: dateKey,
      day: String(date.getDate()),
      id: dateKey,
      isMuted: date.getMonth() !== month,
      isPast: normalizedDate < today,
    };
  });
}

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

function SectionHeader({
  description,
  icon,
  title,
}: {
  description: string;
  icon: 'calendar' | 'clock';
  title: string;
}) {
  const Icon = icon === 'calendar' ? CalendarDays : Clock3;

  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2">
        <Icon color="#1e3a5f" size={16} />
        <Text className="text-sm font-bold text-foreground">{title}</Text>
      </View>
      <Text className="text-[11px] text-muted-foreground">{description}</Text>
    </View>
  );
}

function CalendarPicker({
  calendarDays,
  monthDate,
  onChangeMonth,
  onSelectDate,
  selectedDate,
}: {
  calendarDays: CalendarDay[];
  monthDate: Date;
  onChangeMonth: (direction: 'next' | 'previous') => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
}) {
  return (
    <View className="gap-3 rounded-2xl bg-card p-3 shadow-sm shadow-black/5">
      <SectionHeader
        description="Escolha o dia que funciona melhor para voce."
        icon="calendar"
        title="Selecione a Data"
      />

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          accessibilityLabel="Mes anterior"
          accessibilityRole="button"
          className="h-8 w-8 items-center justify-center rounded-full"
          onPress={() => onChangeMonth('previous')}
        >
          <ChevronLeft color="#1e3a5f" size={18} />
        </TouchableOpacity>
        <Text className="text-sm font-bold capitalize text-foreground">{getMonthLabel(monthDate)}</Text>
        <TouchableOpacity
          accessibilityLabel="Proximo mes"
          accessibilityRole="button"
          className="h-8 w-8 items-center justify-center rounded-full"
          onPress={() => onChangeMonth('next')}
        >
          <ChevronRight color="#1e3a5f" size={18} />
        </TouchableOpacity>
      </View>

      <View className="flex-row">
        {weekDays.map((weekDay) => (
          <Text className="flex-1 text-center text-[10px] font-semibold text-muted-foreground" key={weekDay}>
            {weekDay}
          </Text>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {calendarDays.map((calendarDay) => {
          const isSelected = calendarDay.date === selectedDate;
          const isDisabled = calendarDay.isMuted || calendarDay.isPast;

          return (
            <TouchableOpacity
              accessibilityLabel={`Selecionar dia ${calendarDay.day}`}
              accessibilityRole="button"
              className="w-[14.285%] items-center py-1"
              disabled={isDisabled}
              key={calendarDay.id}
              onPress={() => onSelectDate(calendarDay.date)}
            >
              <View
                className={cn(
                  'h-8 w-8 items-center justify-center rounded-full',
                  isSelected && 'bg-blue-900 dark:bg-blue-700',
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    isSelected ? 'text-white' : 'text-foreground',
                    isDisabled && 'text-muted-foreground/40',
                  )}
                >
                  {calendarDay.day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row items-center gap-5">
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-blue-100" />
          <Text className="text-[10px] text-muted-foreground">Datas disponiveis</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-zinc-300" />
          <Text className="text-[10px] text-muted-foreground">Indisponiveis</Text>
        </View>
      </View>
    </View>
  );
}

function TimeSlotPicker({
  isLoading,
  occupiedSlots,
  onSelectSlot,
  selectedSlot,
}: {
  isLoading: boolean;
  occupiedSlots: Set<string>;
  onSelectSlot: (slot: string) => void;
  selectedSlot: string;
}) {
  return (
    <View className="gap-3 rounded-2xl bg-card p-3 shadow-sm shadow-black/5">
      <SectionHeader
        description="Horarios ocupados para esta data ficam indisponiveis."
        icon="clock"
        title="Selecione o Horario"
      />

      <View className="flex-row flex-wrap gap-2">
        {timeSlots.map((slot) => {
          const isSelected = slot.id === selectedSlot;
          const isOccupied = occupiedSlots.has(slot.id);

          return (
            <TouchableOpacity
              accessibilityLabel={
                isOccupied ? `Horario ${slot.label} indisponivel` : `Selecionar horario ${slot.label}`
              }
              accessibilityRole="button"
              className={cn(
                'h-9 min-w-[58px] flex-1 basis-[28%] items-center justify-center rounded-lg border',
                isSelected ? 'border-blue-900 bg-blue-900 dark:bg-blue-700' : 'border-border bg-background',
                isOccupied && 'border-zinc-200 bg-zinc-100 opacity-60 dark:bg-zinc-900',
              )}
              disabled={isOccupied || isLoading}
              key={slot.id}
              onPress={() => onSelectSlot(slot.id)}
            >
              <Text
                className={cn(
                  'text-xs font-bold',
                  isSelected ? 'text-white' : 'text-foreground',
                  isOccupied && 'text-muted-foreground',
                )}
              >
                {slot.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function RequestAppointmentScreen() {
  const user = useAuthStore((state) => state.user);
  const today = useMemo(() => normalizeDate(new Date()), []);
  const tomorrow = useMemo(() => {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 1);
    return nextDate;
  }, [today]);
  const [monthDate, setMonthDate] = useState(() => new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
  const createAppointmentMutation = useCreateAppointment();

  const { control, handleSubmit, setValue } = useForm<RequestAppointmentFormValues>({
    defaultValues: {
      date: formatDateKey(tomorrow),
      description: '',
      slot: '09:00',
    },
    resolver: zodResolver(requestAppointmentSchema),
  });

  const selectedDate = useWatch({ control, name: 'date' });
  const selectedSlot = useWatch({ control, name: 'slot' });
  const appointmentsByDayQuery = useAppointmentsByDay(selectedDate);
  const calendarDays = useMemo(() => getCalendarDays(monthDate), [monthDate]);
  const occupiedSlots = useMemo(
    () => new Set((appointmentsByDayQuery.data ?? []).map((appointment) => appointment.horarioInicio)),
    [appointmentsByDayQuery.data],
  );
  const isSelectedSlotOccupied = occupiedSlots.has(selectedSlot);
  const errorMessage = createAppointmentMutation.error
    ? 'Nao foi possivel solicitar o atendimento. Tente novamente.'
    : null;

  function handleChangeMonth(direction: 'next' | 'previous') {
    setMonthDate((current) => {
      const nextMonth = new Date(current);
      nextMonth.setMonth(current.getMonth() + (direction === 'next' ? 1 : -1));
      return nextMonth;
    });
  }

  async function handleRequestAppointment(values: RequestAppointmentFormValues) {
    if (occupiedSlots.has(values.slot)) {
      return;
    }

    const description = values.description?.trim();
    const appointmentId = await createAppointmentMutation.mutateAsync({
      clienteId: user?.id ?? 'paciente-sem-identificacao',
      clienteNome: user?.name ?? 'Paciente',
      dataAgendamento: values.date,
      duracaoMinutos: 30,
      horarioFim: addMinutes(values.slot, 30),
      horarioInicio: values.slot,
      observacoes: description,
      procedimento: description || 'Atendimento odontologico',
      profissionalId: 'dentista-padrao',
      profissionalNome: 'Equipe OdontoLuma',
    });

    router.replace({ pathname: '/appointments/details', params: { id: appointmentId } });
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BrandHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="gap-1">
          <Text className="text-2xl font-bold text-foreground">Solicitar Atendimento</Text>
          <Text className="text-sm leading-5 text-muted-foreground">
            Preencha os dados abaixo conforme sua disponibilidade:
          </Text>
        </View>

        <View className="mt-4 gap-3">
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <CalendarPicker
                calendarDays={calendarDays}
                monthDate={monthDate}
                onChangeMonth={handleChangeMonth}
                onSelectDate={onChange}
                selectedDate={value}
              />
            )}
          />

          <Controller
            control={control}
            name="slot"
            render={({ field: { onChange, value } }) => (
              <TimeSlotPicker
                isLoading={appointmentsByDayQuery.isLoading}
                occupiedSlots={occupiedSlots}
                onSelectSlot={(slot) => {
                  setValue('slot', slot, { shouldValidate: true });
                  onChange(slot);
                }}
                selectedSlot={value}
              />
            )}
          />

          {isSelectedSlotOccupied ? (
            <Text className="text-xs font-semibold text-destructive">
              Este horario ja foi usado para a data selecionada.
            </Text>
          ) : null}

          <Controller
            control={control}
            name="description"
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <Input
                accessibilityLabel="Descricao do procedimento"
                className="h-24 rounded-2xl border-0 bg-blue-50 px-4 py-3 dark:bg-blue-950/30"
                error={error?.message}
                label="Descricao do procedimento:"
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                textAlignVertical="top"
                value={value}
              />
            )}
          />

          {errorMessage ? <Text className="text-xs font-semibold text-destructive">{errorMessage}</Text> : null}

          <Button
            accessibilityLabel="Solicitar atendimento"
            className="mt-1 h-14 rounded-xl bg-blue-900 dark:bg-blue-700"
            disabled={createAppointmentMutation.isPending || isSelectedSlotOccupied}
            onPress={handleSubmit(handleRequestAppointment)}
          >
            <View className="flex-row items-center gap-2">
              <CheckCircle2 color="#ffffff" size={18} />
              <Text className="text-sm font-bold text-white">
                {createAppointmentMutation.isPending ? 'Solicitando...' : 'Solicitar atendimento'}
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
