# API de raças equinas

API REST em Node.js e Express para consultar informações de raças de cavalos. Os dados iniciais ficam localmente no projeto; não é necessário configurar banco de dados ou serviços externos.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação e execução

Na pasta do projeto, instale as dependências:

```bash
npm install
```

Inicie em modo de desenvolvimento, com reinício automático:

```bash
npm run dev
```

Ou inicie em modo normal:

```bash
npm start
```

Por padrão, a API fica disponível em `http://localhost:3000`. Para escolher outra porta, defina a variável de ambiente `PORT` antes de iniciar o servidor.

## Endpoints

Todas as respostas usam JSON. A pesquisa por nome não diferencia maiúsculas/minúsculas nem acentos e aceita correspondências parciais.

| Método | Endpoint | Resultado |
| --- | --- | --- |
| GET | `/api/racas` | Lista todas as raças e o total |
| GET | `/api/racas/:id` | Consulta uma raça por ID numérico |
| GET | `/api/racas/buscar/:nome` | Pesquisa raças pelo nome |

Exemplos:

```text
GET http://localhost:3000/api/racas
GET http://localhost:3000/api/racas/1
GET http://localhost:3000/api/racas/buscar/arab
```

Os objetos incluem `id`, `nome`, `origem`, `alturaMediaCm`, `pesoMedioKg`, `pelagem`, `temperamento`, `finalidade` e `descricao`. Altura e peso são valores médios aproximados, não substituem orientação veterinária ou padrões oficiais de registro.

## Códigos HTTP

- `200`: consulta concluída.
- `400`: parâmetro inválido, como ID que não seja inteiro positivo.
- `404`: rota ou raça não encontrada.
- `500`: erro inesperado no servidor.

As falhas retornam um objeto `error` com `code` e `message`.

## Testes

Instale as dependências e execute:

```bash
npm test
```

## Organização e persistência futura

- `src/data/racas.js`: dados locais iniciais.
- `src/repositories/racas.repository.js`: acesso e pesquisa dos dados.
- `src/controllers/racas.controller.js`: regras das respostas HTTP.
- `src/routes/racas.routes.js`: definição dos endpoints.
- `src/middleware/error-handler.js`: tratamento de erros inesperados.
- `src/app.js` e `src/server.js`: configuração Express e inicialização.

A camada de repositório separa os controladores da origem dos dados. Quando um banco for adotado, essa implementação poderá ser substituída sem acoplar consultas ao código das rotas; nenhuma integração externa está configurada.