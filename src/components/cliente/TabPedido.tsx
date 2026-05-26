"use client";
import { useState } from "react";
import { useCarrinho } from "@/hooks/useCarrinho";
import { useCliente } from "@/hooks/useCliente";

const WAS = [
  { nome: "Claudia", num: "5511984428879" },
  { nome: "Ryan", num: "5511966260872" },
];

export default function TabPedido({ onIrParaConta }: { onIrParaConta: () => void }) {
  const { itens, total, removerItem, atualizarQuantidade, limparCarrinho } = useCarrinho();
  const { cliente } = useCliente();
  const [obs, setObs] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [escolhendo, setEscolhendo] = useState(false);
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  async function handleEnviar() {
    if (!cliente?.nome || !cliente?.telefone) { onIrParaConta(); return; }
    if (itens.length === 0) return;
    setEnviando(true);
    try {
      await fetch("/api/pedidos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clienteNome: cliente.nome, clienteTelefone: cliente.telefone, observacoes: obs, itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade, precoUnitario: i.preco })) }) });
    } catch (e) { console.error(e); }
    setEnviando(false);
    setEscolhendo(true);
  }

  function enviarParaNumero(num: string) {
    const linhas = itens.map((i) => "- " + i.nome + " x" + i.quantidade + " R$ " + (i.preco * i.quantidade).toFixed(2)).join("\n");
    const aviso = "\n\nPara confirmar seu pedido, envie o comprovante de pagamento para este numero.";
    const msg = "*Pedido Claudia Cakes*\n\nCliente: " + cliente!.nome + "\nTel: " + cliente!.telefone + "\n\nItens:\n" + linhas + "\n\nTotal: " + fmt(total) + (obs ? "\nObs: " + obs : "") + aviso;
    window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(msg), "_blank");
    limparCarrinho(); setObs(""); setEscolhendo(false);
  }

  if (itens.length === 0) return (<div className="vazio-pedido"><span className="icone-vazio">🛒</span><p>Carrinho vazio</p><small>Adicione itens pelo cardapio</small></div>);

  return (
    <div className="tab-pedido">
      <h2>Seu Pedido</h2>
      <ul className="lista-pedido">
        {itens.map((item) => (
          <li key={item.produtoId} className="item-pedido">
            <div className="item-info">
              <span className="item-nome">{item.nome}</span>
              <span className="item-preco">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
            <div className="item-controles">
              <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}>-</button>
              <span>{item.quantidade}</span>
              <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}>+</button>
              <button className="btn-remover" onClick={() => removerItem(item.produtoId)}>X</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="total-pedido"><span>Total</span><strong>{fmt(total)}</strong></div>
      <textarea className="campo-obs" placeholder="Observacoes..." value={obs} onChange={(e) => setObs(e.target.value)} rows={3} />
      {!cliente?.nome && (<p className="aviso-conta"><button className="link-conta" onClick={onIrParaConta}>Cadastre seus dados</button> antes de enviar</p>)}

      {!escolhendo ? (
        <button className="btn-enviar" onClick={handleEnviar} disabled={enviando || itens.length === 0}>
          {enviando ? "Salvando..." : "Enviar pelo WhatsApp"}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontWeight: 700, marginBottom: "4px" }}>Escolha para quem enviar:</p>
          {WAS.map((w) => (
            <button key={w.num} className="btn-enviar" onClick={() => enviarParaNumero(w.num)}
              style={{ background: "#25d366" }}>
              Enviar para {w.nome}
            </button>
          ))}
          <button onClick={() => setEscolhendo(false)} style={{ background: "none", border: "1px solid #ccc", borderRadius: "8px", padding: "10px", cursor: "pointer" }}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
