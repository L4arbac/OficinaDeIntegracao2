# Oficina de Integração 2 - Sistema de Registro de Presença

## Equipe:
- Gustavo Henrique de Oliveira Camargo - RA: 2350599
- Jacó Cabral de Jesus - RA: 2348004

---

## Descrição do Projeto
Este projeto foi desenvolvido para a disciplina "Oficina de Integração 2", com o objetivo de integrar conteúdos de disciplinas anteriores do curso de Engenharia de Software. O sistema apoia o projeto de extensão ELLP (Ensino Lúdico de Lógica e Programação) no gerenciamento de presença dos alunos nas oficinas de ensino.

## 1. Organização e Tema do Projeto
- **Tema**: Registro de presença em oficinas de ensino.
- **Objetivo**: Desenvolver um sistema que registre e gerencie a presença de alunos nas atividades do projeto ELLP, incluindo horários de entrada e saída, além da geração de relatórios de frequência.

## 2. Requisitos Funcionais
- **Autenticação e Autorização**: Controle de acesso com perfis diferenciados para administradores, voluntários e alunos.
- **Cadastro de Usuários**: Armazenar informações essenciais, como nome, email, curso e RA dos alunos.
- **Certificados de participação**: Gerar e visualizar certificados de participação do workshop.
- **Geração de PDFs de certificado**: Gerar PDFs dos certificados de participação de workshops.
- **Gerenciamento de Turmas**: Ferramenta para criar, editar e organizar as turmas e 
suas datas.


## 3. Arquitetura do Sistema
O sistema foi planejado seguindo uma arquitetura de três camadas (3-Tier), composta por:

- **Front-End**: Desenvolvido em React, responsável pela interface e experiência do usuário.
- **Back-End**: Implementado em Node.js com Express, gerenciando a lógica de negócios e a comunicação com o banco de dados.
- **Banco de Dados**: MySQL, utilizado para o armazenamento de informações sobre usuários, oficinas e registros de presença.

## 4. Estratégia de Automação de Testes

Para garantir o bom funcionamento do sistema de Registro de Presença, implementamos uma estratégia de automação de testes que cobre testes unitários, de integração e de ponta a ponta, focando nas principais funcionalidades.

### 4.1 Testes Unitários

- **Objetivo**: Validar que as funções e componentes essenciais do sistema, como cadastro de workshops, geração de certificados e controle de presença, funcionem corretamente de forma isolada.
- **Ferramentas**: Jest e Mocha.
  - **Jest**: Utilizado principalmente para testar componentes do React.
    - **Exemplo**: Verificar se o botão de "Cadastrar Workshop" está habilitado apenas quando todos os campos obrigatórios estão preenchidos.
  - **Mocha**: Empregado no back-end em Node.js para verificar a lógica das funções responsáveis pela manipulação de dados e validações.
    - **Exemplo**: Testar a função que gera o certificado de participação, verificando se o PDF é criado corretamente e contém as informações necessárias (nome do aluno, data, workshop).

### 4.2 Testes de Integração

- **Objetivo**: Avaliar a interação entre diferentes partes do sistema, como a API e o banco de dados, garantindo que o cadastro de workshops, registro de presença e geração de certificados funcionem de ponta a ponta.
- **Ferramenta para Testes de Endpoints**: SuperTest.
  - **SuperTest**: Utilizado para simular requisições HTTP (GET, POST) aos endpoints da API.
    - **Exemplo**: Enviar uma requisição POST para criar um novo workshop e verificar se o workshop é salvo corretamente no banco de dados.
    - **Exemplo**: Enviar uma requisição POST para registrar a presença de um aluno em um workshop e verificar se o status de presença do aluno é atualizado corretamente.

### 4.3 Testes de Front-End

- **Objetivo**: Garantir que a interface em React funcione corretamente e que os usuários possam realizar ações como cadastro de workshops e visualização de certificados.
- **Ferramentas**: Jest e SuperTest.
  - **Jest**: Realiza testes unitários em componentes do React.
    - **Exemplo**: Testar o formulário de cadastro de workshop, verificando se os campos obrigatórios estão presentes e exibem mensagens de erro quando deixados em branco.
  - **SuperTest**: Testa a comunicação entre o front-end e a API.
    - **Exemplo**: Simular o envio de dados de um workshop a partir do front-end e verificar se a resposta da API é correta e se os dados são exibidos na interface.

### 4.4 Testes de Ponta a Ponta (E2E) com Cypress

- **Objetivo**: Simular o uso completo do sistema, validando que os principais fluxos — como cadastro de workshop, registro de presença e geração de certificados — funcionam do início ao fim.
- **Ferramenta**: Cypress.
  - **Cypress**: Usado para simular a interação do professor com o sistema.
    - **Exemplo**: Simular o fluxo onde o professor faz login, cadastra um novo workshop, registra a presença dos alunos e, ao final, gera os certificados de participação.
    - **Exemplo**: Verificar se o aluno pode visualizar seus certificados na página correta após o professor concluir o registro de presença e geração de certificados.


## 5. Tecnologias Utilizadas
- **Front-End**: React com Material UI para a interface de usuário.
- **Back-End**: Node.js com Express.
- **Banco de Dados**: MySQL.
- **Testes**: Jest e Mocha.
- **Integração Contínua**: GitHub Actions para automação dos testes.

---

Este repositório contém as informações e artefatos necessários para a configuração e desenvolvimento do projeto.
