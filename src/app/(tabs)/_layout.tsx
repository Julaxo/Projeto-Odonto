import { CalendarDays, Home } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { NAV_THEME } from '@/constants/theme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: NAV_THEME[scheme].primary,
        tabBarInactiveTintColor: NAV_THEME[scheme].muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home accessibilityLabel="Aba inicio" color={color} size={22} />,
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          tabBarIcon: ({ color }) => <CalendarDays accessibilityLabel="Aba agenda" color={color} size={22} />,
          title: 'Agenda',
        }}
      />
    </Tabs>
  );
}
