## Visão Geral

O `video-processor-api` é uma API RESTful projetada para lidar com tarefas de processamento de vídeo, como transcodificação, geração de miniaturas e extração de metadados. Ele fornece uma maneira escalável e eficiente de gerenciar fluxos de trabalho de processamento de vídeo.

## Recursos

- Transcodificação de vídeo para múltiplos formatos.
- Geração de miniaturas para pré-visualização de vídeos.
- Extração de metadados de vídeo (ex.: duração, resolução, codec).
- Suporte para processamento em lote.
- Processamento assíncrono com rastreamento do status dos trabalhos.

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/your-username/video-processor-api.git
    cd video-processor-api
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente:
    Crie um arquivo `.env` no diretório raiz e defina as variáveis necessárias. Consulte o arquivo `.env.example` para orientação.

4. Inicie o servidor:
    ```bash
    npm start
    ```

## Endpoints da API

### POST /api/videos/upload
Faça o upload de um vídeo para processamento.

**Requisição:**
- `file`: Arquivo de vídeo (multipart/form-data)

**Resposta:**
- `jobId`: Identificador único para o trabalho de processamento.

### GET /api/jobs/:jobId
Verifique o status de um trabalho de processamento.

**Resposta:**
- `status`: Status atual do trabalho (`pending`, `processing`, `completed`, `failed`).
- `result`: Detalhes do vídeo processado (se concluído).

## Estrutura do Projeto

O projeto segue uma estrutura padrão de aplicação Node.js:

```
video-processor-api/
├── src/
│   ├── controllers/       # Manipuladores de requisição para os endpoints da API
│   ├── services/          # Lógica de negócios e serviços de processamento de vídeo
│   ├── models/            # Modelos de dados e esquemas de banco de dados
│   ├── routes/            # Definições de rotas da API
│   ├── utils/             # Funções utilitárias e helpers
│   ├── middlewares/       # Middleware personalizado (ex.: tratamento de erros, autenticação)
│   └── app.js             # Configuração do aplicativo Express
├── config/
│   ├── default.json       # Configurações padrão
│   └── production.json    # Configurações específicas de produção
├── public/                # Arquivos estáticos (se houver)
├── tests/                 # Testes unitários e de integração
├── .env.example           # Exemplo de variáveis de ambiente
├── package.json           # Metadados do projeto e dependências
├── README.md              # Documentação do projeto
└── server.js              # Ponto de entrada da aplicação
```

Essa estrutura garante modularidade, escalabilidade e manutenibilidade do código.