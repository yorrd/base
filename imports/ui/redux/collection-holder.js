export default class CollectionHolder {
    static getCollection(coll, persistent) {
        if (!coll) throw new Error('can\'t get collection undefined');
        if (!this.collection) this.collection = {};
        if (!this.collection[coll]) {
            if (persistent) {
                this.collection[coll] = new Mongo.Collection(coll);
            } else {
                // TODO persistence, GroundDB
                this.collection[coll] = new Mongo.Collection(coll);
            }
        }
        return this.collection[coll];
    }
    static setObserverHandle(handle, collection, params) {
        if (!this.observerHandles) this.observerHandles = [];
        CollectionHolder.stopObserverHandle(collection);
        Meteor.subscribe(collection, ...params);
        this.observerHandles[collection] = handle;
    }
    static stopObserverHandle(collection) {
        if (!this.observerHandles) this.observerHandles = [];
        // we don't need to stop the meteor subscription because they're made to combine, not to reset when you resubscribe
        if (this.observerHandles[collection]) { this.observerHandles[collection].stop(); }
    }
}

// TODO register in redux that we're registered for debugging
// TODO do we need observer handle registration?
