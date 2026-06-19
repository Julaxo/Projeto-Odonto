import { useRouter } from 'expo-router';

import { MyAgendaScreen } from '@/features/appointments/components/my-agenda-screen';

export default function AppointmentsScreen() {
  const router = useRouter();

  return (
    <MyAgendaScreen
      onOpenAppointmentDetails={(id) => router.push({ pathname: '/appointments/details', params: { id } })}
      onOpenSettings={() => router.push('/settings')}
      onSelectTab={(tab) => {
        if (tab === 'history') {
          router.push('/(tabs)/appointments-history');
          return;
        }

        router.push('/(tabs)/appointments');
      }}
      selectedTab="upcoming"
    />
  );
}
