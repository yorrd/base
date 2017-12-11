import AdornisMongoMixin from '../redux/adornis-mongo-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';

import '../node_links/@polymer/paper-input/paper-input.js';
import '../node_links/@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../node_links/@polymer/app-layout/app-header/app-header.js';

export class MyApp extends AdornisMongoMixin(Element) { // eslint-disable-line

    static get template() {
        // need innerHTML for syntax highlighting. Need to disable the linter
        // eslint-disable-next-line
        return innerHTML = `

<style is="custom-style" include="iron-flex iron-flex-alignment adornis"></style>
<style>
</style>

<adornis-router></adornis-router>

<app-header-layout class="fit layout vertical">

<mongo-repeat id="mdata1" collection="mongo-data" sub-params="{{subParams1}}">
    <template>
        <paper-card>{{item.name}}</paper-card>
    </template>
</mongo-repeat>

<hr />

<mongo-repeat id="mdata2" collection="spendings" sub-params="{{subParams2}}">
    <template>
        <paper-button remove>{{item.usage}}</paper-button>
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

multiplied 3 and 4 {{mul(3, 4)}}

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
                value: ['useful usage'],
            },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        import('../redux/adornis-router.js');
        import('../redux/mongo-repeat.js');
        import('../node_links/@polymer/paper-button/paper-button.js');
        document.querySelector('#loading').style.display = 'none';
    }

    _toggleFilter(e) {
        this.set('subParams1', [e.detail.value]);
        this.set('subParams2', [!e.detail.value]);
    }

    _add() {
        this.$.mdata1.insert({ name: 'hihihi' });
    }

    handleUpdateMessage() {
        this.$.mdata2.insert({ usage: 'useful usage' });
    }
}

customElements.define('polymer-3-test', MyApp);
