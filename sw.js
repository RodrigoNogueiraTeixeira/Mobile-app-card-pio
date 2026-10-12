// Nome do cache e lista de arquivos para funcionamento offline
const CACHE_NAME = 'cardapio-pwa-v1';
const ARQUIVOS_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/global.css',
  './css/cardapio.css',
  './css/carrinho.css',
  './js/produtos.js',
  './js/carrinho.js',
  './js/whatsapp.js',
  './js/app.js',
  './img/icons/favicon.svg',
  './img/icons/icon-192.png',
  './img/icons/icon-512.png',
  './img/icons/icon-maskable-512.png',
  './img/lanches/classic-smash.webp',
  './img/lanches/bacon-artesanal.webp',
  './img/lanches/double-smash.webp',
  './img/lanches/chicken-crispy.webp',
  './img/lanches/cheese-salada.webp',
  './img/lanches/batata-rustica.webp'
];

// Instala o Service Worker e salva arquivos em cache
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ARQUIVOS_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Limpa versões antigas de cache
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves.map((chave) => {
          if (chave !== CACHE_NAME) return caches.delete(chave);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta requisições: entrega do cache (offline) ou busca na rede
self.addEventListener('fetch', (evento) => {
  if (!evento.request.url.startsWith('http')) return;

  evento.respondWith(
    caches.match(evento.request).then((cache) => cache || fetch(evento.request))
  );
});
