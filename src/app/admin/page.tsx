"use client";

import { useState, useEffect, useCallback } from "react";

type Item = { id: string; quantidade: number; precoUnitario: number; produto: { nome: string } };
type Pedido = { id: string; status: string; total: number; observacoes: string | null; criadoEm: string; cliente: { nome: string; telefone: string }; itens: Item[] };
type Produto = { id: string; nome: string; descricao: string | null; preco: number; disponivel: boolean; estoque: number; categoriaId: string };
type Categoria = { id: string; nome: string; ordem: number; produtos: Produto[] };
type RankProduto = { produto: { id: string; nome: string } | undefined; total: number };
type FiltroStats = "total" | "semana" | "mes";
type ClienteStat = { id: string; nome: string; telefone: string; pedidos: { id: string; total: number; criadoEm: string; itens: Item[] }[] };

const STATUS_LABELS: Record<string, string> = { PENDENTE: "Pendente", CONFIRMADO: "Confirmado", PRONTO: "Pronto", ENTREGUE: "Entregue", CANCELADO: "Cancelado" };
const STATUS_CORES: Record<string, string> = { PENDENTE: "#f59e0b", CONFIRMADO: "#3b82f6", PRONTO: "#8b5cf6", ENTREGUE: "#22c55e", CANCELADO: "#ef4444" };

export default function AdminPage() {
  const [aba, setAba] = useState<"pedidos"|"cardapio"|"clientes"|"stats">("pedidos");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [stats, setStats] = useState<{ rankProdutos: RankProduto[]; clientes: ClienteStat[]; totalVendido: number; totalPedidos: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [novoProd, setNovoProd] = useState({ nome: "", descricao: "", preco: "", estoque: "", categoriaId: "", foto: "" });
  const [novaCat, setNovaCat] = useState("");
  const [filtro, setFiltro] = useState<FiltroStats>("total");

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/pedidos");
    setPedidos(await r.json());
    setLoading(false);
  }, []);

  const fetchCardapio = useCallback(async () => {
    const r = await fetch("/api/admin/categorias");
    setCategorias(await r.json());
  }, []);

  const fetchStats = useCallback(async (f: FiltroStats = "total") => {
    const r = await fetch("/api/admin/stats?filtro=" + f);
    setStats(await r.json());
  }, []);

  useEffect(() => {
    if (aba === "pedidos") fetchPedidos();
    if (aba === "cardapio") fetchCardapio();
    if (aba === "stats" || aba === "clientes") fetchStats(filtro);
  }, [aba, fetchPedidos, fetchCardapio, fetchStats]);

  useEffect(() => { fetchCardapio(); }, [fetchCardapio]);

  async function atualizarStatus(id: string, status: string) {
    await fetch("/api/admin/pedidos/" + id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchPedidos();
  }

  async function cancelarPedido(id: string) {
    if (!confirm("Cancelar este pedido?")) return;
    await fetch("/api/admin/pedidos/" + id, { method: "DELETE" });
    fetchPedidos();
  }

  async function toggleDisponivel(p: Produto) {
    await fetch("/api/admin/produtos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, disponivel: !p.disponivel }) });
    fetchCardapio();
  }

  async function restaurarProduto(id: string) {
    await fetch("/api/admin/produtos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, disponivel: true }) });
    fetchCardapio();
  }

  async function deletarProduto(id: string) {
    if (!confirm("Remover produto?")) return;
    await fetch("/api/produtos/" + id, { method: "DELETE" });
    fetchCardapio();
  }

  async function adicionarProduto() {
    if (!novoProd.nome || !novoProd.preco || !novoProd.categoriaId) return;
    await fetch("/api/admin/produtos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(novoProd) });
    setNovoProd({ nome: "", descricao: "", preco: "", estoque: "", categoriaId: "", foto: "" });
    fetchCardapio();
  }

  async function adicionarCategoria() {
    if (!novaCat.trim()) return;
    const r = await fetch("/api/admin/categorias", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: novaCat, ordem: categorias.length }) });
    const nova = await r.json();
    setNovaCat("");
    await fetchCardapio();
    setNovoProd((p) => ({ ...p, categoriaId: nova.id }));
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const fmtData = (d: string) => new Date(d).toLocaleString("pt-BR");

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#e91e8c", marginBottom: "4px" }}>Claudia Cakes — Admin</h1>
      <nav style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "2px solid #fce4f3", paddingBottom: "8px" }}>
        {(["pedidos","cardapio","clientes","stats"] as const).map((a) => (
          <button key={a} onClick={() => setAba(a)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: aba===a ? "#e91e8c" : "#fce4f3", color: aba===a ? "#fff" : "#333", fontWeight: aba===a ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>{a}</button>
        ))}
        <button onClick={() => aba==="pedidos" ? fetchPedidos() : aba==="cardapio" ? fetchCardapio() : fetchStats()} style={{ marginLeft: "auto", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>↻ Atualizar</button>
              <button onClick={logout} style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>Sair</button>
      </nav>

      {aba === "pedidos" && (
        <div>
          <h2>Pedidos {loading && <small style={{color:"#999"}}>carregando...</small>}</h2>
          {pedidos.length === 0 && !loading && <p style={{color:"#999"}}>Nenhum pedido ainda.</p>}
          {pedidos.map((p) => (
            <div key={p.id} style={{ border: "1px solid #eee", borderRadius: "12px", padding: "16px", marginBottom: "12px", borderLeft: "4px solid " + STATUS_CORES[p.status] }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong>{p.cliente.nome}</strong> <span style={{color:"#666", fontSize:"0.85rem"}}>({p.cliente.telefone})</span><br/>
                  <small style={{color:"#999"}}>{fmtData(p.criadoEm)}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: STATUS_CORES[p.status], color: "#fff", borderRadius: "99px", padding: "2px 10px", fontSize: "0.8rem", fontWeight: 700 }}>{STATUS_LABELS[p.status]}</span><br/>
                  <strong style={{color:"#e91e8c"}}>{fmt(p.total)}</strong>
                </div>
              </div>
              <ul style={{ margin: "8px 0", paddingLeft: "18px", fontSize: "0.88rem" }}>
                {p.itens.map((i) => <li key={i.id}>{i.produto.nome} x{i.quantidade} — {fmt(i.precoUnitario * i.quantidade)}</li>)}
              </ul>
              {p.observacoes && <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>Obs: {p.observacoes}</p>}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["PENDENTE","CONFIRMADO","PRONTO","ENTREGUE"].map((s) => (
                  <button key={s} onClick={() => atualizarStatus(p.id, s)} disabled={p.status===s} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid " + STATUS_CORES[s], background: p.status===s ? STATUS_CORES[s] : "#fff", color: p.status===s ? "#fff" : STATUS_CORES[s], fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>{STATUS_LABELS[s]}</button>
                ))}
                <button onClick={() => cancelarPedido(p.id)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: "0.8rem", cursor: "pointer", marginLeft: "auto" }}>Cancelar/Deletar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aba === "cardapio" && (
        <div>
          <h2>Cardapio</h2>
          <div style={{ background: "#fce4f3", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "12px", color: "#e91e8c" }}>Nova Categoria</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <input value={novaCat} onChange={(e)=>setNovaCat(e.target.value)} placeholder="Nome da categoria" style={{ flex:1, padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }} />
              <button onClick={adicionarCategoria} style={{ padding: "8px 16px", background: "#e91e8c", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>+ Adicionar</button>
            </div>
          </div>
          <div style={{ background: "#fce4f3", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "12px", color: "#e91e8c" }}>Novo Produto</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <input value={novoProd.nome} onChange={(e)=>setNovoProd({...novoProd,nome:e.target.value})} placeholder="Nome" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }} />
              <input value={novoProd.descricao} onChange={(e)=>setNovoProd({...novoProd,descricao:e.target.value})} placeholder="Descricao" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }} />
              <input value={novoProd.preco} onChange={(e)=>setNovoProd({...novoProd,preco:e.target.value})} placeholder="Preco (ex: 85.00)" type="number" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }} />
              <input value={novoProd.estoque} onChange={(e)=>setNovoProd({...novoProd,estoque:e.target.value})} placeholder="Estoque" type="number" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }} />
              <select value={novoProd.categoriaId} onChange={(e)=>setNovoProd({...novoProd,categoriaId:e.target.value})} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd", gridColumn: "1/-1" }}>
                <option value="">Selecione a categoria</option>
                {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
              </select>
            </div>
            <input placeholder="URL da foto (opcional)" value={novoProd.foto} onChange={(e)=>setNovoProd({...novoProd,foto:e.target.value})} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ddd", width: "100%", marginBottom: "8px", boxSizing: "border-box" }} />
            {novoProd.foto && <img src={novoProd.foto} alt="preview" style={{ width: "100%", maxHeight: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />}
            <button onClick={adicionarProduto} style={{ padding: "8px 16px", background: "#e91e8c", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>+ Adicionar Produto</button>
          </div>
          {categorias.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "24px" }}>
              <h3 style={{ color: "#e91e8c", borderBottom: "1px solid #fce4f3", paddingBottom: "6px" }}>{cat.nome}</h3>
              {cat.produtos.map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fff", borderRadius: "8px", marginBottom: "6px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", opacity: p.disponivel ? 1 : 0.5 }}>
                  <div>
                    <strong>{p.nome}</strong> <span style={{color:"#e91e8c"}}>{fmt(p.preco)}</span>
                    <span style={{marginLeft:"8px",fontSize:"0.8rem",color:"#666"}}>Estoque: {p.estoque}</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {p.disponivel ? (
                      <button onClick={() => toggleDisponivel(p)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #22c55e", background: "#22c55e", color: "#fff", fontSize: "0.8rem", cursor: "pointer" }}>Ativo</button>
                    ) : (
                      <button onClick={() => restaurarProduto(p.id)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #f59e0b", background: "#f59e0b", color: "#fff", fontSize: "0.8rem", cursor: "pointer" }}>Restaurar</button>
                    )}
                    <button onClick={() => deletarProduto(p.id)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #ef4444", background: "#fff", color: "#ef4444", fontSize: "0.8rem", cursor: "pointer" }}>Remover</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {aba === "clientes" && (
        <div>
          <h2>Clientes</h2>
          {!stats && <p>Carregando...</p>}
          {stats?.clientes.map((cl) => (
            <div key={cl.id} style={{ border: "1px solid #eee", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
              <strong>{cl.nome}</strong> <span style={{color:"#666",fontSize:"0.85rem"}}>({cl.telefone})</span>
              <p style={{fontSize:"0.85rem",color:"#999",marginTop:"4px"}}>{cl.pedidos.length} pedido(s)</p>
              {cl.pedidos.slice(0,3).map((ped) => (
                <div key={ped.id} style={{ background: "#fafafa", borderRadius: "8px", padding: "8px", marginTop: "6px", fontSize: "0.83rem" }}>
                  <span style={{color:"#e91e8c",fontWeight:700}}>{fmt(ped.total)}</span> — {new Date(ped.criadoEm).toLocaleDateString("pt-BR")}<br/>
                  {ped.itens.map((i) => i.produto.nome + " x" + i.quantidade).join(", ")}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {aba === "stats" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0 }}>Vendas</h2>
            <div style={{ display: "flex", gap: "6px" }}>
              {(["total","mes","semana"] as FiltroStats[]).map((f) => (
                <button key={f} onClick={() => { setFiltro(f); fetchStats(f); }} style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: filtro===f ? "#e91e8c" : "#fce4f3", color: filtro===f ? "#fff" : "#333", fontWeight: filtro===f ? 700 : 400, cursor: "pointer" }}>
                  {f === "total" ? "Tudo" : f === "mes" ? "Este mes" : "Esta semana"}
                </button>
              ))}
            </div>
          </div>
          {!stats && <p>Carregando...</p>}
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div style={{ background: "#e91e8c", color: "#fff", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Total Vendido</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{stats.totalVendido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
              </div>
              <div style={{ background: "#5d3a1a", color: "#fff", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Pedidos</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{stats.totalPedidos}</div>
              </div>
            </div>
          )}
          <h3 style={{ marginBottom: "12px" }}>Mais Vendidos</h3>
          {stats?.rankProdutos.length === 0 && <p style={{color:"#999"}}>Nenhuma venda ainda.</p>}
          {stats?.rankProdutos.map((r, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fff", borderRadius: "8px", marginBottom: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#e91e8c", minWidth: "24px" }}>#{idx+1}</span>
                <span>{r.produto?.nome ?? "Produto removido"}</span>
              </div>
              <span style={{ fontWeight: 700, color: "#5d3a1a" }}>{r.total} vendido(s)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
