import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { type Appointment, type AppointmentStatus } from '@/types/appointment';

type AppointmentCardProps = {
  appointment: Appointment;
};

const statusLabel: Record<AppointmentStatus, string> = {
  cancelled: 'Cancelada',
  completed: 'Finalizada',
  confirmed: 'Confirmada',
  pending: 'Pendente',
};

const statusClassName: Record<AppointmentStatus, string> = {
  cancelled: 'bg-destructive text-destructive-foreground',
  completed: 'bg-secondary text-secondary-foreground',
  confirmed: 'bg-accent text-accent-foreground',
  pending: 'bg-muted text-muted-foreground',
};

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const startsAt = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(appointment.startsAt));

  return (
    <Card className="gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="font-semibold">{appointment.patientName}</Text>
          <Text variant="muted">{appointment.procedure}</Text>
        </View>
        <Text className="font-semibold text-primary">{startsAt}</Text>
      </View>
      <View className="self-start overflow-hidden rounded-sm">
        <Text className={`px-2 py-1 text-xs font-semibold ${statusClassName[appointment.status]}`}>
          {statusLabel[appointment.status]}
        </Text>
      </View>
    </Card>
  );
}
