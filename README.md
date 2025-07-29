# Web Login

## Objetivo
Construir uma aplicação web em HTML e CSS que consome a API REST (api-login) rodando localmente na porta 3000. O objetivo é servir como base para estudos de teste de software, complementando a API-Login.

## Funcionalidades
- **Tela de Login:**
  - Consome `/api/users/login` para autenticação.
  - Link para "Esqueci minha senha" que consome `/api/users/recover`.
- **Tela de Cadastro:**
  - Consome `/api/users/register` para criar novos usuários.
- **Tela de Listagem de Usuários:**
  - Consome `/api/users` para listar todos os cadastros.
- **Tela de Alteração de Senha:**
  - Consome `/api/users/update` para alterar senha.
  - Consome `/api/users/recover` para recuperação de senha.

## Estrutura de Pastas
```
web-login/
│
├── index.html            # Página inicial (login)
├── register.html         # Tela de cadastro
├── users.html            # Listagem de usuários
├── update-password.html  # Alteração de senha
├── assets/
│   ├── css/
│   │   └── style.css     # Estilos gerais
│   └── img/              # Imagens (opcional)
├── js/
│   ├── api.js            # Funções para consumir a API
│   └── main.js           # Scripts gerais e navegação
└── README.md             # Este arquivo
```

## Como Executar
1. Certifique-se de que a API está rodando em `http://localhost:3000`.
2. Clone este repositório ou copie os arquivos para uma pasta local.
3. Rodar a aplicação de acordo com instruções abaixo.
4. Navegue entre as telas utilizando os links ou botões disponíveis.

### Rodando a aplicação em um servidor local (porta 4000)
Você pode servir os arquivos estáticos usando Node.js e o pacote `http-server` em qualquer porta (exceto 3000). Exemplo usando a porta 4000:

#### 1. Instale o http-server globalmente (recomendado):
```sh
npm install -g http-server
```

#### 2. Rode o servidor na porta 4000:
```sh
http-server -p 4000
```
Acesse: [http://localhost:4000](http://localhost:4000)

#### Alternativa usando npx (sem instalar globalmente):
```sh
npx http-server -p 4000
```

A aplicação web continuará consumindo a API em `http://localhost:3000` normalmente.

## Observações
- O projeto utiliza apenas HTML, CSS e JavaScript puro (vanilla JS).
- Não há backend próprio, todo consumo é feito diretamente na API fornecida.
- O foco é didático, para fins de estudo e testes.

## Telas
- **Login:** Formulário de login e link para recuperação de senha.
- **Cadastro:** Formulário para novo usuário.
- **Listagem:** Tabela com todos os usuários cadastrados.
- **Alteração de Senha:** Formulário para atualizar senha.

## API Referência
Consulte a documentação da API em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

---
Projeto para fins de estudo. Não utilizar em produção. 