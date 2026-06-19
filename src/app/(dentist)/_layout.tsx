import { Redirect, Tabs } from 'expo-router';
import { CalendarDays, ClipboardList, Home, User } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/features/auth/hooks/use-auth';

export default function DentistTabsLayout() {
  const { isAuthenticated, isLoading, role } = useAuth();

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

  if (role !== 'dentist') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="requests/index"
        options={{
          tabBarAccessibilityLabel: 'Solicitacoes',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
          title: 'Solicitacoes',
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          tabBarAccessibilityLabel: 'Minha agenda',
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
          title: 'Agenda',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          title: 'Perfil',
        }}
      />
      <Tabs.Screen
        name="requests/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
