import { RefreshCw, Settings, UserRound } from "lucide-react-native";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { usePatientAppointments } from "@/hooks/use-appointments";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import {
  type AgendamentoData,
  type AgendamentoStatus,
} from "@/types/appointment";

type AgendaStatus = "cancelled" | "confirmed" | "pending";

type AgendaAppointment = {
  day: string;
  dentist: string;
  id: string;
  monthLabel: string;
  procedure: string;
  sortKey: string;
  status: AgendaStatus;
  time: string;
  weekday: string;
};

type AgendaSection = {
  appointments: AgendaAppointment[];
  title: string;
};

type AgendaTab = "upcoming" | "history";

type MyAgendaScreenProps = {
  onOpenAppointmentDetails: (appointmentId: string) => void;
  onOpenSettings: () => void;
  onSelectTab: (tab: AgendaTab) => void;
  selectedTab: AgendaTab;
};

const agendaTabs: { label: string; value: AgendaTab }[] = [
  { label: "Proximas", value: "upcoming" },
  { label: "Historico", value: "history" },
];

const statusStyles: Record<
  AgendaStatus,
  {
    className: string;
    dotClassName: string;
    label: string;
    textClassName: string;
  }
> = {
  cancelled: {
    className: "bg-red-100 dark:bg-red-950",
    dotClassName: "bg-red-600",
    label: "Cancelada",
    textClassName: "text-red-700 dark:text-red-300",
  },
  confirmed: {
    className: "bg-teal-100 dark:bg-teal-950",
    dotClassName: "bg-teal-600",
    label: "Confirmada",
    textClassName: "text-teal-700 dark:text-teal-300",
  },
  pending: {
    className: "bg-amber-100 dark:bg-amber-950",
    dotClassName: "bg-amber-500",
    label: "Aguardando Confirmacao",
    textClassName: "text-amber-700 dark:text-amber-300",
  },
};

function mapStatus(status: AgendamentoStatus): AgendaStatus {
  if (status === "CONFIRMADO") {
    return "confirmed";
  }

  if (status === "CANCELADO") {
    return "cancelled";
  }

  return "pending";
}

function getAppointmentDate(appointment: AgendamentoData) {
  return new Date(
    `${appointment.dataAgendamento}T${appointment.horarioInicio}:00`,
  );
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function toAgendaAppointment(appointment: AgendamentoData): AgendaAppointment {
  const date = getAppointmentDate(appointment);

  return {
    day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date),
    dentist: appointment.profissionalNome ?? "Equipe OdontoLuma",
    id: appointment.id,
    monthLabel: formatMonthLabel(date),
    procedure: appointment.procedimento,
    sortKey: `${appointment.dataAgendamento}T${appointment.horarioInicio}`,
    status: mapStatus(appointment.status),
    time: appointment.horarioInicio,
    weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
      .format(date)
      .replace(".", "")
      .toUpperCase(),
  };
}

function groupAppointments(appointments: AgendaAppointment[]): AgendaSection[] {
  const sections = new Map<string, AgendaAppointment[]>();

  const sortedAppointments = [...appointments].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  sortedAppointments.forEach((appointment) => {
    const section = sections.get(appointment.monthLabel) ?? [];
    section.push(appointment);
    sections.set(appointment.monthLabel, section);
  });

  return Array.from(sections.entries()).map(([title, sectionAppointments]) => ({
    appointments: sectionAppointments,
    title,
  }));
}

function BrandHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-border bg-background px-4 pb-3 pt-4">
      <View className="flex-row items-center gap-3">
        <View
          accessibilityLabel="Avatar OdontoLuma"
          className="h-10 w-10 items-center justify-center rounded-full bg-teal-600"
        >
          <Text className="text-xs font-bold text-white">OL</Text>
        </View>
        <Text className="text-xl font-bold text-blue-900 dark:text-blue-300">
          OdontoLuma
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Abrir configuracoes"
        accessibilityRole="button"
        className="p-1"
        onPress={onOpenSettings}
      >
        <Settings color="#334155" size={22} />
      </Pressable>
    </View>
  );
}

function StatusBadge({ status }: { status: AgendaStatus }) {
  const styles = statusStyles[status];

  return (
    <View
      className={cn(
        "flex-row items-center gap-1 rounded-full px-2 py-1",
        styles.className,
      )}
    >
      <View className={cn("h-1.5 w-1.5 rounded-full", styles.dotClassName)} />
      <Text className={cn("text-[10px] font-semibold", styles.textClassName)}>
        {styles.label}
      </Text>
    </View>
  );
}

function AgendaCard({
  appointment,
  onOpenAppointmentDetails,
}: {
  appointment: AgendaAppointment;
  onOpenAppointmentDetails: (appointmentId: string) => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Abrir detalhes de ${appointment.procedure}`}
      accessibilityRole="button"
      className="rounded-2xl bg-card shadow-sm shadow-black/10"
      onPress={() => onOpenAppointmentDetails(appointment.id)}
    >
      <View className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <View className="absolute bottom-0 left-0 top-0 w-1.5 bg-blue-900 dark:bg-blue-700" />

        <View className="min-h-[112px] flex-row pl-1.5">
          <View className="w-[82px] items-center justify-center bg-blue-50 px-2 py-5 dark:bg-blue-950/30">
            <Text className="text-xs font-bold text-blue-900 dark:text-blue-300">
              {appointment.weekday}
            </Text>
            <Text className="text-3xl font-bold leading-9 text-blue-900 dark:text-blue-300">
              {appointment.day}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {appointment.time}
            </Text>
          </View>

          <View className="flex-1 gap-2.5 px-5 py-5">
            <View className="flex-row items-start justify-between gap-2">
              <Text className="flex-1 text-lg font-bold leading-6 text-foreground">
                {appointment.procedure}
              </Text>
              <StatusBadge status={appointment.status} />
            </View>

            <View className="flex-row items-start gap-2">
              <UserRound color="#64748b" size={14} />
              <Text className="flex-1 text-sm leading-5 text-muted-foreground">
                {appointment.dentist}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState({ selectedTab }: { selectedTab: AgendaTab }) {
  return (
    <View className="mt-6 rounded-2xl border border-border bg-card p-5">
      <Text className="text-sm font-semibold text-foreground">
        {selectedTab === "history"
          ? "Nenhum historico encontrado."
          : "Nenhuma consulta encontrada."}
      </Text>
      <Text className="mt-1 text-sm text-muted-foreground">
        {selectedTab === "history"
          ? "Quando houver atendimentos finalizados, eles aparecerao aqui."
          : "Toque em atualizar para buscar novamente sua agenda."}
      </Text>
    </View>
  );
}

export function MyAgendaScreen({
  onOpenAppointmentDetails,
  onOpenSettings,
  onSelectTab,
  selectedTab,
}: MyAgendaScreenProps) {
  const userId = useAuthStore((state) => state.user?.id);
  const agendaQuery = usePatientAppointments(userId);
  const appointments = useMemo(
    () => agendaQuery.data ?? [],
    [agendaQuery.data],
  );
  const filteredAppointments = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    if (selectedTab === "history") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.dataAgendamento >= today,
    );
  }, [appointments, selectedTab]);
  const agendaAppointments = useMemo(
    () => filteredAppointments.map(toAgendaAppointment),
    [filteredAppointments],
  );
  const agendaSections = useMemo(
    () => groupAppointments(agendaAppointments),
    [agendaAppointments],
  );
  const isRefreshing = agendaQuery.isFetching && !agendaQuery.isLoading;

  async function handleRefreshAgenda() {
    await agendaQuery.refetch();
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BrandHeader onOpenSettings={onOpenSettings} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-3xl font-bold text-foreground">
                Minha Agenda
              </Text>
              <Text className="text-sm leading-5 text-muted-foreground">
                Acompanhe suas consultas e tratamentos.
              </Text>
            </View>

            <Button
              accessibilityLabel="Atualizar minha agenda"
              className="h-10 rounded-xl border-blue-900 px-3 dark:border-blue-700"
              disabled={agendaQuery.isFetching}
              onPress={handleRefreshAgenda}
              size="sm"
              variant="outline"
            >
              <View className="flex-row items-center gap-2">
                {isRefreshing ? (
                  <ActivityIndicator color="#1e3a5f" size="small" />
                ) : (
                  <RefreshCw color="#1e3a5f" size={15} />
                )}
                <Text className="text-xs font-bold text-blue-900 dark:text-blue-300">
                  {isRefreshing ? "Atualizando" : "Atualizar"}
                </Text>
              </View>
            </Button>
          </View>

          {agendaQuery.error ? (
            <View className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
              <Text
                accessibilityRole="alert"
                className="text-sm font-medium text-destructive"
              >
                Nao foi possivel carregar sua agenda. Tente atualizar novamente.
              </Text>
            </View>
          ) : null}
        </View>

        <View className="mt-5 flex-row rounded-xl bg-blue-50 p-1 dark:bg-blue-950/30">
          {agendaTabs.map((tab) => {
            const isSelected = selectedTab === tab.value;

            return (
              <Pressable
                accessibilityLabel={`Ver ${tab.label.toLowerCase()}`}
                accessibilityRole="button"
                className={cn(
                  "h-11 flex-1 items-center justify-center rounded-lg",
                  isSelected && "bg-card shadow-sm",
                )}
                key={tab.value}
                onPress={() => onSelectTab(tab.value)}
              >
                <Text
                  className={cn(
                    "text-sm font-bold",
                    isSelected
                      ? "text-blue-900 dark:text-blue-300"
                      : "text-foreground",
                  )}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {agendaQuery.isLoading ? (
          <View className="mt-8 items-center gap-3">
            <ActivityIndicator color="#1e3a5f" />
            <Text className="text-sm text-muted-foreground">
              Carregando agenda...
            </Text>
          </View>
        ) : agendaSections.length === 0 ? (
          <EmptyState selectedTab={selectedTab} />
        ) : (
          <View className="mt-6 gap-6">
            {agendaSections.map((section) => (
              <View className="gap-3" key={section.title}>
                <Text className="text-xs font-semibold uppercase text-muted-foreground">
                  {section.title}
                </Text>
                {section.appointments.map((appointment) => (
                  <AgendaCard
                    appointment={appointment}
                    key={appointment.id}
                    onOpenAppointmentDetails={onOpenAppointmentDetails}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
