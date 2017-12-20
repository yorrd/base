import AdornisMixin from './adornis-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';

import '../node_links/@polymer/app-route/app-location.js';
import '../node_links/@polymer/app-route/app-route.js';

class AdornisRouter extends AdornisMixin(Element) {
    static get template() {
        // eslint-disable-next-line
        return innerHTML = `
            <app-location id="applocation" route="{{_route}}" path="{{routePath}}" query-params="{{routeQueryParams}}"></app-location>
            <template is="dom-repeat" items="{{_resArray}}">
                <app-route
                    route="{{_route}}"
                    pattern="{{_getNthPattern(index)}}"
                    data="{{item.data}}"
                    query-params="{{item.queryParam}}"
                    active="{{item.active}}">
                </app-route>
            </template>
        `;
    }

    static get properties() {
        return {
            // -----LOCAL-----
            _resArray: {
                type: Array,
            },

            // route object created by app-location
            _route: {
                type: Object,
                observer: '_updateHelper',
            },

            // -----COMPONENT-----
            // all patterns to split url
            patterns: {
                type: Array,
                value: [],
            },

            // -----GLOBAL-----
            // route Obj saved in state
            routeObj: {
                type: Object,
                statePath: 'router',
            },

            routePath: {
                type: String,
                statePath: 'router.path',
            },

            routeQueryParams: {
                type: Object,
                statePath: 'router.queryParam',
            },
        };
    }

    _updateHelper() {
        this._writeToState(this._resArray);
    }

    connectedCallback() {
        super.connectedCallback();

        if (this.patterns.length === 0) throw new Error('Adornis Router needs at least one pattern');
        this.set('_resArray', []);
        this.patterns.forEach(() => { this.push('_resArray', { data: '', queryParam: '', active: false }); });
        this._writeToState(this._resArray);
    }

    _writeToState(arr) { // eslint-disable-line class-methods-use-this
        // TODO I have no FUCKING clue why we need setTimeout here, but otherwise array is not loaded completely
        setTimeout(() => {
            if (!arr) return;
            const filtered = arr.filter(entry => entry.active);
            const routeObj = { data: filtered[0].data, queryParam: filtered[0].queryParam, path: this._route.path };
            if (JSON.stringify(routeObj) === JSON.stringify(this.routeObj)) return;
            this.set('routeObj', routeObj);
        });
    }

    _getNthPattern(index) {
        return this.patterns[index];
    }
}

window.customElements.define('adornis-router', AdornisRouter);
