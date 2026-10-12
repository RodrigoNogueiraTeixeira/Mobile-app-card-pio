/* ==========================================================================
   LÓGICA DA VITRINE E PRODUTOS (Bloco Rodrigo)
   - Array com a lista de lanches
   - Renderização dinâmica dos cards na tela
   - Otimizado para acessibilidade e Lighthouse (alt, lazy loading, webp)
   ========================================================================== */

// 1. Lista de produtos (Lanches do cardápio)
// Nota: Disponibilizado globalmente para que a Dani (carrinho.js) possa consultar os dados
const produtos = [
  {
    id: 1,
    nome: "Classic Smash Burger",
    preco: 26.90,
    descricao: "Pão brioche, smash burger 90g, queijo cheddar derretido e molho especial da casa.",
    foto: "img/lanches/classic-smash.webp",
    alt: "Hambúrguer smash com queijo cheddar derretido no pão brioche"
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

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param {number} valor 
 * @returns {string} Ex: "R$ 26,90"
 */
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Renderiza os cards de produtos no elemento container do HTML
 */
function renderizarProdutos() {
  const container = document.getElementById('lista-produtos');

  // Verifica se o container existe na página
  if (!container) {
    console.error('Elemento #lista-produtos não encontrado no DOM.');
    return;
  }

  // Gera o HTML de todos os cards
  const cardsHTML = produtos.map((produto) => {
    return `
      <article class="card-produto" data-id="${produto.id}">
        <!-- Imagem otimizada: formato webp, tag alt acessível e lazy loading para Performance 95+ -->
        <div class="card-imagem-container">
          <img 
            src="${produto.foto}" 
            alt="${produto.alt}" 
            class="card-imagem"
            loading="lazy" 
            decoding="async"
            width="400"
            height="225"
            onerror="this.style.display='none'"
          />
        </div>

        <div class="card-conteudo">
          <h3 class="card-titulo">${produto.nome}</h3>
          <p class="card-descricao">${produto.descricao}</p>
          
          <div class="card-rodape">
            <span class="card-preco">${formatarPreco(produto.preco)}</span>
            <!-- Botão com data-id pronto para a Dani (carrinho.js) interceptar o clique -->
            <button 
              type="button" 
              class="btn-adicionar" 
              data-id="${produto.id}"
              aria-label="Adicionar ${produto.nome} ao carrinho"
            >
              Adicionar
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Injeta os cards gerados dentro da div
  container.innerHTML = cardsHTML;
}

// Executa a renderização assim que o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
});
