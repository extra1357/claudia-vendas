// v2
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filtro = searchParams.get("filtro") ?? "total";

  let dataInicio: Date | undefined;
  const agora = new Date();
  if (filtro === "semana") {
    dataInicio = new Date(agora);
    dataInicio.setDate(agora.getDate() - 7);
  } else if (filtro === "mes") {
    dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
  }

  const whereItens = dataInicio ? { pedido: { criadoEm: { gte: dataInicio } } } : {};
  const wherePedidos = dataInicio ? { criadoEm: { gte: dataInicio } } : {};

  const maisVendidos = await prisma.itemPedido.groupBy({
    by: ["produtoId"],
    where: whereItens,
    _sum: { quantidade: true },
    orderBy: { _sum: { quantidade: "desc" } },
    take: 10,
  });

  const produtoIds = maisVendidos.map((i: any) => i.produtoId);
  const produtos = await prisma.produto.findMany({ where: { id: { in: produtoIds } } });
  const rankProdutos = maisVendidos.map((i: any) => ({
    produto: produtos.find((p: any) => p.id === i.produtoId),
    total: i._sum.quantidade ?? 0,
  }));

  const pedidosFiltrados = await prisma.pedido.findMany({
    where: wherePedidos,
    select: { total: true, status: true },
  });

  const totalVendido = pedidosFiltrados
    .filter((p: any) => p.status !== "CANCELADO")
    .reduce((acc: number, p: any) => acc + p.total, 0);
  const totalPedidos = pedidosFiltrados.filter((p: any) => p.status !== "CANCELADO").length;

  const clientes = await prisma.cliente.findMany({
    include: {
      pedidos: { include: { itens: { include: { produto: true } } }, orderBy: { criadoEm: "desc" } },
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json({ rankProdutos, clientes, totalVendido, totalPedidos });
}
