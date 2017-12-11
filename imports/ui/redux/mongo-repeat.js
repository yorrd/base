import AdornisMongoMixin from '../redux/adornis-mongo-mixin.js';
import { DomRepeat } from '../node_links/@polymer/polymer/lib/elements/dom-repeat.js';
import { afterNextRender } from '../node_links/@polymer/polymer/lib/utils/render-status.js';

class MongoRepeat extends AdornisMongoMixin(DomRepeat) {
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
            subFilter: { type: Object, value: {} },
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

        afterNextRender(this, () => {
            const f = (e) => {
                if (this.modelForElement(e.currentTarget)) {
                    this.remove(this.modelForElement(e.currentTarget).index);
                } else {
                    // I'm guessing this is because of concurrency. Can actually ignore it
                    console.warn('trying to remove an element with this event, but there is no currentTarget in there', e.currentTarget);
                }
            };
            this.addEventListener('dom-change', () => {
                this.parentNode.querySelectorAll('[remove]').forEach((el) => {
                    el.removeEventListener('tap', f);
                    el.addEventListener('tap', f);
                });
            });
        });
    }

    _setCollection(collection) {
        if (!collection) return;
        this._subscribeCollection('items', collection, collection, 'subParams', this.persistentCollection, 'subFilter');
    }

    insert(obj) {
        this.push('items', obj);
    }

    remove(i) {
        this.splice('items', i, 1);
    }
}

window.customElements.define(MongoRepeat.is, MongoRepeat);
