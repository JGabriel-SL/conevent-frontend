# 🎟️ Sistema de Gestão de Eventos

Uma aplicação web moderna e responsiva para o gerenciamento completo do ciclo de vida de eventos. O sistema consolida informações espalhadas, permitindo o controle de orçamentos, fornecedores, convidados e feedback em uma única interface *Clean UI*.

## ✨ Funcionalidades Principais

O sistema é dividido em 5 módulos integrados:

* **📊 Dashboard:** Visão geral com métricas de eventos ativos, orçamentos em negociação e convites enviados.
* **📅 Gestão de Eventos:** Cadastro de eventos com controle de status (Planejamento, Confirmado, Concluído, Cancelado).
* **💰 Orçamentos e Negociações:** Painel estilo Kanban para controle de necessidades (Buffet, Som, etc.), status de negociação com fornecedores e cálculo automático do custo previsto vs. realizado.
* **✉️ Convidados e Convites:** Gestão de lista de presença (RSVP).
* **⭐ Feedback (Pós-Evento):** Disparo de pesquisas de satisfação e painel de resultados com média de notas e comentários.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS / UI Components
* **Roteamento/Estado:** Context API (ex: `EventContext`)

## 🚀 Como executar o projeto localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passo a passo

1. Clone este repositório:
```bash
git clone [https://github.com/seu-usuario/nome-do-repositorio.git](https://github.com/seu-usuario/nome-do-repositorio.git)
```

2. Acesse a pasta do projeto:
```bash
cd nome-do-repositorio
```

3. Instale as dependências:
```bash
npm install
# ou
yarn install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

5. Acesse no seu navegador:
O terminal exibirá o link local (geralmente http://localhost:8080/ ou a porta configurada).