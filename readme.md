# Cardapio Digital PWA

Aplicacao web progressiva (Progressive Web App - PWA) mobile-first para cardapio digital de lanches artesanais, desenvolvida com HTML, CSS e JavaScript puro. O sistema conta com vitrine dinamica, carrinho de compras com persistencia local e envio de pedidos integrado ao WhatsApp.

---

## Links do Projeto

- Aplicacao em Producao: https://mobile-app-cardpio.vercel.app/
- Repositorio GitHub: https://github.com/RodrigoNogueiraTeixeira/Mobile-app-card-pio

---

## Integrantes e Divisao de Responsabilidades

O projeto foi organizado em tres blocos principais de desenvolvimento:

### 1. Bloco Vitrine (Rodrigo)
- Estruturacao semantica da pagina inicial (`index.html`).
- Estilizacao mobile-first da vitrine, cabecalho e barra de navegacao (`cardapio.css` e `global.css`).
- Logica de renderizacao dinamica dos lanches a partir de array de dados (`produtos.js`).
- Otimizacao de imagens no formato WebP com dimensoes fixas, carregamento prioritario e textos alternativos (`alt`) para metas de desempenho.

### 2. Bloco Carrinho e Memoria (Daniel)
- Interface visual do modal deslizante do carrinho (`carrinho.css`).
- Logica de adicao, remocao e calculo de valores totais do pedido (`carrinho.js`).
- Persistencia de dados com LocalStorage, mantendo os itens salvos mesmo apos fechar ou atualizar o navegador.

### 3. Bloco Checkout, WhatsApp e PWA (Maycon)
- Formatacao textual do pedido com calculo de subtotais e totais (`whatsapp.js`).
- Integracao de checkout via link direto para WhatsApp e compartilhamento nativo (Web Share API).
- Funcionalidade de copiar resumo do pedido para a area de transferencia.
- Disparo de notificacao em tela de confirmacao do pedido.
- Configuracao do PWA: arquivo `manifest.json` com icones em multiplas resolucoes, cores de tema e atalhos de navegacao (shortcuts).
- Implementacao de Service Worker (`sw.js`) e registro em `app.js` para suporte a funcionamento offline basico via Cache API.

---

## Tecnologias Utilizadas

- HTML5 (semantica e acessibilidade)
- CSS3 (mobile-first, design tokens via variaveis CSS, layout responsivo)
- JavaScript puro (ES6+, manipulacao de DOM sem frameworks externos)
- Web App Manifest (especificacao de PWA)
- Service Workers e Cache API (cache de arquivos estaticos e suporte offline)
- LocalStorage API (armazenamento persistente no dispositivo)
- Web Share API e Clipboard API (compartilhamento e copia de informacoes)

---

## Metricas de Qualidade (Google Lighthouse)

A aplicacao foi desenhada para alcancar pontuacoes elevadas na auditoria Mobile do Lighthouse:

- Desempenho (Performance): Superior a 95
- Acessibilidade (Accessibility): Superior a 80
- Praticas Recomendadas (Best Practices): Superior a 80 (nota alcancada: 100)
- SEO: Superior a 80 (nota alcancada: 100)

---

## Como Executar o Projeto Localmente

1. Clone o repositorio:
   ```bash
   git clone https://github.com/RodrigoNogueiraTeixeira/Mobile-app-card-pio.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd Mobile-app-card-pio
   ```

3. Inicie um servidor local para que o Service Worker opere corretamente:
   - Utilizando a extensao Live Server no VS Code, ou
   - Utilizando Python:
     ```bash
     python -m http.server 8000
     ```
   - Utilizando Node.js (npx serve):
     ```bash
     npx serve .
     ```

4. Abra o endereco indicado no navegador (exemplo: `http://localhost:8000` ou `http://127.0.0.1:5500`).
