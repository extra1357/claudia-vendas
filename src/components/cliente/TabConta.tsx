"use client";

import { useState, useEffect } from "react";
import { useCliente } from "@/hooks/useCliente";

export default function TabConta() {
  const { cliente, salvarCliente } = useCliente();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (cliente) { setNome(cliente.nome || ""); setTelefone(cliente.telefone || ""); }
  }, [cliente]);

  function fmtFone(v: string) {
    const n = v.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 2) return n;
    if (n.length <= 7) return "(" + n.slice(0,2) + ") " + n.slice(2);
    return "(" + n.slice(0,2) + ") " + n.slice(2,7) + "-" + n.slice(7);
  }

  async function handleSalvar() {
    if (!nome.trim() || telefone.replace(/\D/g, "").length < 10) return;
    const dados = { nome: nome.trim(), telefone: telefone.replace(/\D/g, "") };
    try {
      await fetch("/api/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) });
    } catch (e) { console.error(e); }
    salvarCliente(dados);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  }

  return (
    <div className="tab-conta">
      <h2>Minha Conta</h2>
      <p className="sub-conta">Seus dados ficam salvos para os proximos pedidos.</p>
      <div className="form-conta">
        <label>Nome completo
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
        </label>
        <label>WhatsApp / Telefone
          <input type="tel" value={telefone} onChange={(e) => setTelefone(fmtFone(e.target.value))} placeholder="(11) 99999-9999" />
        </label>
        <button className="btn-salvar" onClick={handleSalvar} disabled={!nome.trim() || telefone.replace(/\D/g, "").length < 10}>
          {salvo ? "Salvo!" : "Salvar dados"}
        </button>
      </div>
      {cliente?.nome && (
        <div className="card-cliente">
          <p>👤 <strong>{cliente.nome}</strong></p>
          <p>📱 {telefone}</p>
          <small>Cadastrado no Claudia Cakes</small>
        </div>
      )}
    </div>
  );
}
