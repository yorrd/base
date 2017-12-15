import AdornisMongoMixin from '../redux/adornis-mongo-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';
import { afterNextRender } from '../node_links/@polymer/polymer/lib/utils/render-status.js';
import '../node_links/@polymer/iron-flex-layout/iron-flex-layout-classes.js';

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

<div class="layout horizontal wrap">
    <mongo-repeat id="mdata1" collection="mongo-data" sub-params="{{subParams1}}" sub-filter="{{filter}}">
        <template>
            <paper-input style="width: 100px" value="{{item.name}}"></paper-input>
        </template>
    </mongo-repeat>
</div>
<paper-toggle-button on-checked-changed="_switchFilter"></paper-toggle-button> toggle filter
{{print(filter)}}
<paper-button on-tap="_add">add</paper-button>

<hr />

<mongo-repeat id="mdata2" collection="spendings" sub-params="{{subParams2}}">
    <template>
        <paper-button remove>{{item.usage}}</paper-button>
    </template>
</mongo-repeat>

<paper-toggle-button on-checked-changed="_toggleParams"></paper-toggle-button> toggle params
switches between 'useful usage' and no params: {{subParams2}}
<paper-button on-click="handleUpdateMessage">Insert random (50/50)</paper-button>

<hr />

<paper-input value="{{wasserKosten}}"></paper-input>

<hr />

multiplied 3 and 4: {{mul(3, 4)}}

<hr />

<mongo-bind collection="mongo-data" selector="{}">
    <template>
        {{print(item)}}
        <paper-input value="{{item.name}}"><paper-input>
    </template>
</mongo-bind>

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
            filter: {
                type: Object,
                value: {name: 'hihihi'}
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        afterNextRender(this, () => {
            import('../redux/adornis-router.js');
            import('../node_links/@polymer/paper-button/paper-button.js');
            import '../redux/mongo-repeat.js';
            import '../redux/mongo-bind.js';

            import '../node_links/@polymer/paper-input/paper-input.js';
            import '../node_links/@polymer/paper-toggle-button/paper-toggle-button.js';
            import '../node_links/@polymer/app-layout/app-header-layout/app-header-layout.js';
            import '../node_links/@polymer/app-layout/app-header/app-header.js';
        });
        document.querySelector('#loading').style.display = 'none';
    }

    _toggleParams(e) {
        this.set('subParams2', e.detail.value ? [] : ['useful usage']);
    }

    _add() {
        this.$.mdata1.insert({ name: 'hihihi' + Math.floor(Math.random() * 10) });
    }

    handleUpdateMessage() {
        this.$.mdata2.insert({ usage: Math.random() < .5 ? 'wat anderes' : 'useful usage' });
    }

    _switchFilter(e) {
        this.filter = !e.detail.value ? {} : {name: 'hihihi'};
    }
}

customElements.define('polymer-3-test', MyApp);
