import React, { useState } from "react";
import "./App.css";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

// Mocks de Clientes
const clientes = [
    {
        id: 1,
        nome: "Cliente A",
        empresa: "Empresa X",
        estado: "SP",
        cnpj: "12.345.678/0001-00",
        orcamento: 10000,
    },
    {
        id: 2,
        nome: "Cliente B",
        empresa: "Empresa Y",
        estado: "RJ",
        cnpj: "98.765.432/0001-00",
        orcamento: 15000,
    },
    {
        id: 3,
        nome: "Cliente C",
        empresa: "Empresa Z",
        estado: "MG",
        cnpj: "45.678.123/0001-00",
        orcamento: 20000,
    },
    {
        id: 4,
        nome: "Cliente D",
        empresa: "Empresa W",
        estado: "DF",
        cnpj: "11.223.344/0001-00",
        orcamento: 25000,
    },
];

// Mocks de Produtos
const produtos = [
    {
        id: 1,
        nome: "Produto 1",
        precoFabrica: 839.04,
        descricao: "Descrição do Produto 1",
        segmento: "Medicamentos",
    },
    {
        id: 2,
        nome: "Produto 2",
        precoFabrica: 1200.0,
        descricao: "Descrição do Produto 2",
        segmento: "Cosméticos",
    },
    {
        id: 3,
        nome: "Produto 3",
        precoFabrica: 500.0,
        descricao: "Descrição do Produto 3",
        segmento: "Suplementos",
    },
];

// Taxas de ICMS por estado
const taxasICMS = {
    SP: 0.17, // 17%
    RJ: 0.18, // 18%
    MG: 0.19, // 19%
    DF: 0.12, // 12%
};

// Tabela de repasse (baseada na planilha)
const tabelaRepasse = {
    SP: 0.1354,
    RJ: 0.1458,
    MG: 0.1563,
    DF: 0.0538, // Repasse do DF é 5.38%
};

function App() {
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [produtosSelecionados, setProdutosSelecionados] = useState([]);
    const [margemLucro, setMargemLucro] = useState(0);

    const adicionarProduto = (produto) => {
        setProdutosSelecionados([
            ...produtosSelecionados,
            { ...produto, quantidade: 1 },
        ]);
    };

    const removerProduto = (index) => {
        const novosProdutos = produtosSelecionados.filter(
            (_, i) => i !== index
        );
        setProdutosSelecionados(novosProdutos);
    };

    const calcularResultados = () => {
        return produtosSelecionados.map((produto) => {
            const ICMS = clienteSelecionado
                ? taxasICMS[clienteSelecionado.estado]
                : 0;
            const repasse = clienteSelecionado
                ? tabelaRepasse[clienteSelecionado.estado]
                : 0;
            const PF = produto.precoFabrica;
            const PFAjustado = (PF * 0.82) / (1 - ICMS); // Utilizando ICMS aqui
            const PFRepasse = PF - PF * repasse;
            const desconto = 0.06;
            const custoFinal = PFRepasse - PFRepasse * desconto;
            const ICMSCompra = 0.04;
            const custoLiquido = custoFinal * (1 - ICMSCompra);
            const precoVenda = PFAjustado * (1 + margemLucro / 100); // Usando PFAjustado aqui
            const RB = precoVenda * produto.quantidade;
            const impostos = 0.04;
            const RL = RB * (1 - impostos);
            const CMV = custoLiquido * produto.quantidade;
            const LB = RL - CMV;
            const MB = (LB / RL) * 100;

            return {
                ...produto,
                precoVenda,
                RB,
                RL,
                CMV,
                LB,
                MB,
            };
        });
    };

    const resultados = calcularResultados();

    const gerarPDF = () => {
        const doc = new jsPDF();
        doc.text("Orçamento", 10, 10);
        doc.text(
            `Cliente: ${
                clienteSelecionado
                    ? clienteSelecionado.nome
                    : "Nenhum cliente selecionado"
            }`,
            10,
            20
        );
        resultados.forEach((produto, index) => {
            doc.text(
                `${produto.nome} - Quantidade: ${
                    produto.quantidade
                } - Preço: R$ ${produto.precoVenda.toFixed(2)}`,
                10,
                30 + index * 10
            );
        });
        doc.save("orcamento.pdf");
    };

    const gerarCSV = () => {
        const dados = resultados.map((produto) => ({
            Produto: produto.nome,
            Quantidade: produto.quantidade,
            "Preço de Venda": produto.precoVenda.toFixed(2),
            "Receita Bruta": produto.RB.toFixed(2),
            "Lucro Bruto": produto.LB.toFixed(2),
            "Margem Bruta": produto.MB.toFixed(2),
            CMV: produto.CMV.toFixed(2),
        }));
        const csv = unparse(dados);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "orcamento.csv");
    };

    return (
        <div className="container">
            <h1>Simulador de Resultados</h1>

            {/* Seleção de Cliente */}
            <div className="section">
                <h2>Selecionar Cliente</h2>
                <select
                    value={clienteSelecionado ? clienteSelecionado.id : ""}
                    onChange={(e) => {
                        const clienteId = parseInt(e.target.value);
                        const cliente = clientes.find(
                            (c) => c.id === clienteId
                        );
                        setClienteSelecionado(cliente);
                    }}
                >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                            {cliente.nome} ({cliente.estado})
                        </option>
                    ))}
                </select>
            </div>

            {/* Status do Cliente */}
            {clienteSelecionado && (
                <div className="section">
                    <h2>Status do Cliente</h2>
                    <p>
                        <strong>Nome:</strong> {clienteSelecionado.nome}
                    </p>
                    <p>
                        <strong>Empresa:</strong> {clienteSelecionado.empresa}
                    </p>
                    <p>
                        <strong>Estado:</strong> {clienteSelecionado.estado}
                    </p>
                    <p>
                        <strong>CNPJ:</strong> {clienteSelecionado.cnpj}
                    </p>
                    <p>
                        <strong>Orçamento:</strong> R${" "}
                        {clienteSelecionado.orcamento.toFixed(2)}
                    </p>
                </div>
            )}

            {/* Seleção de Produtos */}
            <div className="section">
                <h2>Selecionar Produtos</h2>
                <select
                    onChange={(e) => {
                        const produtoId = parseInt(e.target.value);
                        const produto = produtos.find(
                            (p) => p.id === produtoId
                        );
                        if (produto) adicionarProduto(produto);
                    }}
                >
                    <option value="">Selecione um produto</option>
                    {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                            {produto.nome} (R$ {produto.precoFabrica.toFixed(2)}
                            )
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabela de Produtos Selecionados */}
            <div className="section">
                <h2>Produtos Selecionados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço de Venda</th>
                            <th>Receita Bruta (RB)</th>
                            <th>Lucro Bruto (LB)</th>
                            <th>Margem Bruta (MB%)</th>
                            <th>CMV</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((produto, index) => (
                            <tr key={index}>
                                <td>{produto.nome}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={produto.quantidade}
                                        onChange={(e) => {
                                            const novosProdutos = [
                                                ...produtosSelecionados,
                                            ];
                                            novosProdutos[index].quantidade =
                                                parseFloat(e.target.value);
                                            setProdutosSelecionados(
                                                novosProdutos
                                            );
                                        }}
                                    />
                                </td>
                                <td>R$ {produto.precoVenda.toFixed(2)}</td>
                                <td>R$ {produto.RB.toFixed(2)}</td>
                                <td>R$ {produto.LB.toFixed(2)}</td>
                                <td>{produto.MB.toFixed(2)}%</td>
                                <td>R$ {produto.CMV.toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => removerProduto(index)}
                                    >
                                        Remover
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Margem de Lucro */}
            <div className="section">
                <h2>Margem de Lucro (%)</h2>
                <input
                    type="number"
                    value={margemLucro}
                    onChange={(e) => setMargemLucro(parseFloat(e.target.value))}
                />
            </div>

            {/* Botões para Gerar Orçamento */}
            <div className="section">
                <button onClick={gerarPDF}>Gerar PDF</button>
                <button onClick={gerarCSV}>Gerar CSV</button>
            </div>
        </div>
    );
}

export default App;
