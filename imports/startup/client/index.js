
window.addEventListener('WebComponentsReady', () => {
    import '../../ui/index.html';
    // TODO dynamic import takes actually longer, why is that? maybe because of the rendering of another script?
    // import('../../ui/index.html');
});
