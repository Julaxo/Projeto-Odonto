# Commit Message Skill

## Objective

Always generate Git commit messages using the Conventional Commits format.

## Format

```text
<type>: <descrição em português>
```

### Allowed types

- feat: nova funcionalidade
- fix: correção de bug
- refactor: refatoração sem alterar comportamento
- docs: documentação
- test: testes
- chore: tarefas de manutenção
- style: formatação e estilo
- perf: melhoria de performance
- ci: mudanças em CI/CD
- build: mudanças de build

## Examples

```text
feat: adiciona autenticação com Google
fix: corrige erro ao salvar usuário
refactor: simplifica lógica de validação
docs: atualiza instruções de instalação
test: adiciona testes para o módulo de pagamento
chore: atualiza dependências do projeto
```

## Rules

- The commit type MUST be in English.
- The description MUST be in Portuguese (Brazil).
- Use lowercase only.
- Do not end descriptions with a period.
- Keep messages concise and objective.
- Prefer the imperative form.
- Generate only the commit message unless the user explicitly requests an explanation.
