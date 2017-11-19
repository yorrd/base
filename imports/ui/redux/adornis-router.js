import ReduxComponent from './polymer-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';

import '../node_links/@polymer/app-route/app-location.js';
import './polymer-mixin.js';

class AdornisRouter extends ReduxComponent(Element) {
    static get template() {
        return innerHTML = `
            <app-location id="applocation" route="{{_route}}"></app-location>
        `;
    }
    static get properties() {
        return {
            routeManual: {
                type: String,
                statePath: 'route.manual',
            },
            routePage: {
                type: String,
                statePath: 'route.page',
            },
            routePageType: {
                type: String,
                statePath: 'route.pagetype',
                observer: 'print',
            },
            routeTail: {
                type: String,
                statePath: 'route.tail',
            },
            goToRoute: {
                type: String,
                statePath: 'router',
                dispatch: true,
                observer: 'go',
            },

            pattern: String,

            _route: {
                type: Object,
                observer: '_handleRoute',
            },
        };
    }

    go(location) {
        if (location) { this.set('_route.path', location); } else {
            this.set('_route.path', '/');
        }
    }

    _handleRoute(pathObj) { // eslint-disable-line class-methods-use-this
        const { path } = pathObj;
        if (!path) return;
        const pathParts = path.split('/');
        const toplevel = pathParts[1];
        const tail = pathParts.slice(3).join('/');
        let pageType = 'home';
        if (toplevel) {
            switch (toplevel) {
                    case 'search':
                    case 'settings':
                    case 'notes':
                    case 'license':
                    case 'change-languages':
                        pageType = toplevel;
                        break;
                    default:
                        if (pathParts.length > 2) pageType = 'manual';
                        else pageType = 'manualindex';
            }
        }

        this.dispatch({ type: 'UPDATE_MANUAL', value: toplevel });
        this.dispatch({ type: 'UPDATE_PAGE', value: pathParts[pathParts.indexOf(toplevel) + 1] });
        this.dispatch({ type: 'UPDATE_PAGETYPE', value: pageType });
        this.dispatch({ type: 'UPDATE_TAIL', value: tail });
    }
}

window.customElements.define('adornis-router', AdornisRouter);
