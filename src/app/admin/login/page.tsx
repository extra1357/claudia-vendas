"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true); setErro("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });
    setLoading(false);
    if (r.ok) { router.push("/admin"); }
    else { setErro("Usuario ou senha incorretos"); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff0f5" }}>
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px #e91e8c22", padding: "40px 36px", minWidth: "320px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        <div style={{ fontSize: "32px" }}>🎂</div>
        <h2 style={{ color: "#e91e8c", margin: 0, fontWeight: 700 }}>Claudia Cakes Admin</h2>
        <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Acesso restrito</p>
        <input
          type="text" placeholder="Usuario" value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e91e8c55", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
        />
        <input
          type="password" placeholder="Senha" value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e91e8c55", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
        />
        {erro && <p style={{ color: "#e53e3e", margin: 0, fontSize: "13px" }}>{erro}</p>}
        <button
          onClick={handleLogin} disabled={loading}
          style={{ width: "100%", padding: "11px", background: "#e91e8c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}
