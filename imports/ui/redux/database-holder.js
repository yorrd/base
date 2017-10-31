export default class DatabaseHolder {
    static getDatabase(coll) {
        if (!this.databases) this.databases = {};
        if (!this.databases[coll]) { this.databases[coll] = new Mongo.Collection(coll); }
        return this.databases[coll];
    }
    static setObserverHandle(statePath, handle) {
        if (!this.observerHandles) this.observerHandles = [];
        DatabaseHolder.stopObserverHandle(statePath);
        this.observerHandles[statePath] = handle;
    }
    static stopObserverHandle(statePath) {
        if (!this.observerHandles) this.observerHandles = [];
        if (this.observerHandles[statePath]) this.observerHandles[statePath].stop();
    }
}