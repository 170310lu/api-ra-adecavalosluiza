# Atlas Equino

Aplicação para consultar e administrar um catálogo de raças equinas. O backend usa Node.js, Express, Prisma ORM 6.19.3 e SQLite. O frontend usa React e Vite.

## Requisitos

- Node.js 18 ou superior
- npm

## Configuração do backend

Na raiz do projeto, instale as dependências e crie o arquivo de ambiente local:

```bash
npm install
```

Copie `.env.example` para `.env` e defina um valor privado para `JWT_SECRET`. O valor padrão de `DATABASE_URL` cria o banco SQLite persistente em `prisma/dev.db`.

Gere o Prisma Client, sincronize o schema e carregue as raças iniciais:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Inicie a API:

```bash
npm run dev
```

A API ficará em `http://localhost:3000`. Para iniciar sem reinício automático, use `npm start`.

## Configuração do frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. A URL padrão da API é `http://localhost:3000/api`; para alterá-la, copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`.

## API

Todas as respostas usam JSON. Os endpoints de leitura de raças são públicos. Cadastro, atualização e exclusão exigem `Authorization: Bearer <token>`.

| Método | Endpoint | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/api/racas` | Público | Lista raças e total |
| GET | `/api/racas/:id` | Público | Consulta uma raça por ID |
| GET | `/api/racas/buscar/:nome` | Público | Pesquisa por nome, ignorando caixa e acentos |
| POST | `/api/racas` | JWT | Cadastra uma raça |
| PATCH | `/api/racas/:id` | JWT | Atualiza uma raça |
| DELETE | `/api/racas/:id` | JWT | Exclui uma raça |
| POST | `/api/auth/cadastro` | Público | Cadastra usuário |
| POST | `/api/auth/login` | Público | Valida credenciais e retorna JWT |
| GET | `/api/auth/me` | JWT | Retorna o usuário autenticado |

O cadastro de usuário recebe `nome`, `email` e `senha`; a senha precisa ter pelo menos 8 caracteres e é armazenada com bcrypt. Para criar uma raça, envie `nome`, `origem`, `alturaMediaCm`, `pesoMedioKg`, `pelagem`, `temperamento`, `finalidade` e `descricao`.

## Testes

```bash
npm test
```

A suíte usa `prisma/test.db`, separado do banco de desenvolvimento, e cobre consultas, validações, cadastro/login, JWT, proteção e CRUD.

Para validar a interface de produção:

```bash
cd frontend
npm run build
```

## Persistência e arquivos locais

O schema Prisma está em `prisma/schema.prisma`. Os repositories acessam o banco via Prisma Client; `src/data/racas.js` contém somente os dados usados pelo seed inicial. O SQLite local e os arquivos `.env` são ignorados pelo Git. Não publique segredos ou o arquivo de banco.