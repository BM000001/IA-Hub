# Arquitetura do IA-Hub

## Visão geral

O IA-Hub recebe uma solicitação, transforma-a em um plano, encaminha etapas a agentes compatíveis, acompanha sua execução e consolida os resultados. O núcleo não deve depender diretamente de SDKs de provedores.

## Componentes

- **API / interface:** recebe solicitações e apresenta tarefas, estado e resultados.
- **Orquestrador:** controla estados, dependências, execução sequencial e consolidação.
- **Registro de provedores:** descreve capacidades, limites e estado de cada conexão.
- **Gerenciador de contas:** mantém várias contas por provedor e seleciona uma conta elegível.
- **Agentes:** unidades especializadas com instruções e permissões delimitadas.
- **Adaptadores de ferramentas:** contratos uniformes para serviços externos.
- **Memória e checkpoints:** registra progresso recuperável.
- **Observabilidade:** registra eventos, duração, falhas e métricas de consumo.
- **Persistência:** PostgreSQL como destino inicial, sem acoplar o domínio ao fornecedor.

## Núcleo implementado

O pacote `src/core` contém:

- `task.ts`: modelos de tarefas, etapas, estados, eventos e checkpoints.
- `orchestrator.ts`: execução sequencial com dependências, detecção de ciclos, eventos, checkpoints e restauração.
- `orchestrator.test.ts`: testes automatizados do fluxo principal e dos casos de falha.

O executor é injetado como função. Isso permite testar o fluxo sem chamar provedores reais e, futuramente, conectar adaptadores sem acoplar o domínio a SDKs específicos.

## Fluxo de tarefa

1. Validar a solicitação e criar a tarefa.
2. Definir etapas e dependências.
3. Selecionar executor compatível (simulado no MVP).
4. Executar etapas cujas dependências foram concluídas.
5. Registrar eventos e checkpoint após cada etapa concluída.
6. Em falha, preservar etapas concluídas e interromper com erro explícito.
7. Restaurar o estado a partir de checkpoint para continuar posteriormente.

## Limites atuais

- Execução em memória; reiniciar o processo perde eventos e checkpoints.
- Sem chamadas a APIs externas ou cadastro de credenciais.
- Sem paralelismo, seleção real de agentes ou fallback entre provedores.
- O executor simulado valida o fluxo, não a qualidade de respostas de modelos.

## Próximas etapas

1. Persistência transacional para tarefas, eventos e checkpoints.
2. Registro de agentes e seleção por capacidade.
3. Contrato de provedor e gerenciador de múltiplas contas.
4. Fallback compatível com permissões, orçamento e classificação dos dados.
5. Adaptadores de ferramentas e interface de operação.

Segredos devem ser referenciados por identificadores seguros, nunca copiados para tarefas ou checkpoints.
