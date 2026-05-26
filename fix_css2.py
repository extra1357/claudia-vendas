
css = '''
:root {
  --rosa: #e91e8c;
  --rosa-escuro: #c2186e;
  --rosa-claro: #fce4f3;
  --marrom: #5d3a1a;
  --creme: #fff8f0;
  --cinza: #666;
  --branco: #ffffff;
  --sombra: 0 2px 12px rgba(0,0,0,0.08);
  --radius: 12px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; background: var(--creme); color: var(--marrom); min-height: 100vh; }
.app-header { background: var(--rosa); color: var(--branco); text-align: center; padding: 18px 16px 12px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(233,30,140,0.3); }
.app-header h1 { font-size: 1.5rem; font-weight: 800; }
.app-header p { font-size: 0.8rem; opacity: 0.9; margin-top: 2px; }
.tabs-nav { display: flex; background: var(--branco); border-bottom: 2px solid var(--rosa-claro); position: sticky; top: 72px; z-index: 99; }
.tabs-nav button { flex: 1; padding: 12px 4px; border: none; background: none; font-size: 0.75rem; color: var(--cinza); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; transition: color 0.2s; position: relative; }
.tabs-nav button.ativa { color: var(--rosa); font-weight: 700; }
.tabs-nav button.ativa::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: var(--rosa); }
.tab-icone { font-size: 1.2rem; }
.tab-conteudo { padding: 16px; max-width: 480px; margin: 0 auto; padding-bottom: 80px; }
.categoria-titulo { font-size: 1rem; font-weight: 700; color: var(--rosa); margin: 20px 0 10px; padding-bottom: 6px; border-bottom: 1px solid var(--rosa-claro); }
.produto-card { background: var(--branco); border-radius: var(--radius); padding: 14px; margin-bottom: 10px; box-shadow: var(--sombra); display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.produto-info { flex: 1; }
.produto-nome { font-weight: 600; font-size: 0.95rem; }
.produto-desc { font-size: 0.8rem; color: var(--cinza); margin-top: 2px; }
.produto-preco { font-weight: 700; color: var(--rosa); font-size: 0.95rem; margin-top: 4px; }
.produto-controles { display: flex; align-items: center; gap: 8px; }
.produto-controles button { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--rosa); background: var(--branco); color: var(--rosa); font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.produto-controles button:hover { background: var(--rosa); color: var(--branco); }
.produto-controles span { font-weight: 700; min-width: 20px; text-align: center; }
.tab-pedido h2, .tab-conta h2, .tab-info h2 { font-size: 1.2rem; font-weight: 800; margin-bottom: 16px; color: var(--marrom); }
.lista-pedido { list-style: none; }
.item-pedido { background: var(--branco); border-radius: var(--radius); padding: 12px 14px; margin-bottom: 8px; box-shadow: var(--sombra); }
.item-info { display: flex; justify-content: space-between; margin-bottom: 8px; }
.item-nome { font-weight: 600; font-size: 0.9rem; }
.item-preco { font-weight: 700; color: var(--rosa); }
.item-controles { display: flex; align-items: center; gap: 8px; }
.item-controles button { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--rosa); background: var(--branco); color: var(--rosa); font-weight: 700; cursor: pointer; }
.item-controles span { font-weight: 700; min-width: 18px; text-align: center; }
.btn-remover { border-color: #ccc !important; color: #999 !important; font-size: 0.8rem !important; }
.total-pedido { display: flex; justify-content: space-between; background: var(--rosa-claro); border-radius: var(--radius); padding: 14px 16px; margin: 16px 0; font-size: 1.1rem; }
.total-pedido strong { color: var(--rosa); font-size: 1.2rem; }
.campo-obs { width: 100%; border: 1.5px solid #ddd; border-radius: var(--radius); padding: 12px; font-size: 0.9rem; font-family: inherit; resize: none; margin-bottom: 12px; }
.campo-obs:focus { outline: none; border-color: var(--rosa); }
.aviso-conta { font-size: 0.85rem; color: var(--cinza); margin-bottom: 12px; }
.link-conta { background: none; border: none; color: var(--rosa); font-weight: 700; cursor: pointer; text-decoration: underline; }
.btn-enviar { width: 100%; background: #25d366; color: var(--branco); border: none; border-radius: var(--radius); padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.btn-enviar:hover { background: #1eb557; }
.btn-enviar:disabled { background: #ccc; cursor: not-allowed; }
.vazio-pedido { text-align: center; padding: 60px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.icone-vazio { font-size: 3rem; }
.sub-conta { font-size: 0.85rem; color: var(--cinza); margin-bottom: 20px; }
.form-conta { display: flex; flex-direction: column; gap: 14px; }
.form-conta label { display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--marrom); }
.form-conta input { border: 1.5px solid #ddd; border-radius: var(--radius); padding: 12px 14px; font-size: 1rem; font-family: inherit; }
.form-conta input:focus { outline: none; border-color: var(--rosa); }
.btn-salvar { background: var(--rosa); color: var(--branco); border: none; border-radius: var(--radius); padding: 14px; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 4px; transition: background 0.2s; }
.btn-salvar:hover { background: var(--rosa-escuro); }
.btn-salvar:disabled { background: #ccc; cursor: not-allowed; }
.card-cliente { background: var(--rosa-claro); border-radius: var(--radius); padding: 16px; margin-top: 20px; display: flex; flex-direction: column; gap: 4px; }
.card-cliente small { color: var(--cinza); font-size: 0.78rem; margin-top: 4px; }
.info-hero { text-align: center; background: var(--rosa); color: var(--branco); border-radius: var(--radius); padding: 28px 20px; margin-bottom: 16px; }
.info-hero h2 { font-size: 1.6rem; font-weight: 800; }
.info-hero p { font-size: 0.9rem; opacity: 0.9; margin-top: 4px; }
.info-card { background: var(--branco); border-radius: var(--radius); padding: 16px; margin-bottom: 12px; box-shadow: var(--sombra); }
.info-card h3 { font-size: 0.9rem; font-weight: 700; color: var(--rosa); margin-bottom: 10px; }
.info-card ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.info-card li { font-size: 0.88rem; display: flex; justify-content: space-between; }
.info-card p { font-size: 0.88rem; color: var(--cinza); margin-bottom: 4px; }
.btn-whatsapp { display: block; background: #25d366; color: var(--branco); text-align: center; padding: 13px; border-radius: var(--radius); font-weight: 700; text-decoration: none; font-size: 0.95rem; }
.badge { background: var(--marrom); color: var(--branco); border-radius: 99px; font-size: 0.65rem; padding: 1px 6px; font-weight: 700; }
'''
with open('src/app/globals.css', 'w', encoding='utf-8', newline='\n') as f:
    f.write(css)
print('CSS OK')
