# Segurança, usuários e permissões

## Regras obrigatórias

- Não armazenar chaves em código, arquivos versionados, mensagens de log ou checkpoints.
- Usar armazenamento de segredos apropriado; em desenvolvimento, aceitar apenas variáveis locais ignoradas pelo Git.
- Nunca retornar credenciais completas depois do cadastro. Exibir apenas identificador e, quando adequado, últimos caracteres mascarados.
- Isolar contas, tarefas, arquivos, memória e conexões por usuário/workspace.
- Não permitir que um usuário consulte credenciais ou dados privados de outro.
- Exigir autorização explícita para ações externas com impacto, como enviar mensagens, alterar calendários, publicar código ou executar comandos.
- Validar entradas e limitar tamanho, frequência e custo das solicitações.
- Registrar eventos de auditoria sem incluir segredos ou conteúdo sensível desnecessário.

## Modelo de acesso

O primeiro deploy pode ter um único administrador, mas o modelo de domínio deve incluir usuários e workspaces desde o início. Uma instância compartilhada deve isolar dados por workspace. Instalações independentes podem usar suas próprias credenciais e configurações.

Papéis iniciais sugeridos:

- **Owner:** administra workspace, conexões, políticas e usuários.
- **Admin:** gerencia agentes, ferramentas e configurações autorizadas.
- **Member:** cria e acompanha tarefas dentro das permissões concedidas.

## Permissões de ferramentas

Cada ferramenta declara ações e escopos. Cada agente recebe apenas as permissões necessárias à tarefa. A autorização deve ser verificada no servidor em toda execução, não apenas na interface.

Ações de leitura e escrita devem ser separadas. Operações destrutivas ou externas devem exigir confirmação específica quando a política assim determinar.

## Contingência segura

Uma troca de conta/provedor não pode ampliar permissões. O destino precisa ser compatível com a classificação dos dados, orçamento e política do workspace. Se não houver alternativa segura, pausar em vez de enviar dados para um destino não autorizado.

## Dados e retenção

Definir políticas configuráveis para retenção, exportação e exclusão. Checkpoints devem guardar o mínimo necessário para retomar o trabalho. Logs devem ter retenção limitada e acesso controlado.

## Antes de produção

Implementar autenticação, autorização por workspace, criptografia em trânsito e em repouso, gestão de segredos, rate limits, proteção contra abuso, backups testados, trilha de auditoria e revisão de dependências.
