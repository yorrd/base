import ReduxComponent from '../redux/polymer-mixin.js';

import '../node_links/@polymer/paper-input/paper-input.js';
import '../node_links/@polymer/paper-button/paper-button.js';
import '../node_links/@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../node_links/@polymer/app-layout/app-header/app-header.js';

export class MyApp extends ReduxComponent { // eslint-disable-line

    static get template() {
        // need innerHTML for syntax highlighting. Need to disable the linter
        // eslint-disable-next-line
        return innerHTML = `

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

<!--================== <Router> ================-->

<app-location route="{{route}}"></app-location>

<app-route route="{{route}}" pattern="/:page" data="{{routeData}}"></app-route>

<!--================= </Router> ================-->

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

<!-- <div>
<div id="inputs">
</div>
<div class="page-break"></div>
<template is="dom-repeat" items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]" index-as="index">
<div class="layout vertical end" style="height: 60px"> -->
<!-- TODO use svg logo -->
<!-- <img src="/logo_neu.png" width="120" height="120" />
</div>
<adornis-nebenkosten-aufstellung mieter-id=""></adornis-nebenkosten-aufstellung>
<adornis-nebenkosten></adornis-nebenkosten> -->
<!-- <adornis-nebenkosten-zaehlerdetails mieter-id="0" style="page-break-after: always"></adornis-nebenkosten-zaehlerdetails> -->
<!-- <adornis-nebenkosten-aufstellung mieter-id="{{item}}"></adornis-nebenkosten-aufstellung>
<div class="print-break"></div>
</template>
</div> -->

</app-header-layout>

`;
    }

    static get properties() {
        return {
            route: Object,
            routeData: Object,

            wasserKosten: {
                type: Number, value: 2627.82, statePath: 'wasserKosten', dispatch: true,
            },
            subParams: {
                type: Array,
                value: [false],
            },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        // TODO works, but with js
        // import('./adornis-finance.html');
        // import('./mongo-data.html');
        // import('../bower_components/paper-button/paper-button.html');
    }

    _toggleFilter(e) {
        this.set('subParams', [e.detail.value]);
    }

    _add() {
        this.$.mdata.insert({ name: 'hihihi' });
    }

    handleUpdateMessage() {
        this.$.mongoData.push('todos', { name: 'inserted via array modification' });
        this.$.mongoData.dispatch('insert', { name: 'inserted via dispatch' }, 'mongo-data', 'mongodata_unfiltered');
    }
}

customElements.define('polymer-3-test', MyApp);
