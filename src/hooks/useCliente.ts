"use client";
import { useState, useEffect } from "react";
import { Cliente } from "@/types";

const CHAVE = "claudia_cliente";

export function useCliente() {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) setCliente(JSON.parse(salvo));
    } catch {}
  }, []);

  function salvarCliente(dados: Cliente) {
    setCliente(dados);
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  }

  function limparCliente() {
    setCliente(null);
    localStorage.removeItem(CHAVE);
  }

  return { cliente, salvarCliente, limparCliente };
}
