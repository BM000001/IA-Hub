# IA-Hub

**IA-Hub** é uma central independente para conectar múltiplos provedores de IA, coordenar agentes especializados e integrar ferramentas externas em fluxos de trabalho controlados.

> IA-Hub é um projeto separado do Alfred e do Alfred-Laboratory. Nenhum deles é substituído, incorporado ou alterado por este repositório.

## Objetivos

- Conectar diferentes provedores e múltiplas contas por provedor.
- Distribuir tarefas entre agentes especializados e consolidar os resultados.
- Retomar trabalhos a partir de checkpoints, sem perder contexto ou progresso.
- Integrar ferramentas por adaptadores com permissões explícitas.
- Monitorar disponibilidade, consumo, custos, erros e histórico.
- Manter isolamento de dados e credenciais entre usuários.
- Começar com uma base pequena, extensível e sem dependência obrigatória de um único fornecedor.

## Estado atual

Este repositório está na fase de fundação: documentação, contratos internos e esqueleto executável. Ainda não há chamadas a APIs externas, armazenamento de credenciais reais ou execução autônoma de ferramentas.

## Estrutura

```text
.
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   └── ROADMAP.md
├── src/
│   ├── core/
│   │   └── task.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Começar

Requisitos: Node.js 20 ou superior e npm.

```bash
npm install
npm run typecheck
npm run build
npm start
```

O protótipo atual funciona localmente e não exige chaves de API.

## Princípios

1. **Independência:** IA-Hub não depende do Alfred.
2. **Segurança por padrão:** credenciais nunca são registradas em logs nem compartilhadas entre usuários.
3. **Permissão explícita:** cada agente só recebe as ferramentas e ações autorizadas para a tarefa.
4. **Resiliência:** falhas devem gerar estado recuperável, não perda silenciosa de trabalho.
5. **Transparência:** tarefas, decisões, consumo e erros devem ser observáveis.
6. **Evolução incremental:** integrações externas só entram depois de contratos e testes.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Segurança e permissões](docs/SECURITY.md)
- [Roadmap](docs/ROADMAP.md)

## Licença

A licença ainda será definida. Até lá, não presuma concessão de direitos de uso ou redistribuição.
