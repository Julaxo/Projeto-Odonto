import { useMemo } from 'react';
import { SectionList, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { AppointmentStatusBadge } from '@/features/dentist/components/appointment-status-badge';
import { getConfirmedAppointments, mockDentistAppointments } from '@/features/dentist/mock-data';
import type { DentistAppointment } from '@/types/dentist';

const MONTH_LABELS = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
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
  title: string;
  data: DentistAppointment[];
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

  return Array.from(sections.entries()).map(([title, data]) => ({ title, data }));
}

/**
 * Tela "Minha Agenda" do dentista: só os agendamentos já confirmados,
 * agrupados por mês. Renderizada pela rota `/(dentist)/agenda`.
 */
export function DentistAgendaScreen() {
  const sections = useMemo(() => groupByMonth(getConfirmedAppointments(mockDentistAppointments)), []);

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-semibold text-foreground">Minha agenda</Text>
      <Text className="mb-4 text-sm text-muted-foreground">Acompanhe suas consultas confirmadas</Text>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text className="mb-2 mt-1 text-xs font-medium text-muted-foreground">{section.title}</Text>
        )}
        ListEmptyComponent={
          <Card>
            <Text className="text-sm text-muted-foreground">Nenhuma consulta confirmada ainda.</Text>
          </Card>
        }
        renderItem={({ item }) => {
          const day = item.date.split('-')[2];
          return (
            <Card className="mb-3 flex-row gap-3">
              <View className="items-center justify-center">
                <Text className="text-lg font-semibold text-foreground">{day}</Text>
                <Text className="text-xs text-muted-foreground">{item.startTime}</Text>
              </View>
              <View className="flex-1 gap-1">
                <View className="flex-row items-start justify-between">
                  <Text className="text-base font-semibold text-foreground">{item.procedure}</Text>
                  <AppointmentStatusBadge status={item.status} />
                </View>
                <Text className="text-sm text-muted-foreground">{item.patient.name}</Text>
                {item.room ? <Text className="text-xs text-muted-foreground">{item.room}</Text> : null}
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}
