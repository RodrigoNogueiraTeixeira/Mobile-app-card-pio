// Registra o Service Worker ao carregar a página
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then((registro) => {
        console.log('Service Worker registrado:', registro.scope);
      })
      .catch((erro) => {
        console.error('Falha ao registrar Service Worker:', erro);
      });
  }
});
