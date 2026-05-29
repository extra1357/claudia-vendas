"use client";

import { useState } from "react";
import { useCarrinho } from "@/hooks/useCarrinho";
import TabCardapio from "@/components/cliente/TabCardapio";
import TabPedido from "@/components/cliente/TabPedido";
import TabConta from "@/components/cliente/TabConta";
import TabInfo from "@/components/cliente/TabInfo";
import FundoAnimado from "@/components/cliente/FundoAnimado";

type Aba = "cardapio" | "pedido" | "conta" | "info";

export default function Home() {
  const [aba, setAba] = useState<Aba>("cardapio");
  const { itens } = useCarrinho();
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {aba !== "info" && <FundoAnimado />}
      <header className="app-header">
        <h1>Claudia Cakes</h1>
        <p>Bolos, tortas e salgados artesanais</p>
      </header>
      <nav className="tabs-nav">
        <button className={aba === "cardapio" ? "ativa" : ""} onClick={() => setAba("cardapio")}>
          <span className="tab-icone">🎂</span>Cardapio
        </button>
        <button className={aba === "pedido" ? "ativa" : ""} onClick={() => setAba("pedido")}>
          <span className="tab-icone">🛒{totalItens > 0 && <span className="badge">{totalItens}</span>}</span>Pedido
        </button>
        <button className={aba === "conta" ? "ativa" : ""} onClick={() => setAba("conta")}>
          <span className="tab-icone">👤</span>Minha Conta
        </button>
        <button className={aba === "info" ? "ativa" : ""} onClick={() => setAba("info")}>
          <span className="tab-icone">ℹ️</span>Info
        </button>
      </nav>
      <main className="tab-conteudo">
        {aba === "cardapio" && <TabCardapio onAdicionado={() => {}} />}
        {aba === "pedido" && <TabPedido onIrParaConta={() => setAba("conta")} />}
        {aba === "conta" && <TabConta />}
        {aba === "info" && <TabInfo />}
      </main>
      <footer style={{textAlign: "center", padding: "20px 0 32px", marginTop: "8px"}}>
        <a href="https://instagram.com/claudiathecakes" target="_blank" rel="noopener noreferrer" style={{display: "inline-flex", alignItems: "center", gap: "6px", color: "#c13584", fontWeight: "700", fontSize: "0.9rem", textDecoration: "none"}}>
          📸 Siga-nos no Instagram @claudiathecakes
        </a>
      </footer>
    </div>
  );
}
