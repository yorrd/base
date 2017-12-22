import AdornisMongoMixin from '../redux/adornis-mongo-mixin.js';
import { Element } from '../node_links/@polymer/polymer/polymer-element.js';
import { Templatize } from '../node_links/@polymer/polymer/lib/utils/templatize.js';
import { _stampTemplate } from '../node_links/@polymer/polymer/lib/mixins/template-stamp.js';

class MongoBind extends AdornisMongoMixin(Element) {
    static get properties() {
        return {
            item: { type: Object, value: {} },
            collection: { type: String, observer: '_collectionChanged' },
            subParams: { type: Array, value: [] },
            selector: { type: Object, value: {}, observer: '_collectionChanged' },
            watch: { type: Boolean, value: true },
            createNew: { type: Boolean, value: false },
            update: {
                type: Function,
                value() {
                    return function update(newValue, diff) {
                        if (!this.watch) return;
                        if (!newValue) return;
                        if (!Object.keys(this.item).length === 0) return;

                        const forbiddenKeys = Object.keys(this.selector);

                        const setObj = {};
                        if (diff) {
                            if (!diff.path.includes('.')) return;
                            const key = diff.path.split('.')[1];
                            if (forbiddenKeys.includes(key)) throw new Error('cant update a field which is used in the selector');
                            setObj[key] = diff.value;
                        } else throw new Error('diff missing');

                        if (Object.keys(setObj).length === 0) return;

                        if (newValue._id) this.getCollection(this.collection).update({ _id: newValue._id }, { $set: setObj });
                        else throw new Error('should never get here, creation should happen at the bottom of the file');
                    };
                },
            },
            // default must include the selector, so that when inserting the default case, the selector is satisfied
            default: { type: Object, value: null },
            subReady: {
                type: Boolean,
                value: false,
                statePath(state) {
                    if (!state.subReady) return false;
                    return state.subReady[this.collection];
                },
                observer: '_collectionChanged',
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
            mutableData: this.mutableData,
            parentModel: true,
            instanceProps: { item: true },
            forwardHostProp(prop, value) {
                this.__instance.forwardHostProp(prop, value);
            },
            notifyInstanceProp(inst, prop, value) {
                this.set(prop, value);
                this.notifyPath(prop);
            },
        });

        this.__instance = new this.__ctor();

        super.connectedCallback();

        this.root.appendChild(this.__instance.root);
    }

    // is also called from the subReady observer, so there can be a boolean property
    _collectionChanged(undefinedOrSubStatus) {
        if (undefinedOrSubStatus === false) return; // if undefined, this has been called by a different observer
        if (!this.selector || !this.collection) return;
        if (undefinedOrSubStatus === undefined) { // means that we actually changed something so that we need to resubscribe
            this.subscribe(this.collection, 'subParams');
        }

        if (this._obs) this._obs.stop();
        this._updateResults();
        this._obs = this.getCollection(this.collection).find(this.selector).observe({
            added: () => this._updateResults(),
            removed: () => this._updateResults(),
            changed: () => this._updateResults(),
            movedTo: () => this._updateResults(),
        });
    }

    _updateResults(justInsertedDefaultWithThisId) {
        const didIWatchBefore = this.watch;
        this.watch = false;

        const result = this.getCollection(this.collection).findOne(this.selector);

        if (result) {
            // just set it, if we have a valid result
            this.__instance.set('item', result);
        } else if (this.subReady) {
            if (justInsertedDefaultWithThisId) {
                throw new Error('Your default case is inserting objects which dont satisfy your filter. ' +
                                'This would lead to useless object creation');
            }

            if (!this.createNew) {
                console.error('You dont want me to create a new element (this.createNew) and there is nothing in the collection');
                console.log('This could be because youre setting the wrong sub-params (temporarily?)');
                return;
            }

            // if we don't and the sub is ready, insert the default case
            const def = this.default || this.selector; // if we don't have a default case, assume the selector
            const newId = this.getCollection(this.collection).insert(def);
            // and re-evaluate
            this._updateResults(newId);
        }

        this.watch = didIWatchBefore;
    }
}

window.customElements.define('mongo-bind', MongoBind);
