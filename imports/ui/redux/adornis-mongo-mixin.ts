import { Meteor } from "meteor/meteor";
import AdornisMixin from "./adornis-mixin.js";
import CollectionHolder from "./collection-holder";

export default parent =>
    class AdornisMongoMixin extends AdornisMixin(parent) {
        public subscribe(coll, paramWatchProp) {
            if (!paramWatchProp) {
                console.info(
                    `${coll} won't listen for param updates because there is no param property given`,
                );

                this._subscribe([], coll);
            } else {
                // listen for filter changes
                const paramListenerName = `_changeParam_${coll}`;
                this[paramListenerName] = params => {
                    if (!(params instanceof Array))
                        throw new Error(
                            `Need an array as subParams, got ${params}`,
                        );
                    // set timeout here because we don't want to execute this
                    // before the actual change has been committed
                    // otherwise, we're taking an old value
                    setTimeout(() => this._subscribe(params, coll));
                };
                this._createPropertyObserver(paramWatchProp, paramListenerName);
                // execute once
                this[paramListenerName](this.subParams);
            }
        }
        public getCollection(name) {
            return CollectionHolder.getCollection(name);
        }

        private _subscribe(params, coll) {
            // eslint-disable-line class-methods-use-this
            const sub = Meteor.subscribe(coll, ...params);
            Tracker.autorun(() => {
                this.dispatch({ type: "SUB_STATUS", coll, ready: sub.ready() });
            });
        }
    };
