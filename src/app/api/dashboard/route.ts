import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const agora = new Date();
  const inicioSemana = new Date(agora);
  inicioSemana.setDate(agora.getDate() - 7);
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const [pedidosSemana, pedidosMes, totalClientes] = await Promise.all([
    prisma.pedido.findMany({
      where: { criadoEm: { gte: inicioSemana } },
      include: { itens: { include: { produto: true } } },
    }),
    prisma.pedido.findMany({
      where: { criadoEm: { gte: inicioMes } },
    }),
    prisma.cliente.count(),
  ]);

  const contagemProdutos: Record<string, { nome: string; quantidade: number; total: number }> = {};
  for (const pedido of pedidosSemana) {
    for (const item of pedido.itens) {
      if (!contagemProdutos[item.produtoId]) {
        contagemProdutos[item.produtoId] = { nome: item.produto.nome, quantidade: 0, total: 0 };
      }
      contagemProdutos[item.produtoId].quantidade += item.quantidade;
      contagemProdutos[item.produtoId].total += item.quantidade * item.precoUnitario;
    }
  }

  const maisPedidosSemana = Object.values(contagemProdutos)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const faturamentoMes = pedidosMes.reduce((acc, p) => acc + p.total, 0);
  const faturamentoSemana = pedidosSemana.reduce((acc, p) => acc + p.total, 0);

  return NextResponse.json({
    semana: { pedidos: pedidosSemana.length, faturamento: faturamentoSemana, maisPedidos: maisPedidosSemana },
    mes: { pedidos: pedidosMes.length, faturamento: faturamentoMes },
    totalClientes,
  });
}
