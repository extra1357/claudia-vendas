"use client";
import { useState, useEffect } from "react";
import { ItemCarrinho } from "@/types";

const CHAVE = "claudia_carrinho";

export function useCarrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) setItens(JSON.parse(salvo));
    } catch {}
  }, []);

  function salvar(novos: ItemCarrinho[]) {
    setItens(novos);
    localStorage.setItem(CHAVE, JSON.stringify(novos));
  }

  function adicionarItem(item: ItemCarrinho) {
    const existe = itens.find((i) => i.produtoId === item.produtoId);
    if (existe) {
      salvar(itens.map((i) => i.produtoId === item.produtoId ? { ...i, quantidade: i.quantidade + item.quantidade } : i));
    } else {
      salvar([...itens, item]);
    }
  }

  function removerItem(produtoId: string) {
    salvar(itens.filter((i) => i.produtoId !== produtoId));
  }

  function atualizarQuantidade(produtoId: string, quantidade: number) {
    if (quantidade <= 0) { removerItem(produtoId); return; }
    salvar(itens.map((i) => i.produtoId === produtoId ? { ...i, quantidade } : i));
  }

  function limparCarrinho() {
    salvar([]);
  }

  const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  return { itens, total, adicionarItem, removerItem, atualizarQuantidade, limparCarrinho };
}
