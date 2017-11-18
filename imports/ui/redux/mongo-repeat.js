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
                // statepath and collection will be set later in the _setCollection
                notify: true, // TODO I want to set this to notify, but then we'd have a notify property which is at the same time a redux property
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
        // could as well do the declarative stuff in the properties but we want this with a dynamic collection and params, so...
        if (!collection) return;
        // manual binding
        // TODO do this with a function on statePath
        this.addEventListener('state-changed', (e) => {
            if (!e.detail[collection]) return;
            if (this.debounceInterval) {
                this._debouncer = Debouncer.debounce(
                    this._debouncer,
                    timeOut.after(this.debounceInterval),
                    () => this.set('items', e.detail[collection]),
                );
            } else {
                this.set('items', e.detail[collection]);
            }
        });
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
