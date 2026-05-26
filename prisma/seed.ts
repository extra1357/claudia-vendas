import { PrismaClient } from '@prisma/client/default';
import { PrismaNeon } from '@prisma/adapter-neon';
import 'dotenv/config';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const categorias = [
    { nome: 'Bolos', ordem: 1, produtos: [
      { nome: 'Bolo de Chocolate', descricao: 'Recheado com ganache', preco: 85.00 },
      { nome: 'Bolo de Morango', descricao: 'Com chantilly e morangos frescos', preco: 90.00 },
      { nome: 'Bolo de Cenoura', descricao: 'Com cobertura de chocolate', preco: 75.00 },
      { nome: 'Bolo Red Velvet', descricao: 'Com cream cheese', preco: 95.00 },
    ]},
    { nome: 'Tortas Doces', ordem: 2, produtos: [
      { nome: 'Torta de Limao', descricao: 'Com merengue italiano', preco: 65.00 },
      { nome: 'Torta de Maracuja', descricao: 'Com cobertura cremosa', preco: 65.00 },
      { nome: 'Torta de Chocolate', descricao: 'Com brownie e ganache', preco: 70.00 },
    ]},
    { nome: 'Tortas Salgadas', ordem: 3, produtos: [
      { nome: 'Torta de Frango', descricao: 'Com catupiry e milho', preco: 55.00 },
      { nome: 'Torta de Legumes', descricao: 'Vegetariana', preco: 50.00 },
      { nome: 'Torta de Atum', descricao: 'Com azeitona e tomate', preco: 55.00 },
    ]},
    { nome: 'Salgados', ordem: 4, produtos: [
      { nome: 'Coxinha', descricao: 'Frango com catupiry', preco: 6.00 },
      { nome: 'Esfiha', descricao: 'Carne ou queijo', preco: 5.50 },
      { nome: 'Empada', descricao: 'Frango ou palmito', preco: 7.00 },
      { nome: 'Quibe', descricao: 'Tradicional', preco: 5.50 },
    ]},
  ];

  for (const cat of categorias) {
    const categoria = await prisma.categoria.upsert({
      where: { nome: cat.nome },
      update: {},
      create: { nome: cat.nome, ordem: cat.ordem },
    });
    for (const prod of cat.produtos) {
      await prisma.produto.create({
        data: {
          nome: prod.nome,
          descricao: prod.descricao,
          preco: prod.preco,
          categoriaId: categoria.id,
        },
      });
    }
  }
  console.log('Seed concluido!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
