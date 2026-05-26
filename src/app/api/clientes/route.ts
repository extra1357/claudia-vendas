import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { nome, telefone } = await req.json();
  if (!nome || !telefone) return NextResponse.json({ error: 'Nome e telefone obrigatorios' }, { status: 400 });
  const cliente = await prisma.cliente.upsert({
    where: { telefone },
    update: { nome },
    create: { nome, telefone },
  });
  return NextResponse.json(cliente);
}

export async function GET() {
  const clientes = await prisma.cliente.findMany({ orderBy: { criadoEm: 'desc' } });
  return NextResponse.json(clientes);
}
