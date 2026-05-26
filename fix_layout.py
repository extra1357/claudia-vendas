
content = 'import type { Metadata } from ' + chr(34) + 'next' + chr(34) + ';\n'
content += 'import ' + chr(34) + './globals.css' + chr(34) + ';\n\n'
content += 'export const metadata: Metadata = {\n'
content += '  title: ' + chr(34) + 'Claudia Cakes' + chr(34) + ',\n'
content += '  description: ' + chr(34) + 'Bolos, tortas e salgados artesanais' + chr(34) + ',\n'
content += '};\n\n'
content += 'export default function RootLayout({ children }: { children: React.ReactNode }) {\n'
content += '  return (\n'
content += '    <html lang=' + chr(34) + 'pt-BR' + chr(34) + '>\n'
content += '      <body>{children}</body>\n'
content += '    </html>\n'
content += '  );\n'
content += '}\n'

with open('src/app/layout.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print('layout OK')
