import AdornisMixin from './adornis-mixin.js';
import CollectionHolder from './collection-holder';

export default parent => class AdornisMongoMixin extends AdornisMixin(parent) {
    constructor() {
        super();
        // TODO clean up here

        const props = this.constructor.properties;

        // subscribe to all databases required by the properties
        Object.keys(props)
            .filter(prop => props[prop].collection)
            .forEach((dbProp) => {
                const property = this.constructor.properties[dbProp];
                this.subscribe(property.collection, property.paramProperty);
            });

        // get automatically managed polymer properties
        Object.keys(props)
            .filter(prop => props[prop].dispatch)
            .forEach((trackedProp) => {
                const { statePath } = props[trackedProp];
                if (statePath.includes('.')) throw new Error("no nested polymer properties allowed at this time for the 'dispatch' shorthand");
                const listenerName = `_trackedPropChanged__${statePath.replace('.', '_')}`;
                if (!statePath) throw new Error(`dispatch given but not statePath for property ${trackedProp}`);

                this[listenerName] = (newVal) => {
                    if (!newVal) return;
                    this.dispatch({
                        type: 'UPDATE_POLYMER_VARIABLE',
                        statePath,
                        value: newVal,
                        persistent: props[trackedProp].persistent,
                    });
                };

                // this._createPropertyObserver(trackedProp, listenerName);
                this._createMethodObserver(`${listenerName}(${trackedProp}, ${trackedProp}.*)`);
            });
    }

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
        Meteor.subscribe(coll, ...params);
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
