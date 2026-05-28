"use client";

const WA = "5511976661297";

export default function TabInfo() {
  return (
    <div className="tab-info">
      <div className="info-hero">
        <h2>Claudia Cakes</h2>
        <p>Bolos, tortas e salgados artesanais</p>
      </div>
      <div className="info-card">
        <h3>Horario de Atendimento</h3>
        <ul>
          <li><span>Segunda a Sexta</span><span>08h - 18h</span></li>
          <li><span>Sabado</span><span>08h - 14h</span></li>
          <li><span>Domingo</span><span>Fechado</span></li>
        </ul>
      </div>
      <div className="info-card">
        <h3>Como Funciona</h3>
        <ul>
          <li><span>1. Escolha os itens no cardapio</span></li>
          <li><span>2. Va em Pedido e clique em Enviar</span></li>
          <li><span>3. Confirme pelo WhatsApp</span></li>
          <li><span>4. Aguarde a confirmacao</span></li>
        </ul>
      </div>
      <div className="info-card">
        <h3>Formas de Pagamento</h3>
        <ul>
          <li><span>Pix</span></li>
          <li><span>Dinheiro</span></li>
          <li><span>Cartao (consultar)</span></li>
        </ul>
      </div>
      <div className="info-card" style={{ borderLeft: "4px solid #e91e8c", paddingLeft: "16px" }}>
        <h3>Privacidade e LGPD</h3>
        <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: "1.6", marginTop: "8px" }}>
          Este aplicativo coleta apenas seu <strong>nome</strong> e <strong>telefone</strong> exclusivamente para fins de contato relacionados ao seu pedido. Seus dados nao sao compartilhados, vendidos ou utilizados para qualquer outra finalidade.
        </p>
        <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: "1.6", marginTop: "8px" }}>
          Em conformidade com a <strong>Lei Geral de Protecao de Dados (LGPD - Lei 13.709/2018)</strong>, voce pode solicitar a exclusao dos seus dados a qualquer momento pelo nosso WhatsApp.
        </p>
      </div>
      <div className="info-card" style={{ textAlign: "center", fontSize: "0.75rem", color: "#888", marginTop: "8px" }}>
        <p style={{ fontWeight: 700, color: "#e91e8c", marginBottom: "4px" }}>Desenvolvido por STRsoftware</p>
        <p>Uma das marcas da <strong>CotawebSeguros</strong></p>
        <p style={{ marginTop: "4px" }}>CNPJ: 23.659.612/0001-96</p>
        <p style={{ marginTop: "4px" }}>© 2026 Todos os direitos reservados</p>
      </div>
      <a className="btn-whatsapp" href={"https://wa.me/" + WA} target="_blank" rel="noreferrer">Falar pelo WhatsApp</a>
      <div style={{marginTop: "32px", textAlign: "center", paddingTop: "16px", borderTop: "1px solid #eee"}}>
    <a href={"/admin"} style={{fontSize: "0.75rem", color: "#bbb", textDecoration: "none"}}>
      Acesso restrito
    </a>
  </div>
</div>
  );
}
