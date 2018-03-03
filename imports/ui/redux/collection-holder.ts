import { Mongo } from "meteor/mongo";

export default class CollectionHolder {
    public static getCollection(coll: string, persistent: boolean = false) {
        if (!coll) throw new Error("can't get collection undefined");
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

    private static collection: object;
}
