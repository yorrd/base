import AdornisMongoMixin from '../redux/adornis-mongo-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';

class MongoBind extends AdornisMongoMixin(Element) {
    static get is() {
        return 'mongo-bind';
    }

    static get properties() {
        return {
            item: { type: Object, value: {} },
            collection: { type: String, observer: '_collectionChanged' },
            subParams: { type: Array, value: [] },
            selector: { type: Object, value: {}, observer: '_updateResults' },
            watch: { type: Boolean, value: true },
            update: {
                type: Function,
                value() {
                    return function update(newValue, diff) {
                        if (!this.watch) return;
                        if (!newValue || !newValue._id) return;
                        const key = diff.path.split('.')[1];
                        const setObj = {};
                        setObj[key] = diff.value;
                        this.getCollection(this.collection).update({ _id: newValue._id }, { $set: setObj });
                    };
                },
            },
        };
    }

    static get observers() {
        return [
            'update(item, item.*)',
        ];
    }

    static get template() {
        return '<div></div>';
    }

    connectedCallback() {
        super.connectedCallback();
        this.hidden = true;
        const template = this.querySelector('template');
        this.__instance = this._stampTemplate(template);
        this.root.appendChild(this.__instance);
    }

    _collectionChanged(coll) {
        this.subscribe(coll, 'subParams');

        if (this._obs) this._obs.stop();
        console.log('observing');
        this._obs = this.getCollection(this.collection).find(this.selector).observe({
            added: this._updateResults.bind(this),
            removed: this._updateResults.bind(this),
            changed: this._updateResults.bind(this),
            movedTo: this._updateResults.bind(this),
        });
    }

    _updateResults() {
        const didIWatchBefore = this.watch;
        this.watch = false;

        this.set('item', this.getCollection(this.collection).findOne(this.selector));

        this.watch = didIWatchBefore;
    }
}

window.customElements.define(MongoBind.is, MongoBind);
