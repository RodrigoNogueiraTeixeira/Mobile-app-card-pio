// Configuração do WhatsApp da lanchonete (DDD + Número)
const NUMERO_WHATSAPP = '5511999999999';

// Lê o carrinho salvo no LocalStorage (suporta tanto 'lista-carrinho' quanto 'carrinho')
function lerItensCarrinho() {
  const dados = localStorage.getItem('lista-carrinho') || localStorage.getItem('carrinho');
  if (!dados) return [];

  try {
    const itens = JSON.parse(dados);
    if (!Array.isArray(itens)) return [];

    // Agrupa itens com o mesmo nome e soma as quantidades
    const mapaItens = new Map();

    itens.forEach((item) => {
      const prod = (typeof produtos !== 'undefined') ? produtos.find((p) => p.id == item.id || p.nome === item.nome) : null;
      const nome = item.nome || (prod ? prod.nome : 'Lanche');
      const preco = Number(item.preco !== undefined ? item.preco : (prod ? prod.preco : 0));
      const quantidade = Number(item.quantidade || item.qtd || 1);

      if (mapaItens.has(nome)) {
        const existente = mapaItens.get(nome);
        existente.quantidade += quantidade;
      } else {
        mapaItens.set(nome, {
          id: item.id || (prod ? prod.id : undefined),
          nome,
          preco,
          quantidade
        });
      }
    });

    return Array.from(mapaItens.values());
  } catch (erro) {
    console.error('Erro ao ler carrinho:', erro);
    return [];
  }
}

// Pega a opção de entrega selecionada e o endereço digitado
function obterDadosEntrega() {
  const radioSelecionado = document.querySelector('input[name="opcao-entrega"]:checked');
  const tipo = radioSelecionado ? radioSelecionado.value : 'delivery';
  const campoEndereco = document.getElementById('campo-endereco');
  const endereco = campoEndereco ? campoEndereco.value.trim() : '';

  return { tipo, endereco };
}

// Gera o texto formatado do pedido
function gerarTextoPedido(itens, dadosEntrega) {
  if (!itens || itens.length === 0) return '';

  const entrega = dadosEntrega || obterDadosEntrega();
  let total = 0;
  let mensagem = 'Olá, gostaria de fazer o seguinte pedido:\n\n';

  itens.forEach((item) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    const subtotalFormatado = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    mensagem += `• ${item.quantidade}x ${item.nome} (${subtotalFormatado})\n`;
  });

  const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  mensagem += `\n*Total: ${totalFormatado}*\n`;

  // Adiciona a especificação de entrega ou consumo no local
  if (entrega.tipo === 'delivery') {
    mensagem += `\n*Tipo:* 🛵 Entrega (Delivery)`;
    mensagem += `\n*Endereço:* ${entrega.endereco || 'A combinar'}`;
  } else {
    mensagem += `\n*Tipo:* 🏪 Consumir / Retirar no Local`;
  }

  mensagem += '\n\nObrigado!';
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
    } catch (e) { }
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

  const entrega = obterDadosEntrega();
  if (entrega.tipo === 'delivery' && !entrega.endereco) {
    dispararNotificacao('Por favor, informe seu endereço de entrega!');
    const campo = document.getElementById('campo-endereco');
    if (campo) campo.focus();
    return;
  }

  const texto = gerarTextoPedido(itens, entrega);
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

// Exibe mensagem de confirmação no aplicativo informando que o pedido está sendo preparado
function exibirConfirmacaoPreparo(entrega) {
  const anterior = document.getElementById('modal-confirmacao-pedido');
  if (anterior) anterior.remove();

  const tempoEstimado = entrega && entrega.tipo === 'local' ? '15 a 25 minutos' : '30 a 45 minutos';
  const modoTexto = entrega && entrega.tipo === 'local' ? '🏪 Retirada no Local' : '🛵 Entrega (Delivery)';

  const modalConfirmacao = document.createElement('div');
  modalConfirmacao.id = 'modal-confirmacao-pedido';
  Object.assign(modalConfirmacao.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(4px)',
    zIndex: '2000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box'
  });

  modalConfirmacao.innerHTML = `
    <div style="background: #ffffff; border-radius: 20px; max-width: 360px; width: 100%; padding: 24px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.25); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="font-size: 48px; margin-bottom: 8px;">👨‍🍳</div>
      <h3 style="margin: 0 0 8px; color: #111827; font-size: 20px; font-weight: 700;">Pedido Recebido!</h3>
      <p style="margin: 0 0 16px; color: #4B5563; font-size: 14px; line-height: 1.5;">
        O estabelecimento confirmou seu pedido.<br>
        <strong style="color: #059669;">Seu lanche já está sendo preparado!</strong>
      </p>
      
      <div style="background: #F3F4F6; border-radius: 12px; padding: 12px 14px; margin-bottom: 20px; font-size: 13px; color: #374151; text-align: left;">
        <div style="margin-bottom: 6px;">⏱️ <strong>Previsão:</strong> ${tempoEstimado}</div>
        <div>📍 <strong>Modo:</strong> ${modoTexto}</div>
      </div>

      <button id="btn-fechar-confirmacao" style="width: 100%; background-color: #25D366; color: #FFFFFF; border: none; padding: 12px 16px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: opacity 0.2s;">
        Entendido! ✓
      </button>
    </div>
  `;

  document.body.appendChild(modalConfirmacao);

  const btnFechar = modalConfirmacao.querySelector('#btn-fechar-confirmacao');
  if (btnFechar) {
    btnFechar.addEventListener('click', () => {
      modalConfirmacao.remove();
    });
  }

  // Também permite fechar clicando fora da caixinha
  modalConfirmacao.addEventListener('click', (e) => {
    if (e.target === modalConfirmacao) {
      modalConfirmacao.remove();
    }
  });
}

// Limpa o carrinho após finalizar o pedido
function limparCarrinhoAposEnvio() {
  localStorage.removeItem('lista-carrinho');
  localStorage.removeItem('carrinho');

  const listaCarrinhoHTML = document.getElementById('lista-carrinho');
  const valorTotalHTML = document.getElementById('valor-total');
  const contadorHTML = document.getElementById('carrinho-contador');

  if (listaCarrinhoHTML) listaCarrinhoHTML.innerHTML = '';
  if (valorTotalHTML) valorTotalHTML.textContent = 'R$ 0,00';
  if (contadorHTML) contadorHTML.textContent = '0';

  if (typeof carrinho !== 'undefined' && Array.isArray(carrinho)) {
    carrinho.length = 0;
  }
}

// Estado para saber se o cliente foi enviado para o WhatsApp
let pedidoAguardandoRetorno = false;
let entregaPendente = null;

// Envia o pedido para o WhatsApp e aguarda o envio e retorno do cliente
function enviarParaWhatsApp() {
  const itens = lerItensCarrinho();
  if (itens.length === 0) {
    dispararNotificacao('O carrinho está vazio!');
    return;
  }

  const entrega = obterDadosEntrega();
  if (entrega.tipo === 'delivery' && !entrega.endereco) {
    dispararNotificacao('Por favor, informe seu endereço de entrega!');
    const campo = document.getElementById('campo-endereco');
    if (campo) campo.focus();
    return;
  }

  const texto = gerarTextoPedido(itens, entrega);
  dispararNotificacao('Redirecionando para o WhatsApp...');

  // Remove caracteres como espaços, parênteses e traços
  let numeroLimpo = NUMERO_WHATSAPP.replace(/\D/g, '');

  // Se colocar apenas DDD + número (10 ou 11 dígitos), adiciona automaticamente o DDI do Brasil (55)
  if (numeroLimpo.length === 10 || numeroLimpo.length === 11) {
    numeroLimpo = '55' + numeroLimpo;
  }

  // Marca que o pedido está a caminho do WhatsApp
  pedidoAguardandoRetorno = true;
  entregaPendente = entrega;
  try {
    localStorage.setItem('pedido_aguardando_retorno', JSON.stringify({ entrega }));
  } catch (e) { }

  // Fecha o modal do carrinho
  const modalCarrinho = document.getElementById('carrinho-modal');
  if (modalCarrinho) modalCarrinho.classList.remove('aberto');

  // Abre a conversa com o número do estabelecimento
  const linkWhatsApp = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(texto)}`;
  window.open(linkWhatsApp, '_blank');
}

// Verifica se o cliente acabou de voltar do WhatsApp para confirmar o preparo
function verificarRetornoWhatsApp() {
  const salvo = localStorage.getItem('pedido_aguardando_retorno');
  if (!pedidoAguardandoRetorno && !salvo) return;

  let entrega = entregaPendente;
  if (!entrega && salvo) {
    try {
      entrega = JSON.parse(salvo).entrega;
    } catch (e) { }
  }

  // Limpa o estado pendente
  pedidoAguardandoRetorno = false;
  entregaPendente = null;
  localStorage.removeItem('pedido_aguardando_retorno');

  // Exibe a confirmação de que o pedido está sendo preparado
  setTimeout(() => {
    exibirConfirmacaoPreparo(entrega);
    limparCarrinhoAposEnvio();
  }, 400);
}

// Detecta quando o cliente volta para a aba do cardápio (após enviar a mensagem no WhatsApp)
window.addEventListener('focus', verificarRetornoWhatsApp);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    verificarRetornoWhatsApp();
  }
});

// Garante a inserção das opções de entrega e botões de checkout dentro do modal do carrinho
function injetarBotoesCheckout() {
  const modal = document.getElementById('carrinho-modal');
  if (!modal || document.getElementById('acoes-checkout')) return;

  const container = document.createElement('div');
  container.id = 'acoes-checkout';
  Object.assign(container.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px 20px',
    marginTop: 'auto',
    borderTop: '1px solid #eeeeee',
    backgroundColor: '#ffffff',
    flexShrink: '0'
  });

  container.innerHTML = `
    <div>
      <span style="font-size: 13px; font-weight: 700; color: #444444; display: block; margin-bottom: 8px;">
        Como deseja receber seu pedido?
      </span>
      
      <div style="display: flex; gap: 8px; margin-bottom: 10px;">
        <label id="label-opcao-entrega" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border: 1.5px solid #25D366; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; background-color: #F0FDF4;">
          <input type="radio" name="opcao-entrega" value="delivery" checked style="accent-color: #25D366;" />
          🛵 Entrega
        </label>
        
        <label id="label-opcao-local" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border: 1.5px solid #E5E5EA; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; background-color: #FAFAFA;">
          <input type="radio" name="opcao-entrega" value="local" style="accent-color: #25D366;" />
          🏪 No Local
        </label>
      </div>

      <div id="bloco-endereco" style="margin-bottom: 6px;">
        <input 
          type="text" 
          id="campo-endereco" 
          placeholder="Endereço de entrega (Rua, nº, bairro)..." 
          style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13px; outline: none;"
        />
      </div>
    </div>

    <button id="btn-whatsapp" class="btn-whatsapp" style="background-color: #25D366; color: #FFFFFF; padding: 14px 20px; border-radius: 12px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
      📱 Pedir via WhatsApp
    </button>
    
    <button id="btn-copiar" class="btn-copiar" style="background-color: #F5F5F7; color: #1D1D1F; padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; border: 1px solid #E5E5EA; cursor: pointer; text-align: center;">
      📋 Copiar Pedido
    </button>
  `;

  modal.appendChild(container);

  // Alterna a visibilidade do campo de endereço conforme a opção clicada
  const radioEntrega = container.querySelector('input[value="delivery"]');
  const radioLocal = container.querySelector('input[value="local"]');
  const blocoEndereco = container.querySelector('#bloco-endereco');
  const labelEntrega = container.querySelector('#label-opcao-entrega');
  const labelLocal = container.querySelector('#label-opcao-local');

  function atualizarOpcaoEntrega() {
    if (radioEntrega.checked) {
      blocoEndereco.style.display = 'block';
      labelEntrega.style.borderColor = '#25D366';
      labelEntrega.style.backgroundColor = '#F0FDF4';
      labelLocal.style.borderColor = '#E5E5EA';
      labelLocal.style.backgroundColor = '#FAFAFA';
    } else {
      blocoEndereco.style.display = 'none';
      labelLocal.style.borderColor = '#25D366';
      labelLocal.style.backgroundColor = '#F0FDF4';
      labelEntrega.style.borderColor = '#E5E5EA';
      labelEntrega.style.backgroundColor = '#FAFAFA';
    }
  }

  radioEntrega.addEventListener('change', atualizarOpcaoEntrega);
  radioLocal.addEventListener('change', atualizarOpcaoEntrega);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injetarBotoesCheckout);
} else {
  injetarBotoesCheckout();
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
window.obterDadosEntrega = obterDadosEntrega;
window.copiarPedido = copiarPedido;
window.enviarParaWhatsApp = enviarParaWhatsApp;
window.dispararNotificacao = dispararNotificacao;
