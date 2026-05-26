import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const pedido = await prisma.pedido.update({ where: { id }, data: { status } });
  if (status === "CONFIRMADO") {
    const itens = await prisma.itemPedido.findMany({ where: { pedidoId: id } });
    for (const item of itens) {
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: { estoque: { decrement: item.quantidade } },
      });
    }
  }
  return NextResponse.json(pedido);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.itemPedido.deleteMany({ where: { pedidoId: id } });
  await prisma.pedido.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
