/* ==========================================================================
   LÓGICA DA VITRINE E PRODUTOS (Bloco Rodrigo)
   Este arquivo contém os dados dos lanches e o código que cria os cards na tela.
   ========================================================================== */

// 1. ARRAY DE PRODUTOS: É a nossa "tabela" de lanches guardada na memória.
// Cada lanche é um objeto entre chaves {} com suas características.
const produtos = [
  {
    id: 1, // Número de identificação único deste lanche
    nome: "Classic Smash Burger", // Nome que vai aparecer no card
    preco: 26.90, // Preço numérico (usamos ponto em vez de vírgula para centavos)
    descricao: "Pão brioche, smash burger 90g, queijo cheddar derretido e molho especial da casa.", // Ingredientes
    foto: "img/lanches/classic-smash.webp", // Caminho onde a imagem está salva na pasta
    alt: "Hambúrguer smash com queijo cheddar derretido no pão brioche" // Descrição da imagem para cegos e SEO
  },
  {
    id: 2,
    nome: "Bacon Artesanal",
    preco: 34.90,
    descricao: "Pão australiano, hambúrguer 160g, fatias crocantes de bacon e queijo prato.",
    foto: "img/lanches/bacon-artesanal.webp",
    alt: "Hambúrguer artesanal com tiras de bacon crocante e queijo prato"
  },
  {
    id: 3,
    nome: "Double Smash Melt",
    preco: 38.90,
    descricao: "Pão brioche, dois smash burgers de 90g, dobro de cheddar e cebola caramelizada.",
    foto: "img/lanches/double-smash.webp",
    alt: "Hambúrguer duplo com duas carnes smash e muito queijo cheddar"
  },
  {
    id: 4,
    nome: "Chicken Crispy",
    preco: 28.90,
    descricao: "Frango empanado crocante, alface americana, tomate e maionese verde artesanal.",
    foto: "img/lanches/chicken-crispy.webp",
    alt: "Sanduíche de frango empanado crocante com alface e molho verde"
  },
  {
    id: 5,
    nome: "Cheese Salada Especial",
    preco: 29.90,
    descricao: "Blend bovino 150g, queijo mussarela, alface fresca, rodelas de tomate e picles.",
    foto: "img/lanches/cheese-salada.webp",
    alt: "Hambúrguer com queijo, alface fresca e fatias de tomate"
  },
  {
    id: 6,
    nome: "Batata Rústica",
    preco: 18.90,
    descricao: "Porção individual de batatas rústicas crocantes, temperadas com alecrim e sal marinho.",
    foto: "img/lanches/batata-rustica.webp",
    alt: "Porção de batatas rústicas douradas e crocantes temperadas com alecrim"
  }
];

// 2. FUNÇÃO PARA FORMATAR MOEDA
// Transforma números comuns como 26.9 em texto elegante no formato do Brasil: "R$ 26,90"
function formatarPreco(valor) {
  // toLocaleString é uma função nativa do JavaScript que aplica regras de moedas de cada país
  return valor.toLocaleString('pt-BR', {
    style: 'currency', // Diz que queremos o formato de dinheiro
    currency: 'BRL'    // Define a moeda como Real brasileiro (R$)
  });
}

// 3. FUNÇÃO QUE DESENHA OS CARDS NA TELA
function renderizarProdutos() {
  // Busca no HTML a div vazia com id="lista-produtos"
  const container = document.getElementById('lista-produtos');

  // Checagem de segurança: se a div não existir na página, para o código e avisa no console
  if (!container) {
    console.error('Elemento #lista-produtos não encontrado no DOM.');
    return;
  }

  // O método .map() percorre a lista de lanches um por um e transforma cada um em código HTML
  const cardsHTML = produtos.map((produto, index) => {
    // Verifica se o lanche é um dos 2 primeiros da lista (que aparecem logo no topo da tela do celular)
    const isAboveFold = index < 2;

    // Se for um dos 2 primeiros, manda o navegador baixar com urgência máxima (fetchpriority="high")
    // Se estiver mais para baixo, usa lazy loading (só baixa quando o usuário rolar a página até ele)
    const loadingAttr = isAboveFold 
      ? 'fetchpriority="high"' 
      : 'loading="lazy" decoding="async"';

    // Retorna o bloco de código HTML do card preenchido com as informações desse lanche
    return `
      <!-- Tag semântica article que agrupa o card de um produto -->
      <article class="card-produto" data-id="${produto.id}">
        <!-- Container que segura a imagem e impede que a página dê pulos -->
        <div class="card-imagem-container">
          <img 
            src="${produto.foto}" 
            alt="${produto.alt}" 
            class="card-imagem"
            ${loadingAttr}
            width="400"
            height="225"
            onerror="this.style.display='none'"
          />
        </div>

        <!-- Área de textos e botão do card -->
        <div class="card-conteudo">
          <!-- Título com o nome do lanche -->
          <h3 class="card-titulo">${produto.nome}</h3>
          
          <!-- Descrição dos ingredientes -->
          <p class="card-descricao">${produto.descricao}</p>
          
          <!-- Rodapé do card com preço e botão de ação -->
          <div class="card-rodape">
            <!-- Mostra o preço formatado em Reais -->
            <span class="card-preco">${formatarPreco(produto.preco)}</span>
            
            <!-- Botão que, ao ser clicado (onclick), chama a função enviando o ID do lanche e o próprio botão (this) -->
            <button 
              type="button" 
              class="btn-adicionar" 
              data-id="${produto.id}"
              onclick="adicionarItemAoCarrinho(${produto.id}, this)"
              aria-label="Adicionar ${produto.nome} ao carrinho"
            >
              Adicionar
            </button>
          </div>
        </div>
      </article>
    `;
  }).join(''); // O .join('') junta todos os cards gerados em um único texto HTML contínuo

  // Injeta todo esse HTML gerado de uma vez só dentro da div da página
  container.innerHTML = cardsHTML;
}

// 4. FUNÇÃO QUE CONECTA O CLIQUE DO BOTÃO COM O CARRINHO DO DANIEL
function adicionarItemAoCarrinho(id, botao) {
  // Procura na nossa lista de produtos aquele lanche que possui o mesmo ID que foi clicado
  const produto = produtos.find((p) => p.id === id);

  // Se por algum motivo o lanche não for encontrado, encerra a função aqui
  if (!produto) return;

  // Procura se a função "adicionarAoCarrinho" que o Daniel criou no carrinho.js já está disponível
  const funcaoCarrinho = window.adicionarAoCarrinho || (typeof adicionarAoCarrinho === 'function' ? adicionarAoCarrinho : null);

  // Se a função do Daniel existir:
  if (funcaoCarrinho) {
    // Executa a função do Daniel passando o nome e o preço do lanche para ele guardar no carrinho dele
    funcaoCarrinho(produto.nome, produto.preco);

    // Se o elemento do botão existir:
    if (botao) {
      // Guarda na memória o texto original ("Adicionar") antes de mudar
      const textoOriginal = botao.textContent;

      // Troca o texto do botão para "Adicionado! ✓" para o cliente ter certeza que deu certo
      botao.textContent = 'Adicionado! ✓';

      // Pinta o botão de verde temporariamente
      botao.style.backgroundColor = '#10B981';

      // setTimeout cria um temporizador de 800 milissegundos (menos de 1 segundo)
      setTimeout(() => {
        // Devolve o texto original ("Adicionar") para o botão
        botao.textContent = textoOriginal;

        // Remove a cor verde, voltando para a cor preta padrão
        botao.style.backgroundColor = '';
      }, 800);
    }
  } else {
    // Se o arquivo do Daniel não tiver carregado, exibe uma mensagem de erro no console
    console.error('A função adicionarAoCarrinho do Dani ainda não está disponível.');
  }
}

// Torna a função visível no navegador inteiro para que o onclick="" do botão consiga chamá-la
window.adicionarItemAoCarrinho = adicionarItemAoCarrinho;

// 5. INICIALIZAÇÃO AUTOMÁTICA
// O evento DOMContentLoaded avisa quando o navegador terminou de ler todo o HTML da página
document.addEventListener('DOMContentLoaded', () => {
  // Assim que o HTML estiver pronto, chama a função para desenhar os lanches na tela
  renderizarProdutos();
});