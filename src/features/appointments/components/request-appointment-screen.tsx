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
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type CalendarDay = {
  day: string;
  id: string;
  isMuted?: boolean;
};

type TimeSlot = {
  id: string;
  label: string;
};

const requestAppointmentSchema = z.object({
  day: z.string().min(1),
  description: z.string().max(300, 'Use no maximo 300 caracteres.').optional(),
  slot: z.string().min(1),
});

type RequestAppointmentFormValues = z.infer<typeof requestAppointmentSchema>;

const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

const calendarDays: CalendarDay[] = [
  { day: '29', id: 'prev-29', isMuted: true },
  { day: '30', id: 'prev-30', isMuted: true },
  { day: '31', id: 'prev-31', isMuted: true },
  { day: '1', id: 'nov-01' },
  { day: '2', id: 'nov-02' },
  { day: '3', id: 'nov-03' },
  { day: '4', id: 'nov-04' },
  { day: '5', id: 'nov-05' },
  { day: '6', id: 'nov-06' },
  { day: '7', id: 'nov-07' },
  { day: '8', id: 'nov-08' },
  { day: '9', id: 'nov-09' },
  { day: '10', id: 'nov-10' },
  { day: '11', id: 'nov-11' },
  { day: '12', id: 'nov-12' },
  { day: '13', id: 'nov-13' },
  { day: '14', id: 'nov-14' },
  { day: '15', id: 'nov-15' },
  { day: '16', id: 'nov-16' },
  { day: '17', id: 'nov-17' },
  { day: '18', id: 'nov-18' },
  { day: '19', id: 'nov-19' },
  { day: '20', id: 'nov-20' },
  { day: '21', id: 'nov-21' },
  { day: '22', id: 'nov-22' },
  { day: '23', id: 'nov-23' },
  { day: '24', id: 'nov-24' },
  { day: '25', id: 'nov-25' },
  { day: '26', id: 'nov-26' },
  { day: '27', id: 'nov-27' },
  { day: '28', id: 'nov-28' },
  { day: '29', id: 'nov-29' },
  { day: '30', id: 'nov-30' },
  { day: '1', id: 'next-01', isMuted: true },
  { day: '2', id: 'next-02', isMuted: true },
];

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
  onSelectDay,
  selectedDay,
}: {
  onSelectDay: (day: string) => void;
  selectedDay: string;
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
        >
          <ChevronLeft color="#1e3a5f" size={18} />
        </TouchableOpacity>
        <Text className="text-sm font-bold text-foreground">Novembro 2023</Text>
        <TouchableOpacity
          accessibilityLabel="Proximo mes"
          accessibilityRole="button"
          className="h-8 w-8 items-center justify-center rounded-full"
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
          const isSelected = calendarDay.day === selectedDay && !calendarDay.isMuted;

          return (
            <TouchableOpacity
              accessibilityLabel={`Selecionar dia ${calendarDay.day}`}
              accessibilityRole="button"
              className="w-[14.285%] items-center py-1"
              disabled={calendarDay.isMuted}
              key={calendarDay.id}
              onPress={() => onSelectDay(calendarDay.day)}
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
                    calendarDay.isMuted && 'text-muted-foreground/40',
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
  onSelectSlot,
  selectedSlot,
}: {
  onSelectSlot: (slot: string) => void;
  selectedSlot: string;
}) {
  return (
    <View className="gap-3 rounded-2xl bg-card p-3 shadow-sm shadow-black/5">
      <SectionHeader
        description="Escolha um horario disponivel para o dia selecionado."
        icon="clock"
        title="Selecione o Horario"
      />

      <View className="flex-row flex-wrap gap-2">
        {timeSlots.map((slot) => {
          const isSelected = slot.id === selectedSlot;

          return (
            <TouchableOpacity
              accessibilityLabel={`Selecionar horario ${slot.label}`}
              accessibilityRole="button"
              className={cn(
                'h-9 min-w-[58px] flex-1 basis-[28%] items-center justify-center rounded-lg border',
                isSelected ? 'border-blue-900 bg-blue-900 dark:bg-blue-700' : 'border-border bg-background',
              )}
              key={slot.id}
              onPress={() => onSelectSlot(slot.id)}
            >
              <Text className={cn('text-xs font-bold', isSelected ? 'text-white' : 'text-foreground')}>
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
  const { control, handleSubmit } = useForm<RequestAppointmentFormValues>({
    defaultValues: {
      day: '15',
      description: '',
      slot: '10:00',
    },
    resolver: zodResolver(requestAppointmentSchema),
  });

  function handleRequestAppointment() {
    router.push('/appointments/details');
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
            name="day"
            render={({ field: { onChange, value } }) => (
              <CalendarPicker onSelectDay={onChange} selectedDay={value} />
            )}
          />

          <Controller
            control={control}
            name="slot"
            render={({ field: { onChange, value } }) => (
              <TimeSlotPicker onSelectSlot={onChange} selectedSlot={value} />
            )}
          />

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

          <Button
            accessibilityLabel="Solicitar atendimento"
            className="mt-1 h-14 rounded-xl bg-blue-900 dark:bg-blue-700"
            onPress={handleSubmit(handleRequestAppointment)}
          >
            <View className="flex-row items-center gap-2">
              <CheckCircle2 color="#ffffff" size={18} />
              <Text className="text-sm font-bold text-white">Solicitar atendimento</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
