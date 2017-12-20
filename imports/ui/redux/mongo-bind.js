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

                        if (newValue._id) this.getCollection(this.collection).update({ _id: newValue._id }, { $set: setObj });
                        else {
                            this.getCollection(this.collection).insert(setObj);
                            this._updateResults(this.selector);
                        }
                    };
                },
            },
            default: { type: Object, value: {} },
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
        if (!this.selector || !this.collection) return;
        this.subscribe(this.collection, 'subParams');

        if (this._obs) this._obs.stop();
        this._obs = this.getCollection(this.collection).find(this.selector).observe({
            added: () => this._updateResults(this.selector),
            removed: () => this._updateResults(this.selector),
            changed: () => this._updateResults(this.selector),
            movedTo: () => this._updateResults(this.selector),
        });
    }

    _updateResults(selector) {
        const didIWatchBefore = this.watch;
        this.watch = false;

        const result = this.getCollection(this.collection).findOne(selector);
        if (!this.__instance) return;
        this.__instance.set('item', result || this.default);

        this.watch = didIWatchBefore;
    }
}

window.customElements.define(MongoBind.is, MongoBind);
