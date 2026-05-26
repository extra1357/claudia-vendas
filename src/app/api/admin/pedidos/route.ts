import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { criadoEm: "desc" },
    include: { cliente: true, itens: { include: { produto: true } } },
  });
  return NextResponse.json(pedidos);
}
