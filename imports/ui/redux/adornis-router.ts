import AdornisMixin from "./adornis-mixin.js";
import {
    Element,
    html,
} from "../node_links/@polymer/polymer/polymer-element.js";

import "../node_links/@polymer/app-route/app-location.js";
import "../node_links/@polymer/app-route/app-route.js";

// Impotant Pattern Note: Case ["/:a/:b", "/:a"]

class AdornisRouter extends AdornisMixin(Element) {
    static get template() {
        // eslint-disable-next-line
        return html`
            <app-location
                id="applocation"
                route="{{_route}}"
                path="{{_routePath}}"
                query-params="{{_routeQueryParams}}"></app-location>
            <template is="dom-repeat" items="{{_resArray}}">
                <app-route
                    route="{{_route}}"
                    pattern="{{_getNthPattern(index)}}"
                    data="{{item.data}}"
                    query-params="{{item.queryParams}}"
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
                observer: "_updateHelper",
            },

            // -----COMPONENT-----
            // all patterns to split url
            patterns: {
                type: Array,
                value: [],
            },

            // -----REDUX STATE-----
            // route Obj saved in state
            _routeObj: {
                type: Object,
                statePath: "router",
            },

            _routePath: {
                type: String,
                statePath: "router.path",
            },

            _routeQueryParams: {
                type: Object,
                statePath: "router.queryParams",
            },
        };
    }

    public connectedCallback() {
        super.connectedCallback();

        if (this.patterns.length === 0)
            throw new Error("Adornis Router needs at least one pattern");
        this.set("_resArray", []);
        this.patterns.forEach(() => {
            this.push("_resArray", {
                data: "",
                queryParams: "",
                active: false,
            });
        });
        this._writeToState(this._resArray);
    }

    private __writeToState(arr) {
        // TODO I have no FUCKING clue why we need setTimeout here, but otherwise array is not loaded completely
        setTimeout(() => {
            if (!arr) return;
            const filtered = arr.find(entry => entry.active);
            const routeObj = {
                data: filtered.data,
                queryParams: filtered.queryParams,
                path: this._route.path,
            };
            if (JSON.stringify(routeObj) === JSON.stringify(this._routeObj))
                return;
            this.set("routeObj", routeObj);
        });
    }

    private __getNthPattern(index) {
        return this.patterns[index];
    }

    private _updateHelper() {
        this._writeToState(this._resArray);
    }
}

window.customElements.define("adornis-router", AdornisRouter);
