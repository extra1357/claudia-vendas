import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { ordem: 'asc' },
    include: {
      produtos: {
        where: { disponivel: true },
        orderBy: { nome: 'asc' },
      },
    },
  });
  return NextResponse.json(categorias);
}
