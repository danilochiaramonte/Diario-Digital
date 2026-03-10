# Checklist de Testes Funcionais - Diário Digital

Use este checklist para validar que todas as funcionalidades do Diário Digital estão funcionando corretamente. Marque cada item conforme você testa.

## 1. Testes de Autenticação

### Tela de Login
- [ ] A tela de login aparece quando você abre o app
- [ ] O campo "Usuário" aceita entrada de texto
- [ ] O campo "Senha" mascara o texto (mostra asteriscos)
- [ ] O botão "Entrar" está visível e funcional
- [ ] Existe um link "Cadastre-se aqui" na parte inferior

### Registro de Novo Usuário
- [ ] Clique em "Cadastre-se aqui" na tela de login
- [ ] A tela de registro aparece com campos para Usuário, Senha e Confirmar Senha
- [ ] Tente cadastrar com campos vazios → deve mostrar erro "Por favor, preencha todos os campos."
- [ ] Tente cadastrar com senhas diferentes → deve mostrar erro "As senhas não coincidem."
- [ ] Tente cadastrar com senha muito curta (menos de 4 caracteres) → deve mostrar erro
- [ ] Cadastre um novo usuário com dados válidos (ex: usuario: "teste", senha: "1234")
- [ ] Após o cadastro, você deve ser redirecionado para a tela de login
- [ ] Tente cadastrar novamente com o mesmo usuário → deve mostrar erro "Nome de usuário já existe"

### Login com Usuário Válido
- [ ] Na tela de login, insira o usuário e senha que acabou de cadastrar
- [ ] Clique em "Entrar"
- [ ] Você deve ser redirecionado para a tela principal (Home) com a lista de notas
- [ ] A barra superior deve mostrar "Diário Digital" e os botões de "Sobre" e "Logout"

### Login com Credenciais Inválidas
- [ ] Faça logout (clique no botão de logout)
- [ ] Tente fazer login com um usuário que não existe → deve mostrar erro
- [ ] Tente fazer login com a senha errada → deve mostrar erro
- [ ] Tente fazer login com campos vazios → deve mostrar erro

## 2. Testes da Tela Principal (Home)

### Visualização Inicial
- [ ] A tela principal mostra uma mensagem "Nenhuma nota ainda" quando você não tem notas
- [ ] Existe um botão "Nova Nota" na parte inferior
- [ ] Existe uma barra de busca no topo com placeholder "Buscar por título..."

### Criação de Nota
- [ ] Clique em "Nova Nota"
- [ ] A tela de edição abre com campos vazios
- [ ] Preencha o campo "Título" com um texto (ex: "Minha Primeira Nota")
- [ ] Preencha o campo "Conteúdo" com um texto (ex: "Este é o conteúdo da minha nota")
- [ ] Clique em "Salvar Nota"
- [ ] Você deve retornar à tela principal e a nota deve aparecer na lista
- [ ] A nota deve mostrar o título, uma prévia do conteúdo, e a data/hora de criação

### Testes de Validação na Criação
- [ ] Clique em "Nova Nota"
- [ ] Deixe o título vazio e tente salvar → deve mostrar erro "Título e conteúdo não podem ser vazios."
- [ ] Deixe o conteúdo vazio e tente salvar → deve mostrar erro
- [ ] Clique em "Cancelar" → deve retornar à tela principal sem salvar

## 3. Testes de Edição de Notas

### Editar Nota Existente
- [ ] Na tela principal, clique em uma nota existente
- [ ] A tela de edição abre com os dados da nota preenchidos
- [ ] Modifique o título (ex: adicione " - EDITADO" ao final)
- [ ] Modifique o conteúdo
- [ ] Clique em "Salvar Nota"
- [ ] Você deve retornar à tela principal e ver a nota atualizada

### Adicionar Categoria
- [ ] Clique em "Nova Nota"
- [ ] Preencha título e conteúdo
- [ ] No campo "Categoria", digite uma categoria (ex: "Trabalho")
- [ ] Clique em "Salvar Nota"
- [ ] Na tela principal, a nota deve mostrar a categoria como um badge azul

### Adicionar Tags
- [ ] Clique em "Nova Nota"
- [ ] Preencha título e conteúdo
- [ ] No campo "Tags", digite tags separadas por vírgula (ex: "importante, urgente, revisão")
- [ ] Clique em "Salvar Nota"
- [ ] Na tela principal, as tags devem aparecer como badges cinzas com "#"

### Usar Sugestão de Categoria (IA)
- [ ] Clique em "Nova Nota"
- [ ] No campo "Conteúdo", digite um texto que contenha palavras-chave (ex: "Preciso comprar leite, pão e ovos")
- [ ] Clique em "Sugerir Categoria"
- [ ] O campo "Categoria" deve ser preenchido automaticamente (ex: "Compras")

### Usar Áudio para Texto
- [ ] Clique em "Nova Nota"
- [ ] Clique em "Áudio para Texto"
- [ ] O campo "Conteúdo" deve ser preenchido com um texto simulado (ex: "Texto convertido de áudio")

## 4. Testes de Busca e Filtragem

### Buscar por Título
- [ ] Crie várias notas com títulos diferentes
- [ ] Na barra de busca, digite parte de um título
- [ ] Apenas as notas com esse título devem aparecer
- [ ] Limpe a busca (apague o texto) → todas as notas devem retornar

### Buscar por Conteúdo
- [ ] Na barra de busca, digite uma palavra que está no conteúdo de uma nota
- [ ] Apenas as notas com essa palavra devem aparecer

### Buscar por Tag
- [ ] Na barra de busca, digite uma tag (com ou sem #)
- [ ] Apenas as notas com essa tag devem aparecer

### Busca sem Resultados
- [ ] Na barra de busca, digite uma palavra que não existe em nenhuma nota
- [ ] Deve aparecer a mensagem "Nenhuma nota encontrada para 'palavra'"

## 5. Testes de Exclusão

### Deletar Nota
- [ ] Na tela principal, clique no ícone de lixeira de uma nota
- [ ] Uma confirmação deve aparecer: "Tem certeza que deseja excluir esta nota?"
- [ ] Clique em "Cancelar" (ou "Não") → a nota deve permanecer
- [ ] Clique novamente no ícone de lixeira
- [ ] Clique em "Confirmar" (ou "Sim") → a nota deve ser removida da lista

## 6. Testes de Navegação

### Botão Voltar
- [ ] Clique em "Nova Nota"
- [ ] Na tela de edição, clique em "Voltar" (ou no botão de seta)
- [ ] Você deve retornar à tela principal sem salvar

### Botão Sobre
- [ ] Na tela principal, clique em "Sobre" (ícone de "i")
- [ ] A tela "Sobre" deve aparecer com informações do projeto
- [ ] Clique em "Voltar" → você deve retornar à tela principal

### Botão Logout
- [ ] Na tela principal, clique em "Logout" (ícone de saída)
- [ ] Você deve ser redirecionado para a tela de login
- [ ] Tente fazer login novamente com o mesmo usuário → deve funcionar

## 7. Testes de Persistência (localStorage)

### Dados Persistem após Recarregar
- [ ] Crie uma nota com título "Teste de Persistência"
- [ ] Recarregue a página (F5 ou Ctrl+R)
- [ ] A nota deve continuar visível na tela principal
- [ ] Os dados do usuário logado devem ser mantidos

### Dados Persistem após Fechar e Reabrir
- [ ] Crie uma nota
- [ ] Feche completamente o navegador
- [ ] Reabra o navegador e acesse o app
- [ ] Você deve estar logado e a nota deve estar lá

## 8. Testes de Visual e UX

### Responsividade
- [ ] Abra o app em um navegador desktop → deve ter um layout amplo
- [ ] Abra o app em um smartphone (ou use F12 e simule) → deve ter um layout mobile
- [ ] Todos os botões devem ser clicáveis em ambos os tamanhos

### Feedback Visual
- [ ] Passe o mouse sobre os botões → devem mudar de cor (hover)
- [ ] Clique em "Entrar" com campos vazios → deve aparecer uma mensagem de erro em vermelho
- [ ] Ao salvar uma nota, o botão deve mostrar um estado de carregamento (opcional)

### Cores e Ícones
- [ ] Os ícones devem ser visíveis e compreensíveis
- [ ] As cores devem ser consistentes (azul para ações principais, vermelho para deletar, etc.)
- [ ] O texto deve ser legível em todas as telas

## 9. Testes de Casos Extremos

### Nota com Texto Muito Longo
- [ ] Crie uma nota com um conteúdo muito longo (vários parágrafos)
- [ ] Na tela principal, o conteúdo deve ser truncado com "..."
- [ ] Ao clicar na nota, o conteúdo completo deve aparecer

### Muitas Notas
- [ ] Crie 10+ notas
- [ ] A lista deve ser rolável
- [ ] A busca deve funcionar corretamente mesmo com muitas notas

### Caracteres Especiais
- [ ] Crie uma nota com caracteres especiais (acentos, emojis, símbolos)
- [ ] A nota deve ser salva e exibida corretamente

## Resultado Final

Se todos os testes passarem, o Diário Digital está **100% pronto para ser entregue** ao professor!

**Próximas etapas:**
1. Faça o build final: `npm run build`
2. Faça o deploy na Vercel/Netlify
3. Compartilhe o link com o professor
4. Prepare o vídeo de 10 minutos mostrando o funcionamento
