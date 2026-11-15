# Central de Comando Alfred — painel público de leitura (MVP)

O painel é um **site estático independente** do aplicativo Alfred. O desenvolvimento da Central continua em `BM000001/Alfred`, branch `feat/central-comando-site-20261115`. Esta branch do IA-Hub mantém a versão destinada à hospedagem.

- Painel: `docs/central/index.html`.
- Entrada do GitHub Pages: `docs/index.html` (redireciona para `./central/`).
- Repositório de hospedagem: `BM000001/IA-Hub`.
- Branch de publicação candidata: `feat/central-comando-alfred-publico` (sem merge em `main`).

## Dados reais, com limites explícitos

A página lê **somente** metadados públicos da API GitHub para `BM000001/Alfred` e `BM000001/Alfred-Laboratory`:
- Issues abertas e PRs abertas; ao abrir a aba Encerrados, busca Issues/PRs fechadas.
- Título, número, repositório, tipo, estado, data da última alteração e URL do registro no GitHub.
- Até 100 itens mais recentemente atualizados por repositório/estado. Não implementa paginação e não garante cobertura exaustiva.
- Consulta inicial e depois em intervalos aproximados de cinco minutos, apenas enquanto a página estiver visível.
- Erro/limite da API é indicado; se apenas um repositório responder, os dados são marcados como parciais.
- Sem token, OAuth, chamada à API para escrita, backend, cookies de autenticação ou acesso a repositórios privados.

**Atenção à semântica**: uma PR aberta é apenas evidência de código submetido à revisão, não de CI verde, teste no iPhone, aprovação ou merge. Issue fechada não é sinônimo de entrega concluída. A aba "Ativas e revisão" inclui PRs abertas e Issues abertas com P0/P1 no título/label; as demais Issues ficam em "Demais pendências". Isso **não** confirma execução ativa. A recomendação da tela inicial é heurística: primeiro uma Issue P0/P1 aberta, depois PR aberta; não autoriza qualquer operação.

A página exibe dados públicos e não deve conter credenciais ou informações internas. A API anônima do GitHub possui rate limit; acessar o painel em muitos dispositivos pode exigir uma camada de cache/snapshot público antes de adotar atualização rápida. Não confundir o status de um campo não verificado com uma falha de CI.

## Publicação com Pages — etapa manual pendente

Esta branch e seus arquivos estão versionados; **isso não habilita GitHub Pages automaticamente**. Um administrador pode configurar no repositório IA-Hub:

1. GitHub > IA-Hub > Settings > Pages.
2. Em **Build and deployment**, selecionar **Deploy from a branch**.
3. Selecionar a branch `feat/central-comando-alfred-publico` e a pasta `/docs`; salvar.
4. Aguardar a execução real da publicação e confirmar que a URL fornecida pelo GitHub responde e mostra dados reais. O endereço previsto, **não verificado nem publicado por estes commits**, é `https://bm000001.github.io/IA-Hub/`.

A configuração preserva a `main` do IA-Hub e não substitui a publicação já existente do Alfred. A mudança da origem do Pages deve ser conferida antes de salvar caso haja uma configuração anterior que não foi detectada. Não inserir tokens GitHub em HTML/JS público.

## Verificações e próximos passos

- Verificado pela conexão GitHub: arquivos enviados à branch independente; os commits devem ser conferidos por leitura de retorno.
- Sintaxe JS do HTML: validada no código antes do envio; ainda faltam teste real de rede da página publicada, layout Safari iPhone e teste de interação em navegador real.
- Prioridade posterior: integração de estado de CI, dependências entre PRs, evidência de homologação e checkpoints de agentes, com fonte verificável e indicação explícita quando não houver confirmação.
- Somente após testes e autorização, avaliar integração do painel com a orquestração do IA-Hub.

## Riscos a não ocultar

- O `IA-Hub` é uma **fundação de orquestração**, não executa agentes ou sincroniza PRs em background hoje.
- O painel de leitura pública não tem escrita, aprovação/merge, notificações push, login ou controle de agentes.
- GitHub Pages é público: não hospedar dados pessoais não públicos, segredos ou cópias de arquivos privados.
