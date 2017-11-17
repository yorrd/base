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
        this.observerHandles[statePath] = { obs: handle, sub: Meteor.subscribe(collection, ...params) };
    }
    static stopObserverHandle(statePath) {
        if (!this.observerHandles) this.observerHandles = [];
        if (this.observerHandles[statePath]) {
            this.observerHandles[statePath].obs.stop();
            this.observerHandles[statePath].sub.stop();
        }
    }
}
