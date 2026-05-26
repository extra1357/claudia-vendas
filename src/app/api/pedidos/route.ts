import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { clienteNome, clienteTelefone, observacoes, itens } = await req.json();
  if (!clienteNome || !clienteTelefone || !itens?.length)
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });

  // Valida estoque de todos os itens antes de criar o pedido
  for (const item of itens) {
    const produto = await prisma.produto.findUnique({ where: { id: item.produtoId } });
    if (!produto) return NextResponse.json({ error: "Produto nao encontrado" }, { status: 404 });
    if (produto.estoque < item.quantidade)
      return NextResponse.json({ error: "Estoque insuficiente para " + produto.nome + ". Disponivel: " + produto.estoque }, { status: 409 });
  }

  const cliente = await prisma.cliente.upsert({
    where: { telefone: clienteTelefone },
    update: { nome: clienteNome },
    create: { nome: clienteNome, telefone: clienteTelefone },
  });

  const total = itens.reduce((acc: number, i: any) => acc + i.precoUnitario * i.quantidade, 0);

  // Cria pedido e desconta estoque em transacao atomica
  const pedido = await prisma.$transaction(async (tx) => {
    const p = await tx.pedido.create({
      data: {
        clienteId: cliente.id,
        total,
        observacoes,
        itens: {
          create: itens.map((i: any) => ({
            produtoId: i.produtoId,
            quantidade: i.quantidade,
            precoUnitario: i.precoUnitario,
          })),
        },
      },
      include: { itens: true },
    });
    // Desconta estoque de cada produto
    for (const item of itens) {
      await tx.produto.update({
        where: { id: item.produtoId },
        data: { estoque: { decrement: item.quantidade } },
      });
    }
    return p;
  });

  return NextResponse.json(pedido);
}

export async function GET() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { criadoEm: "desc" },
    include: { cliente: true, itens: { include: { produto: true } } },
  });
  return NextResponse.json(pedidos);
}
