import ReduxComponent from '../redux/polymer-mixin.js';
import { DomRepeat } from '../node_links/@polymer/polymer/lib/elements/dom-repeat.js';
import { Debouncer } from '../node_links/@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '../node_links/@polymer/polymer/lib/utils/async.js';

class MongoRepeat extends ReduxComponent(DomRepeat) {
    static get is() {
        return 'mongo-repeat';
    }

    static get properties() {
        return {
            items: {
                type: Array,
                value: [],
                // collection will be set later in the _setCollection
                statePath(state) { return state[this.collection]; },
                notify: true, // exception for the redux paradigm of not binding to the parent, this is only because it's a "builtin"
            },
            subParams: { type: Array, value: [] },
            debounceInterval: Number,
            collection: { type: String, value: null, observer: '_setCollection' },
            persistentCollection: { type: Boolean, value: false },

            // because of the database-nature of things, immediately change the defaults for initial count and target framerate
            // this SHOULD be overwritten, but it's better this way than not set at all
            initialCount: { type: Number, value: 50 },
            targetFramerate: { type: Number, value: 60 },
        };
    }

    static get template() {
        // overarching template, work to be done here (add button)
        return null;
    }

    constructor() {
        super();

        const f = e => this.remove(this.modelForElement(e.currentTarget).index);
        this.addEventListener('dom-change', () => {
            this.parentNode.querySelectorAll('[remove]').forEach((el) => {
                el.removeEventListener('tap', f);
                el.addEventListener('tap', f);
            });
        });
    }

    _setCollection(collection) {
        if (!collection) return;
        this._subscribeCollection('items', collection, collection, 'subParams', this.persistentCollection);
    }

    insert(obj) {
        this.push('items', obj);
    }

    remove(i) {
        this.splice('items', i, 1);
    }
}

window.customElements.define(MongoRepeat.is, MongoRepeat);
