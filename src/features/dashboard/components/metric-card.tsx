import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

type MetricCardProps = {
  label: string;
  value: string;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card className="flex-1 gap-1">
      <Text variant="caption">{label}</Text>
      <Text className="text-3xl font-bold text-foreground">{value}</Text>
    </Card>
  );
}
