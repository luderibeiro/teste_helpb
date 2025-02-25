# Descrição do Projeto

O **Simulador de Orçamentos Farmacêuticos** é uma aplicação **React** desenvolvida para facilitar a criação de orçamentos na indústria farmacêutica. A ferramenta permite a seleção de clientes, adição de produtos, definição de margens de lucro e cálculo automático de preços, receitas, lucros e custos. Além disso, oferece a funcionalidade de exportar o orçamento em **PDF** ou **CSV**.

---

# Funcionalidades Implementadas

## Seleção de Cliente

-   O usuário pode selecionar um cliente a partir de um **dropdown**.
-   Cada cliente possui informações como **nome, empresa, estado, CNPJ e orçamento**.

## Seleção de Produtos

-   O usuário pode adicionar produtos ao orçamento.
-   Cada produto possui **nome, preço de fábrica, descrição e segmento**.

## Cálculos Automáticos

A aplicação realiza cálculos automáticos com base no cliente e nos produtos selecionados, incluindo:

-   **Preço de Venda** (com margem de lucro).
-   **Receita Bruta (RB)**.
-   **Lucro Bruto (LB)**.
-   **Margem Bruta (MB%)**.
-   **Custo das Mercadorias Vendidas (CMV)**.

## Remoção de Produtos

-   O usuário pode remover produtos da lista de orçamento com um botão **"Remover"**.

## Exportação de Orçamento

-   O orçamento pode ser exportado em **PDF** (usando `jsPDF`) ou **CSV** (usando `papaparse` e `file-saver`).

## Interface de Usuário

-   A interface foi estilizada para ser intuitiva e funcional, com **tabelas** e **botões** que facilitam a navegação.

---

# Tecnologias Utilizadas

-   **React**: Biblioteca JavaScript para construção da interface do usuário.
-   **CSS**: Para estilização da aplicação.
-   **jsPDF**: Para geração de PDFs.
-   **papaparse**: Para geração de arquivos CSV.
-   **file-saver**: Para salvar arquivos CSV no navegador.

---

# Estrutura do Código

## Mocks de Dados

-   `clientes`: Array de objetos contendo informações dos clientes.
-   `produtos`: Array de objetos contendo informações dos produtos.
-   `taxasICMS`: Objeto com as taxas de ICMS por estado.
-   `tabelaRepasse`: Objeto com os percentuais de repasse por estado.

## Componentes Principais

-   **App**: Componente principal que gerencia o estado da aplicação e renderiza a interface.
-   **Seleção de Cliente**: Dropdown para escolher o cliente.
-   **Seleção de Produtos**: Dropdown para adicionar produtos ao orçamento.
-   **Tabela de Produtos**: Exibe os produtos selecionados e permite ajustar a quantidade.
-   **Cálculos e Resultados**: Exibe os resultados dos cálculos em tempo real.
-   **Exportação**: Botões para gerar PDF ou CSV.

---

# Próximos Passos e Melhorias

## Validação de Dados

-   Adicionar validações para garantir que o usuário não insira valores inválidos, como **margens de lucro negativas** ou **quantidades zeradas**.

## Melhorias no PDF

-   Adicionar mais informações ao **PDF**, como **nome do cliente, data do orçamento** e um **layout mais profissional**.

## Histórico de Orçamentos

-   Implementar uma funcionalidade para **salvar e consultar orçamentos anteriores**.

## Cálculos Mais Complexos

-   Adicionar cálculos de **impostos específicos** de cada estado ou **descontos personalizados**.

## Interface Mais Amigável

-   Melhorar a interface com **menus suspensos, gráficos de lucro** e uma **barra de progresso para o orçamento**.

## Integração com Planilhas

-   Permitir a **importação de dados diretamente de planilhas externas**.
