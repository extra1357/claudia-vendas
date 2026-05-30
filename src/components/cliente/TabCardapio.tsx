"use client";
import { useState, useEffect } from "react";
import { useCarrinho } from "@/hooks/useCarrinho";

type Produto = { id: string; nome: string; descricao: string | null; preco: number; disponivel: boolean; estoque: number; foto: string | null };
type Categoria = { id: string; nome: string; produtos: Produto[] };

const kenBurns = `
  @keyframes kenburns {
    0%   { transform: scale(1);    }
    50%  { transform: scale(1.08); }
    100% { transform: scale(1);    }
  }
`;

export default function TabCardapio({ onAdicionado }: { onAdicionado: () => void }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const { itens, adicionarItem, atualizarQuantidade } = useCarrinho();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = kenBurns;
    document.head.appendChild(style);
    fetch("/api/produtos")
      .then((r) => r.json())
      .then((data) => { setCategorias(data); setLoading(false); })
      .catch(() => setLoading(false));
    return () => { document.head.removeChild(style); };
  }, []);

  function getQtd(id: string) { return itens.find((i) => i.produtoId === id)?.quantidade ?? 0; }

  if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Carregando...</p>;

  const primeiroFotoId = categorias
    .flatMap((c) => c.produtos.filter((p) => p.disponivel && p.estoque > 0 && p.foto))
    [0]?.id ?? null;

  return (
    <div>
      {categorias.map((cat) => (
        <div key={cat.id}>
          <h3 className="categoria-titulo">{cat.nome}</h3>
          {cat.produtos.filter((p) => p.disponivel && p.estoque > 0).map((p) => {
            const qtd = getQtd(p.id);
            const semEstoque = qtd >= p.estoque;
            const isFirst = p.id === primeiroFotoId;
            return (
              <div key={p.id} className="produto-card" style={{ overflow: "hidden" }}>
                {p.foto && (
                  <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: "10px 10px 0 0", position: "relative", background: "#f5e6d3" }}>
                    <img
                      src={p.foto}
                      alt={p.nome}
                      width={514}
                      height={289}
                      loading={isFirst ? "eager" : "lazy"}
                      fetchPriority={isFirst ? "high" : "auto"}
                      decoding={isFirst ? "sync" : "async"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", animation: "kenburns 8s ease-in-out infinite", transformOrigin: "center center" }}
                    />
                    <div style={{ position: "absolute", bottom: "4px", right: "8px", fontSize: "10px", color: "rgba(255,255,255,0.75)", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                      Foto meramente ilustrativa
                    </div>
                  </div>
                )}
                <div className="produto-info">
                  <div className="produto-nome">{p.nome}</div>
                  {p.descricao && <div className="produto-desc">{p.descricao}</div>}
                  <div className="produto-preco">R$ {Number(p.preco).toFixed(2)}</div>
                  {semEstoque && qtd > 0 && <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "2px" }}>Limite de estoque atingido</div>}
                </div>
                <div className="produto-controles">
                  {qtd === 0 ? (
                    <button onClick={() => { adicionarItem({ produtoId: p.id, nome: p.nome, preco: Number(p.preco), quantidade: 1, estoque: p.estoque }); onAdicionado(); }}>+</button>
                  ) : (
                    <>
                      <button onClick={() => atualizarQuantidade(p.id, qtd - 1)}>-</button>
                      <span>{qtd}</span>
                      <button onClick={() => { if (!semEstoque) atualizarQuantidade(p.id, qtd + 1, p.estoque); }} disabled={semEstoque} style={{ opacity: semEstoque ? 0.3 : 1, cursor: semEstoque ? "not-allowed" : "pointer" }}>+</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
