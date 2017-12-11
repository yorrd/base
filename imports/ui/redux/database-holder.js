export default class DatabaseHolder {
    static getDatabase(coll, persistent) {
        if (!coll) throw new Error('can\'t get collection undefined');
        if (!this.databases) this.databases = {};
        if (!this.databases[coll]) {
            if (persistent) {
                this.databases[coll] = new Mongo.Collection(coll);
            } else {
                this.databases[coll] = new Mongo.Collection(coll);
            }
        }
        return this.databases[coll];
    }
    static setObserverHandle(statePath, handle, collection, params) {
        if (!this.observerHandles) this.observerHandles = [];
        DatabaseHolder.stopObserverHandle(statePath);
        Meteor.subscribe(collection, ...params);
        this.observerHandles[statePath] = handle;
    }
    static stopObserverHandle(statePath) {
        if (!this.observerHandles) this.observerHandles = [];
        // we don't need to stop the meteor subscription because they're made to combine, not to reset when you resubscribe
        if (this.observerHandles[statePath]) { this.observerHandles[statePath].stop(); }
    }
}
