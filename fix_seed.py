txt = open('prisma/seed.ts', encoding='utf-8').read()
txt = txt.replace("import { PrismaClient } from '@prisma/client';", "import { PrismaClient } from '@prisma/client/default';")
open('prisma/seed.ts','w',encoding='utf-8',newline='\n').write(txt)
print('OK')