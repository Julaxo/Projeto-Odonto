import { Redirect, Tabs } from 'expo-router';
import { Bell, CalendarDays, Home, UserRound } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator, View } from 'react-native';

import { NAV_THEME } from '@/constants/theme';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function TabLayout() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#1e3a5f" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (role === 'dentist') {
    return <Redirect href="/(dentist)" />;
  }

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
          title: 'Schedule',
        }}
      />
      <Tabs.Screen
        name="appointments-history"
        options={{
          href: null,
          title: 'Historico',
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ color }) => <Bell accessibilityLabel="Aba alertas" color={color} size={22} />,
          title: 'Alerts',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <UserRound accessibilityLabel="Aba perfil" color={color} size={22} />,
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
