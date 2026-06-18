import { Text, View } from 'react-native';

import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/types/dentist';

/**
 * Badge de status de um agendamento. Usa só os tokens de cor que existem
 * de fato em `tailwind.config.js` (primary, muted, destructive, border) —
 * o projeto não tem tokens semânticos de amber/emerald/red, então
 * diferenciamos os três estados com variações de opacidade/borda em vez
 * de cores novas.
 */
const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: 'Aguardando confirmação',
  confirmed: 'Confirmada',
  declined: 'Recusada',
};

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  pending: 'border border-border bg-muted/20',
  confirmed: 'bg-primary/15',
  declined: 'bg-destructive/15',
};

const STATUS_TEXT_CLASSES: Record<AppointmentStatus, string> = {
  pending: 'text-muted-foreground',
  confirmed: 'text-primary',
  declined: 'text-destructive',
};

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  return (
    <View
      className={cn('rounded-full px-2.5 py-1', STATUS_CLASSES[status])}
      accessibilityRole="text"
      accessibilityLabel={STATUS_LABEL[status]}
    >
      <Text className={cn('text-xs font-medium', STATUS_TEXT_CLASSES[status])}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}
