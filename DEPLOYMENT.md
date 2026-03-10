# Guia de Implantação do Diário Digital (Front-end React Estático)

Este documento descreve o processo de implantação do Front-end do Diário Digital, desenvolvido em React com Vite, como um aplicativo estático. Ele inclui instruções para a construção (build) do projeto e considerações para hospedagem.

## 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

*   **Node.js** (versão 18 ou superior)
*   **npm** (gerenciador de pacotes do Node.js)

## 2. Construção do Projeto para Produção

Para gerar os arquivos estáticos otimizados para produção, siga os passos abaixo:

1.  **Navegue até o diretório do projeto:**
    ```bash
    cd /caminho/para/react-digital-diary
    ```

2.  **Instale as dependências (se ainda não o fez):**
    ```bash
    npm install
    ```

3.  **Execute o comando de build:**
    ```bash
    npm run build
    ```

    Este comando irá compilar o código React, otimizar os ativos (CSS, JavaScript, imagens) e gerar uma pasta `dist` na raiz do projeto. Esta pasta `dist` contém todos os arquivos estáticos necessários para hospedar a aplicação.

## 3. Hospedagem Estática

O conteúdo da pasta `dist` pode ser hospedado em qualquer serviço de hospedagem de sites estáticos. Alguns exemplos populares incluem:

*   **Netlify**
*   **Vercel**
*   **GitHub Pages**
*   **Firebase Hosting**
*   **Amazon S3**

O processo geral para hospedagem é:

1.  **Faça o upload do conteúdo da pasta `dist`** para o seu provedor de hospedagem estática.
2.  **Configure o servidor web** para servir o `index.html` como o arquivo padrão para todas as rotas (isso é importante para aplicações de página única - SPA como o React, para que as rotas internas funcionem corretamente).

### Exemplo de Configuração (Netlify/Vercel)

Serviços como Netlify e Vercel detectam automaticamente projetos Vite e configuram o build e a hospedagem. Você geralmente só precisa conectar seu repositório Git e especificar a pasta `dist` como o diretório de publicação.

## 4. Variáveis de Ambiente (Considerações para Back-end)

O Front-end atual do Diário Digital utiliza `localStorage` para persistência de dados e não se comunica com um Back-end externo. Portanto, **não há necessidade de configurar variáveis de ambiente para URLs de API ou credenciais de banco de dados no Front-end React para esta versão específica**.

No entanto, se no futuro for implementado um Back-end (por exemplo, a versão Java ou Node.js que foi desenvolvida anteriormente), as seguintes considerações seriam aplicáveis:

*   **Variáveis de Ambiente no Front-end:** Para acessar uma API externa, você precisaria de uma variável de ambiente para a URL da API. Com Vite, variáveis de ambiente devem ser prefixadas com `VITE_` e podem ser acessadas via `import.meta.env.VITE_SUA_VARIAVEL`.
    *   Exemplo no `.env` (na raiz do projeto React):
        ```
        VITE_API_URL=https://api.seudiariodigital.com
        ```
    *   Exemplo no código React:
        ```javascript
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        // fetch(`${API_BASE_URL}/notes`, ...)
        ```

*   **Variáveis de Ambiente no Back-end:** Se um Back-end fosse utilizado, ele precisaria de suas próprias variáveis de ambiente para credenciais de banco de dados, chaves de API externas, etc. Estas seriam configuradas no ambiente do servidor onde o Back-end está hospedado (ex: `.env` para Node.js, variáveis de ambiente do sistema para Java Spring Boot).

## 5. Resumo da Implementação para Hospedagem

O Front-end do Diário Digital está configurado para ser uma aplicação estática, construída com `npm run build`, resultando em uma pasta `dist` que pode ser facilmente implantada em qualquer provedor de hospedagem estática. A ausência de um Back-end externo simplifica o processo de implantação, eliminando a necessidade de gerenciar variáveis de ambiente de API ou banco de dados no Front-end. A persistência de dados é tratada localmente via `localStorage`.
