import AdornisMixin from './adornis-mixin.js';
import CollectionHolder from './collection-holder';

export default parent => class AdornisMongoMixin extends AdornisMixin(parent) {
    subscribe(coll, paramWatchProp) {
        if (!paramWatchProp) {
            console.info(`${coll} won't listen for param updates because there is no param property given`);

            this._subscribe([], coll);
        } else {
            // listen for filter changes
            const paramListenerName = `_changeParam_${coll}`;
            this[paramListenerName] = (params) => {
                // set timeout here because we don't want to execute this before the actual change has been committed
                // otherwise, we're taking an old value
                setTimeout(() => this._subscribe(params, coll));
            };
            this._createPropertyObserver(paramWatchProp, paramListenerName);
            // execute once
            this[paramListenerName](this.subParams);
        }
    }

    _subscribe(params, coll) { // eslint-disable-line class-methods-use-this
        const sub = Meteor.subscribe(coll, ...params);
        Tracker.autorun(() => {
            this.dispatch({ type: 'SUB_STATUS', coll, ready: sub.ready() });
        });
    }

    // ======================== mirror from CollectionHolder for easier accessibility

    getCollection(name) { // eslint-disable-line class-methods-use-this
        return CollectionHolder.getCollection(name);
    }

    _setObserverHandle(statePath, handle, collection, params) { // eslint-disable-line class-methods-use-this
        return CollectionHolder.setObserverHandle(statePath, handle, collection, params);
    }

    _stopObserverHandle(statePath) { // eslint-disable-line class-methods-use-this
        return CollectionHolder.stopObserverHandle(statePath);
    }
};
