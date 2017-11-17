import ReduxComponent from '../redux/polymer-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';
import '../redux/mongo-repeat.js';

import '../node_links/@polymer/paper-input/paper-input.js';
import '../node_links/@polymer/paper-button/paper-button.js';
import '../node_links/@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../node_links/@polymer/app-layout/app-header/app-header.js';

export class MyApp extends ReduxComponent(Element) { // eslint-disable-line

    static get template() {
        // need innerHTML for syntax highlighting. Need to disable the linter
        // eslint-disable-next-line
        return innerHTML = `

<style is="custom-style" include="iron-flex iron-flex-alignment adornis"></style>
<style>
</style>

<!--================== <Router> ================-->

<app-location route="{{route}}"></app-location>

<app-route route="{{route}}" pattern="/:page" data="{{routeData}}"></app-route>

<!--================= </Router> ================-->

<app-header-layout class="fit layout vertical">

<mongo-repeat id="mdata" collection="mongo-data" sub-params="{{subParams1}}" debounce-interval="100">
    <template>
        <paper-card>{{item.name}}</paper-card>
    </template>
</mongo-repeat>

<mongo-repeat id="mdata" collection="mongo-data" sub-params="{{subParams2}}" debounce-interval="100">
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
            subParams1: {
                type: Array,
                value: [false],
            },
            subParams2: {
                type: Array,
                value: [true],
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
        this.set('subParams1', [e.detail.value]);
        this.set('subParams2', [!e.detail.value]);
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
