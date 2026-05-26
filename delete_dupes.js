const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const r = await prisma.produto.deleteMany({ where: { id: { in: ["cmpkla8yl00045sugzln1rbab","cmpkla8xs00035sug6mkbvtfh","cmpklaxdr0000dcugi0gscxsm","cmpkla8xh00025sug7qflvpi8","cmpklaxkt0006dcugnc7wj9hp","cmpkla91a00065sug6yj4n2zv","cmpkla91x00075suga3obeaab","cmpkla95r000c5sugzws9m5p1","cmpklaxoa0007dcugmqk5a5mm","cmpkla95b000b5suguwqpr2ao","cmpklaxu5000adcugbbu3zpf0","cmpklaxvl000cdcug6228ot19","cmpklaxup000bdcugs7snzz2b","cmpklaxwf000ddcuge2ykocnf"] } } });
  console.log("Deletados:", r.count);
  await prisma["$disconnect"]();
}
main();
