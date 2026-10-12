// Configuração do WhatsApp da lanchonete (DDD + Número)
const NUMERO_WHATSAPP = '5511999999999';

// Lê o carrinho salvo no LocalStorage
function lerItensCarrinho() {
  const dados = localStorage.getItem('carrinho');
  if (!dados) return [];

  try {
    const itens = JSON.parse(dados);
    if (!Array.isArray(itens)) return [];

    return itens.map((item) => {
      const prod = (typeof produtos !== 'undefined') ? produtos.find((p) => p.id == item.id) : null;
      return {
        id: item.id,
        nome: item.nome || (prod ? prod.nome : 'Lanche'),
        preco: Number(item.preco !== undefined ? item.preco : (prod ? prod.preco : 0)),
        quantidade: Number(item.quantidade || item.qtd || 1)
      };
    });
  } catch (erro) {
    console.error('Erro ao ler carrinho:', erro);
    return [];
  }
}

// Gera o texto formatado do pedido
function gerarTextoPedido(itens) {
  if (!itens || itens.length === 0) return '';

  let total = 0;
  let mensagem = 'Olá, gostaria de fazer o seguinte pedido:\n\n';

  itens.forEach((item) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    const subtotalFormatado = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    mensagem += `• ${item.quantidade}x ${item.nome} (${subtotalFormatado})\n`;
  });

  const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  mensagem += `\n*Total: ${totalFormatado}*\n\nObrigado!`;

  return mensagem;
}

// Dispara a notificação simples de tela ("Pedido Gerado!")
function dispararNotificacao(texto) {
  const anterior = document.getElementById('notificacao-tela');
  if (anterior) anterior.remove();

  const notificacao = document.createElement('div');
  notificacao.id = 'notificacao-tela';
  notificacao.innerText = texto;

  Object.assign(notificacao.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#111111',
    color: '#FFFFFF',
    padding: '12px 24px',
    borderRadius: '9999px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: '9999',
    textAlign: 'center',
    transition: 'opacity 0.3s ease'
  });

  document.body.appendChild(notificacao);

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('Cardápio Digital', { body: texto, icon: 'img/icons/icon-192.png' });
    } catch (e) {}
  }

  setTimeout(() => {
    notificacao.style.opacity = '0';
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
}

// Copia o pedido para a área de transferência
async function copiarPedido() {
  const itens = lerItensCarrinho();
  if (itens.length === 0) {
    dispararNotificacao('O carrinho está vazio!');
    return;
  }

  const texto = gerarTextoPedido(itens);
  dispararNotificacao('Pedido Gerado!');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      return;
    } catch (erro) {
      console.warn('Fallback para cópia manual:', erro);
    }
  }

  const campo = document.createElement('textarea');
  campo.value = texto;
  campo.style.position = 'fixed';
  campo.style.opacity = '0';
  document.body.appendChild(campo);
  campo.select();
  document.execCommand('copy');
  document.body.removeChild(campo);
}

// Envia o pedido via WhatsApp (compartilhamento nativo ou link)
async function enviarParaWhatsApp() {
  const itens = lerItensCarrinho();
  if (itens.length === 0) {
    dispararNotificacao('O carrinho está vazio!');
    return;
  }

  const texto = gerarTextoPedido(itens);
  dispararNotificacao('Pedido Gerado!');

  const linkWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Pedido - Cardápio Digital',
        text: texto
      });
      return;
    } catch (erro) {
      if (erro.name !== 'AbortError') {
        window.open(linkWhatsApp, '_blank');
      }
      return;
    }
  }

  window.open(linkWhatsApp, '_blank');
}

// Intercepta cliques nos botões de checkout
document.addEventListener('click', (evento) => {
  const el = evento.target;

  if (el.closest('#btn-whatsapp') || el.closest('.btn-whatsapp') || el.closest('#btn-finalizar-pedido')) {
    enviarParaWhatsApp();
    return;
  }

  if (el.closest('#btn-copiar') || el.closest('.btn-copiar') || el.closest('#btn-copiar-pedido')) {
    copiarPedido();
  }
});

// Funções globais para integração com a equipe
window.lerItensCarrinho = lerItensCarrinho;
window.gerarTextoPedido = gerarTextoPedido;
window.copiarPedido = copiarPedido;
window.enviarParaWhatsApp = enviarParaWhatsApp;
window.dispararNotificacao = dispararNotificacao;
