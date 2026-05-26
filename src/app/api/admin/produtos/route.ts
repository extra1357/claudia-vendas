import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const { nome, descricao, preco, categoriaId, estoque, foto } = await req.json();
    const p = await prisma.produto.create({ data: { nome, descricao, preco: Number(preco), categoriaId, estoque: Number(estoque ?? 0), foto: foto || null } });
    return NextResponse.json(p);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    if (data.preco) data.preco = Number(data.preco);
    if (data.estoque !== undefined) data.estoque = Number(data.estoque);
    if (data.foto === "") data.foto = null;
    const p = await prisma.produto.update({ where: { id }, data });
    return NextResponse.json(p);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.produto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
