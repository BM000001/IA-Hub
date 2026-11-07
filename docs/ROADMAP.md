# Roadmap

## Fase 0 — Fundação (concluída parcialmente)

- [x] Definir objetivo e independência em relação ao Alfred.
- [x] Documentar arquitetura, segurança e roadmap.
- [x] Criar esqueleto TypeScript sem dependências de provedores externos.
- [x] Criar workflow de CI para validar build, tipos e testes.
- [ ] Confirmar execução verde do CI no GitHub.

## Fase 1 — Núcleo funcional

- [x] Modelos de tarefa, etapas e estados.
- [x] Orquestrador local com execução simulada.
- [x] Dependências entre etapas e detecção de ciclos.
- [x] Eventos de execução e checkpoints em memória.
- [x] Restauração de estado a partir de checkpoint.
- [x] Testes automatizados do núcleo.
- [ ] Persistir eventos e checkpoints fora da memória do processo.
- [ ] Adicionar seleção de agentes por capacidade.

## Fase 2 — Persistência e identidade

- [ ] PostgreSQL com migrações versionadas.
- [ ] Autenticação e isolamento por workspace.
- [ ] Backups independentes e teste de restauração.
- [ ] Política de retenção e exportação.

## Fase 3 — Contas e provedores

- [ ] Cadastro de múltiplas contas por provedor.
- [ ] Teste de conexão e estado de disponibilidade.
- [ ] Adaptadores desacoplados para provedores.
- [ ] Limites por conta, tarefa e workspace.
- [ ] Fallback seguro com checkpoint e continuidade.

## Fase 4 — Agentes e ferramentas

- [ ] Definições de agentes especializados.
- [ ] Colaboração e revisão entre agentes.
- [ ] Adaptadores de ferramentas com permissões granulares.
- [ ] Aprovação para ações externas sensíveis.

## Fase 5 — Painel e operação

- [ ] Central de comando.
- [ ] Painel de contas, agentes e tarefas.
- [ ] Logs, erros, consumo, custos e desempenho.
- [ ] Alertas e limites configuráveis.

## Fase 6 — Memória avançada e expansão

- [ ] Memória contextual com controles de retenção.
- [ ] pgvector opcional para busca semântica.
- [ ] Mais provedores e ferramentas.
- [ ] Recursos de voz e automações, sempre com permissões explícitas.

## Critérios para cada etapa

Nenhuma fase é considerada concluída apenas por existir código. Exigir testes, documentação atualizada, tratamento de falhas e confirmação de que funcionalidades existentes continuam operando.
