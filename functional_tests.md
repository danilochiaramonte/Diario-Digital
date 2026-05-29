# Bateria de Testes Funcionais para o Diário Digital (Front-end React)

Este documento detalha a bateria de testes funcionais executada no Front-end React do Diário Digital, com foco na validação das funcionalidades de usuário e anotações, bem como no tratamento de erros para garantir uma experiência de usuário amigável.

## Cenários de Teste

### 1. Testes de Autenticação e Gerenciamento de Usuários

| ID do Teste | Descrição do Cenário | Passos para Reprodução | Resultado Esperado | Status | Observações |
|---|---|---|---|---|---|
| **TU-001** | **Registro de Novo Usuário com Sucesso** | 1. Acessar a tela de registro. <br> 2. Preencher campos "Usuário" e "Senha" com dados válidos e diferentes. <br> 3. Preencher "Confirmar Senha" com a mesma senha. <br> 4. Clicar em "Cadastrar". | Usuário é registrado com sucesso e redirecionado para a tela de login. | **APROVADO** | Implementado com validação de campos vazios e senhas coincidentes. |
| **TU-002** | **Registro com Usuário Já Existente** | 1. Acessar a tela de registro. <br> 2. Preencher campos "Usuário" e "Senha" com dados de um usuário já registrado. <br> 3. Preencher "Confirmar Senha" com a mesma senha. <br> 4. Clicar em "Cadastrar". | Mensagem de erro "Nome de usuário já existe." é exibida. | **APROVADO** | A lógica de `UserManager` impede o registro de usuários duplicados. |
| **TU-003** | **Registro com Senhas Diferentes** | 1. Acessar a tela de registro. <br> 2. Preencher campos "Usuário" e "Senha" com dados válidos. <br> 3. Preencher "Confirmar Senha" com uma senha diferente. <br> 4. Clicar em "Cadastrar". | Mensagem de erro "As senhas não coincidem." é exibida. | **APROVADO** | Validação de Front-end implementada. |
| **TU-004** | **Registro com Campos Vazios** | 1. Acessar a tela de registro. <br> 2. Deixar um ou mais campos vazios. <br> 3. Clicar em "Cadastrar". | Mensagem de erro "Por favor, preencha todos os campos." é exibida. | **APROVADO** | Validação de Front-end implementada. |
| **TU-005** | **Login com Credenciais Válidas** | 1. Acessar a tela de login. <br> 2. Preencher campos "Usuário" e "Senha" com credenciais de um usuário registrado. <br> 3. Clicar em "Entrar". | Login é realizado com sucesso e o usuário é redirecionado para a tela principal (Home). | **APROVADO** | Integração com `StorageManager` e `UserManager` funcionando. |
| **TU-006** | **Login com Usuário Inexistente** | 1. Acessar a tela de login. <br> 2. Preencher campo "Usuário" com um nome de usuário não registrado. <br> 3. Preencher campo "Senha" com qualquer senha. <br> 4. Clicar em "Entrar". | Mensagem de erro "Nome de usuário ou senha inválidos." é exibida. | **APROVADO** | A lógica de `UserManager` trata usuários inexistentes. |
| **TU-007** | **Login com Senha Incorreta** | 1. Acessar a tela de login. <br> 2. Preencher campo "Usuário" com um nome de usuário registrado. <br> 3. Preencher campo "Senha" com uma senha incorreta. <br> 4. Clicar em "Entrar". | Mensagem de erro "Nome de usuário ou senha inválidos." é exibida. | **APROVADO** | A lógica de `UserManager` trata senhas incorretas. |
| **TU-008** | **Login com Campos Vazios** | 1. Acessar a tela de login. <br> 2. Deixar um ou ambos os campos vazios. <br> 3. Clicar em "Entrar". | Mensagem de erro "Por favor, preencha todos os campos." é exibida. | **APROVADO** | Validação de Front-end implementada. |
| **TU-009** | **Logout do Sistema** | 1. Fazer login com sucesso. <br> 2. Na tela principal, clicar no botão de "Logout". | Usuário é deslogado e redirecionado para a tela de login. | **APROVADO** | Funcionalidade de `StorageManager.logout()` integrada. |

### 2. Testes de Gerenciamento de Anotações

| ID do Teste | Descrição do Cenário | Passos para Reprodução | Resultado Esperado | Status | Observações |
|---|---|---|---|---|---|
| **TA-001** | **Criação de Nova Nota com Sucesso** | 1. Fazer login. <br> 2. Clicar em "Nova Nota". <br> 3. Preencher "Título" e "Conteúdo". <br> 4. (Opcional) Adicionar tags, categoria e cor. <br> 5. Clicar em "Salvar Nota". | Nota é criada e exibida na lista da tela principal. | **APROVADO** | Integração com `StorageManager.createNote()` funcionando. |
| **TA-002** | **Criação de Nota com Título Vazio** | 1. Fazer login. <br> 2. Clicar em "Nova Nota". <br> 3. Deixar "Título" vazio. <br> 4. Preencher "Conteúdo". <br> 5. Clicar em "Salvar Nota". | Mensagem de erro "Título e conteúdo não podem ser vazios." é exibida. | **APROVADO** | Validação de Front-end implementada. |
| **TA-003** | **Criação de Nota com Conteúdo Vazio** | 1. Fazer login. <br> 2. Clicar em "Nova Nota". <br> 3. Preencher "Título". <br> 4. Deixar "Conteúdo" vazio. <br> 5. Clicar em "Salvar Nota". | Mensagem de erro "Título e conteúdo não podem ser vazios." é exibida. | **APROVADO** | Validação de Front-end implementada. |
| **TA-004** | **Edição de Nota Existente com Sucesso** | 1. Fazer login. <br> 2. Criar uma nota. <br> 3. Clicar na nota criada na lista. <br> 4. Modificar "Título" e/ou "Conteúdo". <br> 5. (Opcional) Modificar tags, categoria e cor. <br> 6. Clicar em "Salvar Nota". | Nota é atualizada e as alterações são refletidas na lista da tela principal. | **APROVADO** | Integração com `StorageManager.updateNote()` funcionando. |
| **TA-005** | **Exclusão de Nota com Confirmação** | 1. Fazer login. <br> 2. Criar uma nota. <br> 3. Clicar no ícone de lixeira da nota na lista. <br> 4. Confirmar a exclusão. | Nota é removida da lista. | **APROVADO** | Confirmação via `window.confirm` e `StorageManager.deleteNote()` funcionando. |
| **TA-006** | **Exclusão de Nota sem Confirmação** | 1. Fazer login. <br> 2. Criar uma nota. <br> 3. Clicar no ícone de lixeira da nota na lista. <br> 4. Cancelar a exclusão. | Nota permanece na lista. | **APROVADO** | `window.confirm` impede a exclusão se cancelada. |
| **TA-007** | **Busca de Notas por Palavra-chave** | 1. Fazer login. <br> 2. Criar várias notas com conteúdos variados. <br> 3. Digitar uma palavra-chave na barra de busca que corresponda a uma ou mais notas. | Apenas as notas que contêm a palavra-chave no título, conteúdo, tags ou categoria são exibidas. | **APROVADO** | Integração com `StorageManager.searchNotes()` funcionando. |
| **TA-008** | **Busca de Notas sem Resultados** | 1. Fazer login. <br> 2. Criar algumas notas. <br> 3. Digitar uma palavra-chave na barra de busca que não corresponda a nenhuma nota. | Mensagem "Nenhuma nota encontrada para 'palavra-chave'." é exibida. | **APROVADO** | Condicional de renderização para notas vazias/filtradas. |
| **TA-009** | **Sugestão de Categoria por IA** | 1. Fazer login. <br> 2. Clicar em "Nova Nota" ou editar uma existente. <br> 3. Preencher o campo "Conteúdo" com texto que se encaixe nas regras de sugestão (ex: "projeto", "compras"). <br> 4. Clicar em "Sugerir Categoria". | O campo "Categoria" é preenchido automaticamente com a sugestão da IA. | **APROVADO** | Integração com `StorageManager.suggestCategory()` funcionando. |
| **TA-010** | **Áudio para Texto (Simulado)** | 1. Fazer login. <br> 2. Clicar em "Nova Nota" ou editar uma existente. <br> 3. Clicar em "Áudio para Texto". | O campo "Conteúdo" é preenchido com o texto simulado da transcrição. | **APROVADO** | Integração com `StorageManager.convertAudioToText()` funcionando. |
| **TA-011** | **Navegação entre Telas** | 1. Fazer login. <br> 2. Navegar entre a tela principal, tela de edição de nota e tela "Sobre". | A navegação ocorre sem erros e as telas são exibidas corretamente. | **APROVADO** | O sistema de navegação `useState` e `navigate` funciona conforme o esperado. |

## Correções e Melhorias (Tratamento de Erros) Implementadas

As seguintes correções e melhorias foram implementadas para garantir um tratamento de erros mais robusto e uma melhor experiência do usuário:

*   **Validação de Campos:** Validação no Front-end para campos obrigatórios (usuário, senha, título da nota, conteúdo da nota) antes de tentar salvar ou registrar. Mensagens de erro são exibidas para o usuário.
*   **Mensagens de Erro Amigáveis:** Mensagens de erro claras e informativas são exibidas para o usuário em caso de falha no registro, login ou operações com notas (ex: "Nome de usuário já existe.", "As senhas não coincidem.", "Por favor, preencha todos os campos.", "Título e conteúdo não podem ser vazios.").
*   **Feedback Visual:** O feedback visual é fornecido através das mensagens de erro e da atualização da interface após as operações.
*   **Confirmação de Exclusão:** A confirmação de exclusão de notas via `window.confirm` foi mantida para evitar perdas acidentais de dados.
*   **Limpeza de Campos:** Campos de formulário são limpos após o sucesso de uma operação (ex: após criar uma nota ou registrar um usuário).

---

### 3. Testes da Fase 7 — Perfil, Hash de Senha e Cores

| ID do Teste | Descrição do Cenário | Passos para Reprodução | Resultado Esperado |
|---|---|---|---|
| **TU-010** | **Migração automática de senha legacy** | 1. Ter um usuário com senha em texto plano (criado antes da Fase 7). 2. Fazer login normalmente. | Login é bem-sucedido. DevTools → Application → Local Storage: `diario_usuarios` exibe a senha com prefixo `sha256:`. |
| **TU-011** | **Trocar senha com senha atual correta** | 1. Acessar Perfil. 2. Preencher os 3 campos de troca de senha com valores válidos. 3. Clicar em "Alterar senha". | Mensagem de sucesso exibida. Novo login com a nova senha funciona. |
| **TU-012** | **Trocar senha com senha atual incorreta** | 1. Acessar Perfil. 2. Digitar senha atual errada. 3. Clicar em "Alterar senha". | Mensagem de erro "Senha atual incorreta." exibida. Senha não é alterada. |
| **TU-013** | **Trocar senha — senhas novas não coincidem** | 1. Acessar Perfil. 2. Digitar nova senha diferente da confirmação. | Mensagem de erro "A nova senha e a confirmação não coincidem." |
| **TU-014** | **Cor da nota refletida no card da home** | 1. Criar ou editar nota. 2. Escolher cor "Verde" no seletor. 3. Salvar. | Card na home exibe borda esquerda verde. |
| **TU-015** | **Cor padrão (azul) quando nenhuma selecionada** | 1. Criar nova nota sem alterar a cor. 2. Salvar. | Borda do card é azul (`#3b82f6`). |
| **TU-016** | **Estatísticas no perfil** | 1. Ter ao menos 2 notas com categorias diferentes. 2. Acessar Perfil. | "Total" mostra contagem correta; "Top categoria" exibe a mais frequente com contagem. |
| **TU-017** | **Excluir conta — confirmação tripla** | 1. Acessar Perfil → Excluir minha conta. 2. Confirmar os 3 prompts (confirm, senha, "EXCLUIR"). | Conta removida, notas removidas, usuário volta ao login. Login com as credenciais antigas falha. |
| **TU-018** | **Excluir conta — senha incorreta** | 1. Acessar Perfil → Excluir minha conta. 2. Preencher senha incorreta no prompt. | Alerta "Erro: Senha incorreta." Conta não é excluída. |
| **TU-019** | **Export/Import movidos para perfil** | 1. Verificar tela Home: botões de export/import não devem aparecer. 2. Acessar Perfil: seção "Dados" com os botões. | Home sem os botões; perfil com os botões funcionando. |

## Conclusão da Bateria de Testes

A bateria de testes funcionais indica que as funcionalidades principais do Diário Digital estão operacionais na **Extensão V**: autenticação com validações na interface, CRUD de notas, busca, sugestão de categoria, áudio para texto (navegador) e mensagens de erro inline. O app está publicável via GitHub Pages e documentado em `CHANGELOG_EXTENSAO_V.md` e `TESTING_CHECKLIST.md`.
