# Oficina de Integração 2 - Sistema de Gerencia de Certificados

## Equipe:
- Gustavo Henrique de Oliveira Camargo - RA: 2350599
- Jacó Cabral de Jesus - RA: 2348004

---

## Descrição do Projeto
Este projeto foi desenvolvido para a disciplina "Oficina de Integração 2", com o objetivo de integrar conteúdos de disciplinas anteriores do curso de Engenharia de Software. O sistema apoia o projeto de extensão ELLP (Ensino Lúdico de Lógica e Programação) no gerenciamento de certificados dos alunos nas oficinas de ensino.

## 1. Organização e Tema do Projeto
- **Tema**: Registro de geração de certificados em oficinas de ensino.
- **Objetivo**: Desenvolver um sistema que registre e gerencie a geração de certificados para alunos nas atividades do projeto ELLP.

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
- **Banco de Dados**: MySQL, utilizado para o armazenamento de informações sobre usuários, oficinas e geração de certificado.

![Diagrama Da Arquitetura](./Diagramas/Diagrama%20da%20arquitetura.png)


## 4. Estratégia de Automação de Testes

Para garantir o bom funcionamento do sistema de Geração de certificaados, implementamos uma estratégia de automação de testes que cobre testes unitários e de integração, focando nas principais funcionalidades.

### 4.1 Testes Unitários

- **Objetivo**: Validar que as funções e componentes essenciais do sistema, como cadastro de workshops, geração de certificados e controle de presença, funcionem corretamente de forma isolada.
- **Ferramentas**: Jest ou Mocha.
  - **Jest**: Utilizado principalmente para testar componentes do React.
    - **Exemplo**: Verificar se o botão de "Cadastrar Workshop" está habilitado apenas quando todos os campos obrigatórios estão preenchidos.
  - **Mocha**: Empregado no back-end em Node.js para verificar a lógica das funções responsáveis pela manipulação de dados e validações.
    - **Exemplo**: Testar a função que gera o certificado de participação, verificando se o PDF é criado corretamente e contém as informações necessárias (nome do aluno, data, workshop).

### 4.2 Testes de Front-End

- **Objetivo**: Simular o uso completo do sistema, validando que os principais fluxos — como cadastro de workshop e geração de certificados — funcionam do início ao fim.
- **Ferramenta**: Cypress.
  - **Cypress**: Usado para simular a interação do professor com o sistema.
    - **Exemplo**: Simular o fluxo onde o professor faz login, cadastra um novo workshop, registra a presença dos alunos e, ao final, gera os certificados de participação.
    - **Exemplo**: Verificar se o aluno pode visualizar seus certificados na página correta após o professor concluir o registro de presença e geração de certificados.


## 5. Tecnologias Utilizadas
- **Front-End**: React com Material UI para a interface de usuário.
- **Back-End**: Node.js com Express.
- **Banco de Dados**: MySQL.
- **Testes**: Mocha e Cypress.

---

Este repositório contém as informações e artefatos necessários para a configuração e desenvolvimento do projeto.
