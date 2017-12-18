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
}
