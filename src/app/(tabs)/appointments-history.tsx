import { useRouter } from 'expo-router';

import { MyAgendaScreen } from '@/features/appointments/components/my-agenda-screen';

export default function AppointmentsHistoryScreen() {
  const router = useRouter();

  return (
    <MyAgendaScreen
      onOpenAppointmentDetails={() => router.push('/appointments/details')}
      onOpenSettings={() => router.push('/settings')}
      onSelectTab={(tab) => {
        if (tab === 'upcoming') {
          router.push('/(tabs)/appointments');
          return;
        }

        router.push('/(tabs)/appointments-history');
      }}
      selectedTab="history"
    />
  );
}
