## Diário Digital

Aplicativo web de anotações pessoais feito como projeto de extensão do curso de Análise e Desenvolvimento de Sistemas da UniFil.

A ideia é simples: um diário que roda no próprio navegador, organiza as notas por cor, categoria e tags, e deixa tudo fácil de achar. Funciona offline, sem servidor, guardando os dados no próprio navegador.

Você pode acessar em https://danilochiaramonte.github.io/Diario-Digital/

## O que ele faz

Cada usuário cria sua conta e enxerga apenas as próprias notas. As senhas são guardadas com hash SHA-256, gerado direto no navegador pela Web Crypto API.

Nas notas dá pra colocar título, conteúdo, categoria, tags e escolher uma entre sete cores, que aparece na lateral do cartão na tela inicial. A busca encontra qualquer anotação por título, conteúdo, tag ou categoria. Tem também sugestão automática de categoria a partir do conteúdo e a opção de ditar a nota por voz.

No menu de perfil o usuário vê algumas estatísticas das suas notas, troca a senha, exporta e importa um backup em JSON, ou apaga a conta. O app é um PWA, então dá pra instalar na tela inicial do celular e usar offline.

## Tecnologias

React, Vite, JavaScript, Tailwind CSS e PWA. A persistência é feita com localStorage, a criptografia das senhas com a Web Crypto API e o reconhecimento de voz com a Web Speech API.

## Como rodar localmente

Você precisa do Node.js 18 ou superior e do npm.

```
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173/Diario-Digital/`.

Para gerar a versão de produção:

```
npm run build
npm run preview
```

## Deploy

O deploy é automático pelo GitHub Pages. Cada push na branch `main` dispara o GitHub Actions, que faz o build e publica o site. Nas configurações do repositório, em Settings e Pages, a fonte está definida como GitHub Actions.

## Equipe

Danilo Borges Vieira Chiaramonte, João Pedro Palasson Dutra e Matheus Garrido Aquino.

Curso de Análise e Desenvolvimento de Sistemas, Centro Universitário Filadélfia (UniFil), Londrina, 2025.
