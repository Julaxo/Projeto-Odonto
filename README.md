# Dentista Mobile

Aplicativo mobile para gestão de uma clínica odontológica, construído com Expo, React Native, Expo Router e TypeScript.

O estado atual do app possui dashboard, agenda de consultas, tela de login, perfil, configurações, tema claro/escuro, componentes reutilizáveis e estrutura preparada para consumo de API.

## Stack

- Expo SDK 56
- React Native 0.85
- React 19
- Expo Router
- TypeScript
- NativeWind
- React Native Reusables como padrão visual dos componentes
- React Hook Form
- Zod
- Zustand
- TanStack Query
- Axios
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
|   |-- auth/
|   `-- dashboard/
|-- hooks/
|-- lib/
|-- services/
|-- store/
`-- types/
```

## Rotas e Telas

As rotas são gerenciadas pelo Expo Router em `src/app`.

- `/(tabs)` - grupo principal com navegação por abas
- `/(tabs)/index` - dashboard com métricas e próximas consultas
- `/(tabs)/appointments` - agenda com lista de consultas
- `/(auth)/sign-in` - tela de acesso profissional
- `/profile` - tela de perfil
- `/settings` - tela de configurações
- `+not-found` - tela para rotas não encontradas

O layout raiz em `src/app/_layout.tsx` carrega a fonte `SpaceMono`, controla a splash screen, aplica o tema conforme o color scheme e registra os providers globais.

## Componentes

Componentes reutilizáveis ficam em `src/components`.

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/text.tsx`
- `components/shared/theme-toggle.tsx`

Os componentes usam `className` com NativeWind e seguem o padrão visual inspirado em React Native Reusables.

## Formulários

O formulário de login fica em `src/features/auth/components/sign-in-form.tsx`.

Ele usa:

- React Hook Form para controle do formulário
- Zod para validação
- Zustand para gravar o usuário autenticado localmente
- Expo Router para redirecionar para `/(tabs)` após login

No estado atual, o login é local e não chama backend real.

## Estado Global

O estado global usa Zustand em `src/store/auth.store.ts`.

Estado disponível:

- `user`
- `signIn(user)`
- `signOut()`

## Data Fetching e API

O cliente HTTP fica em `src/services/api.ts` e usa Axios.

A URL base é definida por:

```txt
EXPO_PUBLIC_API_URL
```

Se a variável não estiver definida, o fallback atual é:

```txt
http://localhost:3000
```

O service de consultas fica em `src/services/appointments.service.ts` e expõe `listAppointments()`, que chama:

```txt
GET /appointments
```

O hook `src/hooks/use-appointments.ts` usa TanStack Query com a query key `appointments`.

Observação: as telas atuais de dashboard e agenda usam `MOCK_APPOINTMENTS` de `src/constants/appointments.ts`. O service HTTP e o hook já existem, mas ainda não estão conectados à interface principal.

## Tema

O projeto tem suporte a light mode e dark mode.

- Tokens de tema: `src/constants/theme.ts`
- Variáveis globais: `global.css`
- Configuração NativeWind/Tailwind: `tailwind.config.js`
- Alternância de tema: `src/components/shared/theme-toggle.tsx`

## Comandos

Instale as dependências:

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

## Variáveis de Ambiente

Crie um arquivo `.env.local` quando precisar apontar para uma API externa:

```txt
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Variáveis com prefixo `EXPO_PUBLIC_` ficam disponíveis no app Expo.

## Qualidade e Padrões

- Não usar `fetch` diretamente em componentes
- Criar chamadas HTTP em `src/services`
- Usar TanStack Query para data fetching
- Usar Zustand para estado global
- Usar React Hook Form e Zod em formulários
- Usar `className` do NativeWind para estilização
- Evitar `StyleSheet.create` e estilos inline
- Adicionar `accessibilityLabel` e `accessibilityRole` em componentes interativos
- Evitar `any`; preferir tipos explícitos ou inferência via Zod
