// Element is the same as Polymer.Element in 2.x
// Modules give you the freedom to rename the members that you import
import { MwcMixin } from 'meteor/mwc:mixin';

// Added "export" to export the MyApp symbol from the module
export class MyApp extends MwcMixin(PolymerElement) {
    // Define a string template instead of a `<template>` element.
    static get template() {
        return `<div>This is my [[name]] app.</div>`;
    }

    constructor() {
        super();
        this.name = '3.0 preview';
    }

    // properties, observers, etc. are identical to 2.x
    static get properties() {
        return {
            name: { type: String },
        };
    }
}

customElements.define('polymer-3-test', MyApp);
