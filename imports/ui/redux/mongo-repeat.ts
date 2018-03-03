import { DomRepeat } from "../node_links/@polymer/polymer/lib/elements/dom-repeat.js";
import { afterNextRender } from "../node_links/@polymer/polymer/lib/utils/render-status.js";
import AdornisMongoMixin from "../redux/adornis-mongo-mixin.js";

class MongoRepeat extends AdornisMongoMixin(DomRepeat) {
    static get is() {
        return "mongo-repeat";
    }

    static get properties() {
        return {
            collection: {
                type: String,
                value: null,
                observer: "_setCollection",
            },
            items: {
                notify: true,
                type: Array,
                value: [],
            },
            persistentCollection: { type: Boolean, value: false },
            subFilter: { type: Object, value: {}, observer: "_observe" },
            subParams: { type: Array, value: [] },
            watch: { type: Boolean, value: true },

            // because of the database-nature of things, immediately change the defaults for initial count and target
            // framerate this SHOULD be overwritten, but it's better this way than not set at all
            initialCount: { type: Number, value: 50 },
            targetFramerate: { type: Number, value: 60 },
        };
    }

    static get observers() {
        return ["_arrayUpdate(items.*, items.*.*)"];
    }

    static get template() {
        // overarching template, work to be done here (add button)
        return null;
    }

    constructor() {
        super();

        afterNextRender(
            this,
            () => {
                const f = e => {
                    if (this.modelForElement(e.currentTarget)) {
                        this.remove(
                            this.modelForElement(e.currentTarget).index,
                        );
                    } else {
                        // I'm guessing this is because of concurrency. Can actually ignore it
                        console.warn(
                            "trying to remove an element with this event, " +
                                "but there is no currentTarget in there",
                            e.currentTarget,
                        );
                    }
                };
                this.addEventListener("dom-change", () => {
                    this.parentNode.querySelectorAll("[remove]").forEach(el => {
                        el.removeEventListener("tap", f);
                        el.addEventListener("tap", f);
                    });
                });
            },
            [],
        );
    }

    public connectedCallback() {
        super.connectedCallback();
        this.hidden = true;
    }

    public _setCollection(collection) {
        if (!collection) {
            return;
        }
        this.subscribe(collection, "subParams");
        this._observe();
    }

    public _observe() {
        if (this._obs) this._obs.stop();

        this.set("items", []);
        this._obs = this.getCollection(this.collection)
            .find(this.subFilter)
            .observe({
                addedAt: doc => {
                    const wasWatchingBefore = this.watch;
                    this.watch = false;

                    const i = this.items.findIndex(
                        item => item._id === doc._id,
                    );
                    if (i === -1) {
                        this.push("items", doc);
                    } else {
                        this.splice("items", i, 0, doc);
                    }
                    // remove the temporary item
                    this.items.forEach((item, index) => {
                        if (!item._id) {
                            this.splice("items", index, 1);
                        }
                    });

                    this.watch = wasWatchingBefore;
                },
                changedAt: (newDoc, oldDoc) => {
                    const wasWatchingBefore = this.watch;
                    this.watch = false;

                    const i = this.items.findIndex(
                        item => item._id === oldDoc._id,
                    );
                    Object.keys(newDoc).forEach(newKey => {
                        if (
                            oldDoc[newKey] &&
                            newDoc[newKey] !== oldDoc[newKey]
                        ) {
                            this.set(`items.${i}.${newKey}`, newDoc[newKey]);
                        }
                    });
                    Object.keys(oldDoc).forEach(oldKey => {
                        if (!newDoc[oldKey]) {
                            this.set(`items.${i}.${oldKey}`, null);
                        }
                    });

                    this.watch = wasWatchingBefore;
                },
                movedTo: (doc, fromIndex, toIndex) => {
                    const wasWatchingBefore = this.watch;
                    this.watch = false;

                    // TODO can I use fromIndex / toIndex here?
                    this.splice("items", fromIndex, 1);
                    this.splice("items", toIndex, 0, doc);

                    this.watch = wasWatchingBefore;
                },
                removedAt: doc => {
                    const wasWatchingBefore = this.watch;
                    this.watch = false;

                    const i = this.items.findIndex(
                        item => item._id === doc._id,
                    );
                    if (i >= 0) this.splice("items", i, 1);

                    this.watch = wasWatchingBefore;
                },
            });
    }

    public insert(obj) {
        this.push("items", obj);
    }

    public remove(i) {
        this.splice("items", i, 1);
    }

    public change() {
        throw new Error("not implemented yet, no use case?");
    }

    public _arrayUpdate(diff) {
        // eslint-disable-line class-methods-use-this
        // when receiving from the database or when watching just isn't wanted, don't do this observer's logic
        if (!this.watch) {
            return;
        }

        const cursor = this.getCollection(this.collection);

        // this is for removals and additions
        if (diff.path.indexOf(".splices") > -1) {
            diff.value.indexSplices.forEach(id => {
                id.removed.forEach(obj => {
                    cursor.remove(obj._id);
                });
                if (id.addedCount === 1) {
                    const docId = id.object[id.index]._id;
                    if (!cursor.findOne(docId)) {
                        cursor.insert(id.object[id.index]);
                    }
                    // else console.log('skipping entry, already in the database');
                    // upserting doesn't work on the client and would be inappropriate anyways,
                    // becaue the update events are not handled here but below
                }
                if (id.addedCount > 1) {
                    throw new Error(
                        "multiple additions in splice are not yet supported",
                    );
                }
            });
        }

        // this should only run if there are deeper level updates in an object within the array from the database
        if (
            diff.path.indexOf(".") === -1 ||
            diff.path.indexOf(".splices") > -1 ||
            diff.path.indexOf(".length") > -1
        ) {
            return;
        }
        const ID = diff.path.split(".")[1];
        const dbObj = diff.base[ID];
        // will automatically trigger the mongo observer which will then update the data in the store
        const key = diff.path.split(".")[2];
        const setObj = {};
        setObj[key] = diff.value;
        cursor.update(dbObj._id, { $set: setObj });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        if (this._obs) this._obs.stop();
    }
}

window.customElements.define(MongoRepeat.is, MongoRepeat);
