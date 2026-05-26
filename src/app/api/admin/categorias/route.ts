import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cats = await prisma.categoria.findMany({ orderBy: { ordem: "asc" }, include: { produtos: true } });
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  const { nome, ordem } = await req.json();
  const cat = await prisma.categoria.create({ data: { nome, ordem: ordem ?? 0 } });
  return NextResponse.json(cat);
}
