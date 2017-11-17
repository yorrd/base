import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';

require('@skatejs/ssr/register');
const render = require('@skatejs/ssr');


const TestCollection = new Mongo.Collection('mongo-data');
const SpendingsCollection = new Mongo.Collection('spendings');
const MieterDaten = new Mongo.Collection('mieterdaten');

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.publish('mongo-data', filtered => TestCollection.find(filtered ? { name: 'xxx' } : {}));
    Meteor.publish('spendings', () => SpendingsCollection.find());
    Meteor.publish('mieterdaten', () => MieterDaten.find());
    TestCollection.allow({
        insert: () => true,
        update: () => true,
        remove: () => true,
    });
    SpendingsCollection.allow({
        insert: () => true,
        update: () => true,
        remove: () => true,
    });
    MieterDaten.allow({
        insert: () => true,
        update: () => true,
        remove: () => true,
    });
});

class Hello extends HTMLElement {
    static get is() { return 'x-hello'; }
    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `

<style is="custom-style" include="iron-flex iron-flex-alignment adornis"></style>
<style>

:root {font-family: sans-serif}
.main{
    @apply(--layout-horizontal);
    @apply(--layout-center-center);
}
app-header {
    background-color: var(--primary-color);
    color: #fff;
}
app-header paper-icon-button {
    --paper-icon-button-ink-color: white;
}
.print-break {
    page-break-after: always;
    page-break-inside: avoid;
}
paper-input-container input {
    @apply(--paper-input-container-shared-input-style);
}
hr {
    margin: 3em 0;
}
</style>

<app-location route="{{route}}"></app-location>
<app-route route="{{route}}" pattern="/:page" data="{{routeData}}"></app-route>

<app-header-layout class="fit layout vertical">

<mongo-repeat id="mdata" collection="mongo-data" sub-params="{{subParams}}" debounce-interval="100">
    <template>
        <paper-card>{{item.name}}</paper-card>
    </template>
</mongo-repeat>

<paper-toggle-button on-checked-changed="_toggleFilter"></paper-toggle-button>
<paper-button on-tap="_add">add</paper-button>

<hr />

<paper-button on-click="handleUpdateMessage">Insert Hallo Welt</paper-button>
<mongo-data id="mongoData" filter="{{filter}}"></mongo-data>

<hr />

<input type="text" value="{{wasserKosten}}"></input>

<hr />

</app-header-layout>

`;
    }
}
customElements.define('x-hello', Hello);
render(new Hello(), true).then(console.log);

// mit Hello funktionierts, jetzt polymer...
// import { MyApp } from '../imports/ui/components/polymer-3-test.js';
//
// render(new MyApp(), true).then(console.log);

onPageLoad(async (sink) => {
    const skateOut = await render(new Hello(), true);
    sink.appendToBody(`<div id="ssr">${skateOut}</div>`);
});
