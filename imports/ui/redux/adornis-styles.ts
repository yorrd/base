import "../node_links/@polymer/polymer/polymer.js";

const docContainer = document.createElement("div");
docContainer.setAttribute("style", "display: none;");

docContainer.innerHTML = `
<dom-module id="adornis">
<template>
<style>
    :host {
        --space-xs: 2px;
        --space-sm: 4px;
        --space-md: 8px;
        --space-lg: 16px;
        --space-xl: 32px;
        --space-xxl: 64px;
    }
</style>
</template>
</dom-module>`;

document.head.appendChild(docContainer);
