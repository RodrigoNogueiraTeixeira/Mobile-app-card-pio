const modalCarrinho = document.getElementById("carrinho-modal");
const abrirCarrinho = document.getElementById("btn-abrir-carrinho");
const fecharCarrinho = document.getElementById("btn-fechar-carrinho");
const listaCarrinhoHTML = document.getElementById("lista-carrinho");
const valorTotalHTML = document.getElementById("valor-total");
const contadorHTML = document.getElementById("carrinho-contador");

let carrinho = [];

function salvarCarrinho() {
  localStorage.setItem("lista-carrinho", JSON.stringify(carrinho)); //transformando em lista de texto.
}

function carregarCarrinho() {
  const dadosSalvos = localStorage.getItem("lista-carrinho");

  //verificar se possui algo salvo.
  if (dadosSalvos) {
    //se sim, transforma em lista novamente e guarda na variável.
    carrinho = JSON.parse(dadosSalvos);
  }

  atualizarCarrinho();
}

function adicionarAoCarrinho(nome, preco) {
  const item = {
    nome: nome,
    preco: preco,
  };

  carrinho.push(item);
  salvarCarrinho();
  atualizarCarrinho();
}

carregarCarrinho();

function removerDoCarrinho(index) {
    //remover 1 item da lista na posição do index.
    carrinho.splice(index, 1);

    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarCarrinho() {
  //limpar o visual para não duplicar os itens toda vez que a função rodar.
  listaCarrinhoHTML.innerHTML = "";

  let total = 0;

  carrinho.forEach(function (item, index) {
    const li = document.createElement("li");

    li.innerHTML = `${item.nome} - R$ ${item.preco.toFixed(2)} <button class="btn-remover" onclick="removerDoCarrinho(${index})">X</button>`;

    listaCarrinhoHTML.appendChild(li);

    total = total + item.preco;
  });

  valorTotalHTML.textContent = "R$ " + total.toFixed(2);
  contadorHTML.textContent = carrinho.length;
}

abrirCarrinho.addEventListener("click", function () {
  modalCarrinho.classList.add("aberto");
});

fecharCarrinho.addEventListener("click", function () {
  modalCarrinho.classList.remove("aberto");
});
