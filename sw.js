// Nome do cache e lista de arquivos para funcionamento offline
const CACHE_NAME = 'cardapio-pwa-v4';
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

// Intercepta requisições: busca na rede primeiro (atualiza cache); se estiver offline, entrega do cache
self.addEventListener('fetch', (evento) => {
  if (!evento.request.url.startsWith('http')) return;

  evento.respondWith(
    fetch(evento.request)
      .then((respostaRede) => {
        if (respostaRede && respostaRede.status === 200) {
          const respostaClone = respostaRede.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(evento.request, respostaClone));
        }
        return respostaRede;
      })
      .catch(() => caches.match(evento.request))
  );
});
