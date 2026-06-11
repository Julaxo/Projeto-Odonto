import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { MOCK_APPOINTMENTS } from '@/constants/appointments';
import { AppointmentCard } from '@/features/dashboard/components/appointment-card';

export default function AppointmentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-4 px-5 py-6">
        <View>
          <Text variant="caption">Agenda</Text>
          <Text variant="title">Consultas de hoje</Text>
        </View>
        <FlashList
          ItemSeparatorComponent={() => <View className="h-3" />}
          data={MOCK_APPOINTMENTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppointmentCard appointment={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
