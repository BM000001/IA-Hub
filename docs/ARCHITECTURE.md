# Arquitetura do IA-Hub

## Visão geral

O IA-Hub recebe uma solicitação, transforma-a em um plano, encaminha etapas a agentes compatíveis, acompanha sua execução e consolida os resultados. O núcleo não deve depender diretamente de SDKs de provedores.

## Componentes

- **API / interface:** recebe solicitações e apresenta tarefas, estado e resultados.
- **Orquestrador:** decompõe objetivos, cria etapas, controla dependências e consolida respostas.
- **Registro de provedores:** descreve capacidades, limites e estado de cada conexão.
- **Gerenciador de contas:** mantém várias contas por provedor e seleciona uma conta elegível.
- **Agentes:** unidades especializadas (por exemplo, análise, implementação e revisão), com instruções e permissões delimitadas.
- **Adaptadores de ferramentas:** contratos uniformes para GitHub, calendário, arquivos, navegador e outros serviços.
- **Memória e checkpoints:** armazena contexto relevante, decisões e progresso recuperável.
- **Observabilidade:** registra eventos, duração, falhas e métricas de consumo.
- **Persistência:** PostgreSQL como destino inicial, com Supabase como opção de hospedagem, sem acoplar o domínio ao fornecedor.

## Fluxo de tarefa

1. Validar a solicitação e a identidade do usuário.
2. Criar uma tarefa e um registro inicial de estado.
3. Decompor a tarefa em etapas com dependências e critérios de conclusão.
4. Selecionar agente, provedor e conta compatíveis com as permissões e limites.
5. Salvar checkpoint antes de uma troca de agente/conta ou operação relevante.
6. Executar a etapa e registrar resultado, métricas e erros.
7. Em falha recuperável, tentar novamente ou selecionar outra conta/provedor compatível.
8. Consolidar os resultados e apresentar resumo, artefatos e pendências.

## Contratos principais

- `ProviderAdapter`: capacidades, verificação de conexão e execução de solicitação.
- `ToolAdapter`: descrição da ferramenta, permissões necessárias e execução validada.
- `AgentDefinition`: papel, instruções, capacidades e permissões permitidas.
- `Task`: objetivo, proprietário, estado, etapas e resultado.
- `Checkpoint`: etapa concluída, contexto mínimo necessário, artefatos e próximo passo.
- `UsageRecord`: provedor, conta lógica, modelo, tokens/unidades, custo estimado e horário.

Os contratos devem ser independentes de fornecedor. Segredos são referenciados por identificadores seguros, nunca copiados para tarefas ou checkpoints.

## Seleção e contingência

A seleção considera compatibilidade de capacidade, disponibilidade, limites, orçamento e política do usuário. A troca automática só ocorre entre contas autorizadas e compatíveis. Se não houver alternativa segura, a tarefa pausa e explica o motivo.

## Persistência

Modelo inicial sugerido:

- `users` e `workspaces`
- `provider_accounts`
- `agents`
- `tasks` e `task_steps`
- `checkpoints`
- `tool_connections` e `permission_grants`
- `usage_records`
- `audit_events`

PostgreSQL é a base relacional. pgvector poderá ser adicionado posteriormente para busca semântica; não é requisito para o protótipo inicial.

## Decisões de evolução

O MVP começa sem integrações externas. Primeiro validamos o fluxo interno e os contratos. Depois entram persistência, autenticação, provedores e ferramentas, cada qual com testes e permissões próprias.
