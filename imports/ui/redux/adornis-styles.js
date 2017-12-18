import '../node_links/@polymer/polymer/polymer.js';

const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `
<dom-module id="yaskawa-colors">
    <template>
    <style>

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
