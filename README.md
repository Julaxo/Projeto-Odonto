# Dentista Mobile

Aplicativo mobile para pacientes de uma clinica odontologica, construido com Expo, React Native, Expo Router e TypeScript.

O estado atual do app possui home do paciente, agenda do paciente, solicitacao de atendimento integrada ao Firestore, telas do dentista, login com escolha de perfil, configuracoes, tema claro/escuro e componentes reutilizaveis.

## Stack

- Expo SDK 56
- React Native 0.85
- React 19
- Expo Router
- TypeScript
- NativeWind
- React Native Reusables como padrao visual dos componentes
- React Hook Form
- Zod
- Zustand
- TanStack Query
- Axios
- Firebase Auth
- Reanimated
- Lucide React Native
- Shopify FlashList

## Estrutura de Pastas

```txt
src/
|-- app/
|   |-- (auth)/
|   |-- (dentist)/
|   |-- (tabs)/
|   |-- appointments/
|   |-- profile/
|   `-- settings/
|-- components/
|   |-- shared/
|   `-- ui/
|-- constants/
|-- features/
|   |-- appointments/
|   |-- auth/
|   |-- dentist/
|   `-- dashboard/
|-- hooks/
|-- lib/
|-- services/
|-- store/
`-- types/
```

## Rotas e Telas

As rotas sao gerenciadas pelo Expo Router em `src/app`.

- `/(tabs)` - grupo principal do paciente com navegacao por abas protegida por autenticacao
- `/(dentist)` - grupo de telas do dentista protegido por autenticacao e perfil `dentist`
- `/(tabs)/index` - home do paciente com proxima consulta, CTA de solicitacao e acesso rapido
- `/(tabs)/appointments` - tela Schedule com Minha Agenda, proximas consultas e historico
- `/(tabs)/appointments-history` - rota oculta da tab bar para exibir o Historico dentro do fluxo Schedule
- `/(tabs)/alerts` - tela de alertas do paciente
- `/(tabs)/profile` - perfil do paciente na navegacao por abas
- `/(dentist)/index` - home do dentista com resumo de solicitacoes e proximo atendimento
- `/(dentist)/requests` - lista de solicitacoes pendentes do dentista
- `/(dentist)/requests/[id]` - detalhes de uma solicitacao para confirmar ou recusar
- `/(dentist)/agenda` - agenda do dentista
- `/(dentist)/profile` - perfil do dentista
- `/appointments/new` - solicitacao de atendimento com data, horario e descricao, criando agendamento pendente no Firestore
- `/appointments/details` - detalhes do horario sugerido pela clinica, com confirmacao ou solicitacao de alteracao
- `/(auth)/sign-in` - tela de acesso profissional
- `/profile` - tela de perfil profissional existente
- `/settings` - tela de configuracoes
- `+not-found` - tela para rotas nao encontradas

O layout raiz em `src/app/_layout.tsx` carrega a fonte `SpaceMono`, controla a splash screen, aplica o tema conforme o color scheme, registra os providers globais, registra os grupos `/(tabs)` e `/(dentist)` e inicia o app em `/(auth)/sign-in`.

O layout de tabs em `src/app/(tabs)/_layout.tsx` verifica o `AuthProvider`: usuarios sem sessao sao redirecionados para `/(auth)/sign-in`, e usuarios com perfil `dentist` sao redirecionados para `/(dentist)`.

O layout do dentista em `src/app/(dentist)/_layout.tsx` tambem verifica o `AuthProvider`: usuarios sem sessao voltam para o login, e usuarios com perfil `patient` sao redirecionados para `/(tabs)`.

## Componentes

Componentes reutilizaveis ficam em `src/components` e em pastas de feature.

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/text.tsx`
- `components/shared/theme-toggle.tsx`
- `features/appointments/components/my-agenda-screen.tsx`
- `features/appointments/components/request-appointment-screen.tsx`
- `features/appointments/components/appointment-details-screen.tsx`
- `features/auth/components/sign-in-form.tsx`

Os componentes usam `className` com NativeWind e seguem o padrao visual inspirado em React Native Reusables.

## Formularios

A tela Minha Agenda fica em `src/features/appointments/components/my-agenda-screen.tsx` e e renderizada pela rota `/(tabs)/appointments`.

Ela exibe:

- Consultas do paciente carregadas pelo hook `usePatientAppointments(patientId)`
- Botao para atualizar a agenda manualmente
- Consultas agrupadas por mes
- Alternancia entre proximas consultas e historico por rotas internas do grupo de tabs
- Cards com data, horario, procedimento, profissional e status
- Navegacao para `/appointments/details` ao tocar em uma consulta

A tela de solicitacao de atendimento fica em `src/features/appointments/components/request-appointment-screen.tsx` e e renderizada pela rota `/appointments/new`.

Ela usa:

- React Hook Form para controlar data, horario e descricao
- Zod para validar campos obrigatorios e limite da descricao
- TanStack Query para consultar horarios ja ocupados na data selecionada
- `appointmentService.solicitarAgendamento()` para criar um documento pendente na colecao `agendamentos`
- Expo Router para navegar ate `/appointments/details` apos a solicitacao
- Cores da home, com azul escuro para acoes principais e teal para identidade visual

A tela de detalhes do agendamento sugerido fica em `src/features/appointments/components/appointment-details-screen.tsx` e e renderizada pela rota `/appointments/details`.

Ela exibe:

- Dados do agendamento buscados pela service a partir do `id` da rota
- Data solicitada e faixa de horario
- Profissional, procedimento, status e informacoes de duracao
- Aviso de que a confirmacao do horario e feita pelo dentista

A tela de agenda do dentista fica em `src/features/dentist/components/dentist-agenda-screen.tsx` e e renderizada pela rota `/(dentist)/agenda`.

Ela exibe:

- Consultas do dentista carregadas pelo hook `useDentistAppointments()`
- Botao para atualizar as consultas manualmente
- Consultas agrupadas por mes
- Cards com data, horario, paciente, procedimento e status

O formulario de login fica em `src/features/auth/components/sign-in-form.tsx`.

Ele usa:

- React Hook Form para controle do formulario
- Zod para validacao
- Firebase Auth para login com email e senha
- `AuthProvider` para manter o usuario autenticado no contexto da aplicacao
- Seletor de perfil para entrar como paciente ou dentista
- Zustand sincronizado pelo contexto para armazenar usuario e perfil selecionado
- Expo Router para redirecionar para `/(tabs)` ou `/(dentist)` apos login

O contexto de autenticacao fica em `src/features/auth/context/auth-context.tsx`.

Hooks disponiveis:

- `src/features/auth/hooks/use-auth.ts` - acesso ao usuario, status de autenticacao, login e logout
- `src/features/auth/hooks/use-login.ts` - fluxo de login com loading e mensagem de erro

No estado atual, o login usa Firebase Auth quando as variaveis `EXPO_PUBLIC_FIREBASE_*` estao configuradas. A solicitacao de atendimento grava os dados no Firestore pela service de agendamentos.

## Estado Global

O estado global usa Zustand em `src/store/auth.store.ts`.

Estado disponivel:

- `user`
- `role`
- `setRole(role)`
- `signIn(user, role?)`
- `signOut()`

O `AuthProvider` sincroniza o usuario do Firebase com essa store e preserva o perfil selecionado no login para separar os fluxos de paciente e dentista.

## Data Fetching e Firestore

O service de consultas fica em `src/services/appointments.service.ts` e usa o SDK do Firebase Firestore.

Ele expoe:

- `createAppointment(input)` - cria um agendamento pendente
- `getAppointmentsByDay(dataAgendamento)` - busca horarios pendentes ou confirmados de uma data
- `listPatientAppointmentsDentist(clienteId)` - busca proximos agendamentos do dentista
- `listPatientAppointments(clienteId)` - busca proximos agendamentos do paciente
- `listAppointments()` - lista agendamentos e mapeia para o formato compartilhado de cards
- `appointmentService.dentistaConfirmar(...)` - confirma um agendamento pelo fluxo do dentista
- `appointmentService.cancelarAgendamento(id)` - cancela um agendamento

O hook `src/hooks/use-appointments.ts` usa TanStack Query e expoe:

- `useAppointments()`
- `useAppointment(appointmentId)`
- `useAppointmentsByDay(date)`
- `useDentistAppointments()`
- `usePatientAppointments(patientId)`
- `useCreateAppointment()`

Ao criar um agendamento, `useCreateAppointment()` invalida as queries de lista, paciente e data selecionada para manter a interface sincronizada.

## Firebase Auth

A configuracao do Firebase fica em `src/services/firebase.ts`.

O service de autenticacao fica em `src/services/firebase-auth.service.ts` e expoe:

- `loginWithFirebase(credentials)`
- `logoutFromFirebase()`
- `subscribeToFirebaseAuthState(callback)`
- `mapFirebaseUser(user)`

O app usa o SDK Web do Firebase (`firebase`) para autenticar com email e senha. A persistencia nativa com AsyncStorage nao esta habilitada porque `@react-native-async-storage/async-storage` nao esta instalado no projeto atual.

## Tema

O projeto tem suporte a light mode e dark mode.

- Tokens de tema: `src/constants/theme.ts`
- Variaveis globais: `global.css`
- Configuracao NativeWind/Tailwind: `tailwind.config.js`
- Alternancia de tema: `src/components/shared/theme-toggle.tsx`

## Comandos

Instale as dependencias:

```bash
npm install
```

Inicie o projeto:

```bash
npm run start
```

Execute no Android:

```bash
npm run android
```

Execute no iOS:

```bash
npm run ios
```

Verifique tipos:

```bash
npm run typecheck
```

Execute lint:

```bash
npm run lint
```

## Variaveis de Ambiente

Crie um arquivo `.env.local` com as credenciais publicas do Firebase usadas pelo Expo:

```txt
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Variaveis com prefixo `EXPO_PUBLIC_` ficam disponiveis no app Expo.

## Qualidade e Padroes

- Nao usar `fetch` diretamente em componentes
- Criar chamadas HTTP em `src/services`
- Usar TanStack Query para data fetching
- Usar Zustand para estado global
- Usar React Hook Form e Zod em formularios
- Usar `className` do NativeWind para estilizacao
- Evitar `StyleSheet.create` e estilos inline
- Adicionar `accessibilityLabel` e `accessibilityRole` em componentes interativos
- Evitar `any`; preferir tipos explicitos ou inferencia via Zod
