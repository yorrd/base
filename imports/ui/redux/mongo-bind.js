import AdornisMongoMixin from '../redux/adornis-mongo-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';
import { Templatize } from '../node_links/@polymer/polymer/lib/utils/templatize.js';

class MongoBind extends AdornisMongoMixin(Element) {
    static get is() {
        return 'mongo-bind';
    }

    static get properties() {
        return {
            item: { type: Object, value: {} },
            collection: { type: String, observer: '_collectionChanged' },
            subParams: { type: Array, value: [] },
            selector: { type: Object, value: {}, observer: '_collectionChanged' },
            watch: { type: Boolean, value: true },
            update: {
                type: Function,
                value() {
                    return function update(newValue, diff) {
                        if (!this.watch) return;
                        if (!newValue) return;
                        if (!Object.keys(this.item).length === 0) return;

                        let setObj = {};
                        if (diff) {
                            if (!diff.path.includes('.')) return;
                            const key = diff.path.split('.')[1];
                            setObj[key] = diff.value;
                        } else {
                            setObj = this.item;
                        }

                        if (Object.keys(setObj).length === 0) return;

                        console.log(newValue._id, newValue, this.selector);
                        if (newValue._id) this.getCollection(this.collection).update({ _id: newValue._id }, { $set: setObj });
                        else {
                            this.getCollection(this.collection).insert(setObj);
                            this._updateResults();
                        }
                    };
                },
            },
            default: { type: Object, value: {} },
            subReady: {
                type: Boolean,
                value: false,
                statePath(state) {
                    if (!state.subReady) return false;
                    return state.subReady[this.collection];
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
        const template = this.querySelector('template');

        this.__ctor = Templatize.templatize(template, this, {
            mutableData: true,
            forwardHostProp(prop, value) {
                // handling item updates
                this.set(prop, value);
                this.update(this.item);
            },
            notifyInstanceProp(inst, prop, val) {
                console.log('notiinstanceprop', inst, prop, val);
            },
        });

        this.__instance = new this.__ctor();

        super.connectedCallback();

        this.root.appendChild(this.__instance.root);
    }

    _collectionChanged() {
        console.log('changed', JSON.stringify(this.selector));
        if (!this.selector || !this.collection) return;
        this.subscribe(this.collection, 'subParams');

        if (this._obs) this._obs.stop();
        this._updateResults(this.selector);
        this._obs = this.getCollection(this.collection).find(this.selector).observe({
            added: () => this._updateResults(),
            removed: () => this._updateResults(),
            changed: () => this._updateResults(),
            movedTo: () => this._updateResults(),
        });
    }

    _updateResults() {
        const didIWatchBefore = this.watch;
        this.watch = false;

        if (this.getCollection(this.collection).find(this.selector).count(this.selector) === 0
            && this.subReady) {
            this.getCollection(this.collection).insert(this.default);
        }
        const result = this.getCollection(this.collection).findOne(this.selector);
        if (!this.__instance) return;
        console.log(this.selector);
        this.__instance.set('item', result || this.default);

        this.watch = didIWatchBefore;
    }
}

window.customElements.define(MongoBind.is, MongoBind);
