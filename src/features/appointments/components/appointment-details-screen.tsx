import { router } from 'expo-router';
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  Settings,
} from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

function BrandHeader() {
  return (
    <View className="flex-row items-center justify-between border-b border-border bg-background px-4 pb-3 pt-4">
      <View className="flex-row items-center gap-3">
        <View
          accessibilityLabel="Avatar OdontoLuma"
          className="h-10 w-10 items-center justify-center rounded-full bg-teal-600"
        >
          <Text className="text-xs font-bold text-white">OL</Text>
        </View>
        <Text className="text-xl font-bold text-blue-900 dark:text-blue-300">OdontoLuma</Text>
      </View>

      <TouchableOpacity
        accessibilityLabel="Abrir configuracoes"
        accessibilityRole="button"
        className="p-1"
        onPress={() => router.push('/settings')}
      >
        <Settings color="#334155" size={22} />
      </TouchableOpacity>
    </View>
  );
}

function PendingBadge() {
  return (
    <View className="self-start rounded-full bg-amber-100 px-3 py-1 dark:bg-amber-950">
      <Text className="text-xs font-bold text-amber-700 dark:text-amber-300">Aguardando Confirmacao</Text>
    </View>
  );
}

function SuggestedAppointmentCard() {
  return (
    <View className="overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/10">
      <View className="flex-row">
        <View className="w-1.5 bg-blue-900 dark:bg-blue-700" />
        <View className="flex-1 gap-4 p-5">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-2xl font-bold text-foreground">15 de Novembro</Text>
              <Text className="text-xl font-semibold text-blue-900 dark:text-blue-300">14:30 - 15:30</Text>
            </View>
            <PendingBadge />
          </View>

          <View className="h-px bg-border" />

          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-950">
              <CalendarCheck color="#0f766e" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">Dr. Roberto Silva</Text>
              <View className="mt-1 flex-row items-center gap-1">
                <MapPin color="#64748b" size={14} />
                <Text className="text-sm text-muted-foreground">Sala 3 - Especialidades</Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
            <Clock3 color="#64748b" size={18} />
            <Text className="flex-1 text-xs leading-5 text-muted-foreground">
              Duracao estimada do procedimento: <Text className="text-xs font-bold text-foreground">60 minutos</Text>.
              Recomendamos chegar 10 minutos antes.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function AppointmentDetailsScreen() {
  function handleGoBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/appointments');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BrandHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          accessibilityLabel="Voltar para solicitacao de atendimento"
          accessibilityRole="button"
          className="mb-4 flex-row items-center gap-2 self-start"
          onPress={handleGoBack}
        >
          <ArrowLeft color="#1e3a5f" size={18} />
          <Text className="text-sm font-bold text-blue-900 dark:text-blue-300">Voltar</Text>
        </TouchableOpacity>

        <View className="mb-4 flex-row gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <Info color="#1e3a5f" size={20} />
          <View className="flex-1 gap-1">
            <Text className="text-sm font-bold text-blue-900 dark:text-blue-300">A clinica sugeriu este horario</Text>
            <Text className="text-sm leading-5 text-muted-foreground">
              Por favor, confirme se este horario funciona para voce ou solicite uma alteracao.
            </Text>
          </View>
        </View>

        <SuggestedAppointmentCard />

        <View className="mt-7 gap-4">
          <Button
            accessibilityLabel="Confirmar horario sugerido"
            className="h-14 rounded-xl bg-blue-900 dark:bg-blue-700"
          >
            <View className="flex-row items-center gap-2">
              <CheckCircle2 color="#ffffff" size={18} />
              <Text className="text-sm font-bold text-white">Confirmar Horario</Text>
            </View>
          </Button>

          <Button
            accessibilityLabel="Solicitar alteracao de horario"
            className="h-14 rounded-xl border-blue-900 dark:border-blue-700"
            variant="outline"
          >
            <View className="flex-row items-center gap-2">
              <CalendarCheck color="#1e3a5f" size={18} />
              <Text className="text-sm font-bold text-blue-900 dark:text-blue-300">Solicitar Alteracao</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
