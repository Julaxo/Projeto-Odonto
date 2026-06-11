# Skill: README Auto Update (Expo React Native)

## Objetivo

Sempre que codigo relevante for criado, alterado ou removido, atualize o `README.md` para refletir o estado atual deste aplicativo mobile.

Este repositorio e um projeto React Native com Expo, Expo Router, TypeScript, NativeWind, React Native Reusables, Zustand e TanStack Query.

---

## Regra Principal

Apos qualquer mudanca estrutural ou funcional relevante, o agente deve:

- Atualizar o `README.md`
- Manter a documentacao sincronizada com a implementacao
- Garantir que comandos, exemplos e descricoes estejam corretos
- Remover informacoes obsoletas
- Documentar apenas o que existe no codigo atual

---

## O Que Deve Ser Atualizado no README

Revise e atualize quando aplicavel:

- Visao geral do aplicativo
- Stack tecnica
- Estrutura de pastas
- Rotas do Expo Router
- Fluxos de navegacao
- Telas disponiveis
- Componentes reutilizaveis
- Formularios com React Hook Form e Zod
- Estado global com Zustand
- Data fetching com TanStack Query
- Services e clientes HTTP
- Variaveis de ambiente
- Tema light/dark
- Acessibilidade em componentes interativos
- Comandos de instalacao, desenvolvimento, lint e typecheck
- Instrucoes de execucao em Android, iOS e Expo Go
- Integracoes externas
- Decisoes de arquitetura relevantes

---

## Estrutura Esperada do Projeto

Ao documentar estrutura, considere o padrao atual:

```txt
src/
|-- app/
|-- components/
|   |-- ui/
|   |-- forms/
|   `-- shared/
|-- constants/
|-- features/
|-- hooks/
|-- lib/
|-- services/
|-- store/
|-- types/
`-- utils/
```

Documente somente pastas que existirem ou forem criadas no codigo.

---

## Mudancas Relevantes

Atualize o README quando houver:

- Criacao, remocao ou renomeacao de telas
- Criacao, remocao ou renomeacao de rotas
- Alteracao no layout raiz ou em grupos de rotas
- Novo fluxo de autenticacao
- Mudanca em regras de autorizacao
- Novo formulario ou mudanca significativa de validacao
- Novo service ou alteracao de contrato de API
- Nova variavel de ambiente
- Nova integracao externa
- Alteracao em providers globais
- Alteracao em stores Zustand
- Alteracao em hooks publicos ou compartilhados
- Alteracao em componentes reutilizaveis de UI
- Mudanca no tema, tokens visuais ou suporte a dark mode
- Mudanca em comandos do `package.json`
- Mudanca estrutural de pastas
- Mudanca significativa em fluxos de negocio

---

## Quando Nao Atualizar o README

Nao atualize o README para:

- Ajustes pequenos de bug sem impacto funcional documentavel
- Formatacao de codigo
- Renomeacao interna de variaveis
- Refatoracao interna sem mudanca de comportamento ou estrutura
- Pequenos ajustes visuais localizados
- Atualizacoes de testes sem mudanca de uso
- Otimizacoes de performance sem impacto na API, telas ou arquitetura

---

## Processo Obrigatorio

Antes de concluir uma tarefa:

1. Revise os arquivos alterados
2. Identifique se houve impacto em documentacao
3. Atualize o `README.md` quando necessario
4. Verifique se os comandos documentados existem no `package.json`
5. Verifique se rotas, services, stores e variaveis de ambiente documentadas existem no codigo
6. Garanta que nao haja informacao antiga ou especulativa

---

## Regras de Conteudo

- Escreva o README em portugues do Brasil
- Use linguagem clara, objetiva e profissional
- Nao documente endpoints, telas, pastas ou comandos inexistentes
- Nao inclua pseudocodigo
- Prefira exemplos curtos e executaveis
- Mantenha a documentacao util para onboarding de desenvolvedores
- Se houver `EXPO_PUBLIC_API_URL`, documente seu uso e fallback quando existir no codigo
- Se o projeto ainda nao tiver backend real conectado, deixe isso explicito

---

## Regra do Agente

Para toda tarefa concluida:

- Verifique se o README foi impactado
- Atualize o README quando necessario
- Mantenha a documentacao alinhada ao app Expo/React Native atual
- Nunca finalize uma mudanca estrutural com o README desatualizado

O `README.md` faz parte do codigo-fonte e deve evoluir junto com a aplicacao.
