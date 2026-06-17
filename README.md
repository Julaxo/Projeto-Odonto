# Dentista Mobile

Aplicativo mobile para pacientes de uma clinica odontologica, construido com Expo, React Native, Expo Router e TypeScript.

O estado atual do app possui home do paciente, agenda do paciente, solicitacao de atendimento, detalhes do agendamento sugerido, alertas, perfil, tela de login, configuracoes, tema claro/escuro, componentes reutilizaveis e estrutura preparada para consumo de API.

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
|   |-- (tabs)/
|   |-- profile/
|   `-- settings/
|-- components/
|   |-- shared/
|   `-- ui/
|-- constants/
|-- features/
|   |-- appointments/
|   |-- auth/
|   `-- dashboard/
|-- hooks/
|-- lib/
|-- services/
|-- store/
`-- types/
```

## Rotas e Telas

As rotas sao gerenciadas pelo Expo Router em `src/app`.

- `/(tabs)` - grupo principal com navegacao por abas protegida por autenticacao
- `/(tabs)/index` - home do paciente com proxima consulta, CTA de solicitacao e acesso rapido
- `/(tabs)/appointments` - tela Schedule com Minha Agenda, proximas consultas e historico
- `/(tabs)/appointments-history` - rota oculta da tab bar para exibir o Historico dentro do fluxo Schedule
- `/(tabs)/alerts` - tela de alertas do paciente
- `/(tabs)/profile` - perfil do paciente na navegacao por abas
- `/appointments/new` - solicitacao de atendimento com data, horario e descricao
- `/appointments/details` - detalhes do horario sugerido pela clinica, com confirmacao ou solicitacao de alteracao
- `/(auth)/sign-in` - tela de acesso profissional
- `/profile` - tela de perfil profissional existente
- `/settings` - tela de configuracoes
- `+not-found` - tela para rotas nao encontradas

O layout raiz em `src/app/_layout.tsx` carrega a fonte `SpaceMono`, controla a splash screen, aplica o tema conforme o color scheme, registra os providers globais e inicia o app em `/(auth)/sign-in`.

O layout de tabs em `src/app/(tabs)/_layout.tsx` verifica o `AuthProvider`: usuarios sem sessao sao redirecionados para `/(auth)/sign-in`, e usuarios autenticados acessam a navegacao principal.

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

- Consultas agrupadas por mes
- Alternancia entre proximas consultas e historico por rotas internas do grupo de tabs
- Cards com data, horario, procedimento, profissional e status
- Navegacao para `/appointments/details` ao tocar em uma consulta

A tela de solicitacao de atendimento fica em `src/features/appointments/components/request-appointment-screen.tsx` e e renderizada pela rota `/appointments/new`.

Ela usa:

- React Hook Form para controlar data, horario e descricao
- Zod para validar campos obrigatorios e limite da descricao
- Expo Router para navegar ate `/appointments/details` apos a solicitacao local
- Cores da home, com azul escuro para acoes principais e teal para identidade visual

A tela de detalhes do agendamento sugerido fica em `src/features/appointments/components/appointment-details-screen.tsx` e e renderizada pela rota `/appointments/details`.

Ela exibe:

- Aviso de horario sugerido pela clinica
- Data e faixa de horario
- Profissional, sala e informacoes de duracao
- Acoes para confirmar horario ou solicitar alteracao

O formulario de login fica em `src/features/auth/components/sign-in-form.tsx`.

Ele usa:

- React Hook Form para controle do formulario
- Zod para validacao
- Firebase Auth para login com email e senha
- `AuthProvider` para manter o usuario autenticado no contexto da aplicacao
- Zustand sincronizado pelo contexto para manter compatibilidade com telas existentes
- Expo Router para redirecionar para `/(tabs)` apos login

O contexto de autenticacao fica em `src/features/auth/context/auth-context.tsx`.

Hooks disponiveis:

- `src/features/auth/hooks/use-auth.ts` - acesso ao usuario, status de autenticacao, login e logout
- `src/features/auth/hooks/use-login.ts` - fluxo de login com loading e mensagem de erro

No estado atual, o login usa Firebase Auth quando as variaveis `EXPO_PUBLIC_FIREBASE_*` estao configuradas. A solicitacao de atendimento ainda e local e nao chama backend real.

## Estado Global

O estado global usa Zustand em `src/store/auth.store.ts`.

Estado disponivel:

- `user`
- `signIn(user)`
- `signOut()`

O `AuthProvider` sincroniza o usuario do Firebase com essa store para preservar as telas que ja consomem `useAuthStore`.

## Data Fetching e API

O cliente HTTP fica em `src/services/api.ts` e usa Axios.

A URL base e definida por:

```txt
EXPO_PUBLIC_API_URL
```

Se a variavel nao estiver definida, o fallback atual e:

```txt
http://localhost:3000
```

O service de consultas fica em `src/services/appointments.service.ts` e expoe `listAppointments()`, que chama:

```txt
GET /appointments
```

O hook `src/hooks/use-appointments.ts` usa TanStack Query com a query key `appointments`.

Observacao: as telas atuais usam dados locais/mockados. O service HTTP e o hook ja existem, mas ainda nao estao conectados a interface principal.

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

Crie um arquivo `.env.local` quando precisar apontar para uma API externa:

```txt
EXPO_PUBLIC_API_URL=http://localhost:3000
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
