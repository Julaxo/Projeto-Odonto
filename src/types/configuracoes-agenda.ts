/**
 * Configurações gerais da agenda
 */
export interface ConfiguracoesAgenda {
  id: string;
  diasFuncionamento: Record<number, DiaFuncionamento>; // Chaves 0-6 para dias da semana
}

/**
 * Configuração de funcionamento para um dia específico (0 = domingo até 6 = sábado)
 */
export interface DiaFuncionamento {
  aberto: boolean;
  inicio: string; // Ex: "09:00"
  fim: string; // Ex: "18:00"
}
