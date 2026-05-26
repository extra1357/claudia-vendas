const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const cats = [
    { nome: "Bolos", ordem: 1, produtos: [
      { nome: "Bolo de Chocolate", descricao: "Recheado com ganache", preco: 85, estoque: 10 },
      { nome: "Bolo Red Velvet", descricao: "Com cream cheese", preco: 95, estoque: 8 },
      { nome: "Bolo de Cenoura", descricao: "Com cobertura de chocolate", preco: 75, estoque: 10 },
      { nome: "Bolo de Morango", descricao: "Com chantilly e morangos frescos", preco: 90, estoque: 6 },
    ]},
    { nome: "Tortas Doces", ordem: 2, produtos: [
      { nome: "Torta de Chocolate", descricao: "Com brownie e ganache", preco: 70, estoque: 8 },
      { nome: "Torta de Limao", descricao: "Com merengue italiano", preco: 65, estoque: 8 },
      { nome: "Torta de Maracuja", descricao: "Com cobertura cremosa", preco: 65, estoque: 8 },
    ]},
    { nome: "Tortas Salgadas", ordem: 3, produtos: [
      { nome: "Torta de Frango", descricao: "Com catupiry", preco: 60, estoque: 10 },
      { nome: "Torta de Atum", descricao: "Com azeitona e tomate", preco: 55, estoque: 10 },
      { nome: "Torta de Legumes", descricao: "Vegetariana", preco: 55, estoque: 8 },
    ]},
    { nome: "Salgados", ordem: 4, produtos: [
      { nome: "Coxinha", descricao: "Frango com catupiry", preco: 8, estoque: 50 },
      { nome: "Empada", descricao: "Frango ou palmito", preco: 7, estoque: 50 },
      { nome: "Esfiha", descricao: "Carne ou queijo", preco: 6, estoque: 60 },
      { nome: "Quibe", descricao: "Frito ou assado", preco: 6, estoque: 60 },
    ]},
  ];
  for (const cat of cats) {
    const c = await prisma.categoria.upsert({
      where: { nome: cat.nome },
      update: {},
      create: { nome: cat.nome, ordem: cat.ordem },
    });
    for (const p of cat.produtos) {
      const exists = await prisma.produto.findFirst({ where: { nome: p.nome, categoriaId: c.id } });
      if (!exists) {
        await prisma.produto.create({ data: { ...p, categoriaId: c.id } });
        console.log("Criado:", p.nome);
      } else {
        console.log("Ja existe:", p.nome);
      }
    }
  }
  console.log("Seed OK!");
  await prisma["$disconnect"]();
}
main();
