
// importing before wc's are ready, because we can do that. Then it can load "at the same time"

window.addEventListener('WebComponentsReady', () => {
    import('../../ui/components/polymer-3-test.js');
    // import '../../ui/index.html';
    // TODO dynamic import takes actually longer, why is that? maybe because of the rendering of another script?
    // import('../../ui/index.html');
});

import('./web-worker.js');
