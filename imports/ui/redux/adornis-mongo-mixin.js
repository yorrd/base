import AdornisMixin from './adornis-mixin.js';
import DatabaseHolder from './database-holder';

export default parent => class AdornisMongoMixin extends AdornisMixin(parent) {
    static get actions() {
        return {
            insert(doc, collection, statePath) {
                if (!doc || !collection || !statePath) throw new Error('no doc, collection or statePath given');
                return {
                    type: 'INSERT_DOC',
                    collection,
                    statePath,
                    doc,
                };
            },
            remove(id, collection, statePath) {
                if (!id || !collection || !statePath) throw new Error('no id, collection or statePath given');
                return {
                    type: 'REMOVE_DOC',
                    collection,
                    statePath,
                    id,
                };
            },
            subscribe(params, collection, statePath, isPersistent, filter) {
                if (!params || !collection || !statePath) throw new Error('no params, collection or statePath given');
                return {
                    type: 'SUBSCRIBE',
                    parameters: params,
                    collection,
                    statePath,
                    isPersistent,
                    filter,
                };
            },
        };
    }

    constructor() {
        super();

        const props = this.constructor.properties;

        // subscribe to all databases required by the properties
        Object.keys(props)
            .filter(prop => props[prop].collection)
            .forEach((dbProp) => {
                const property = this.constructor.properties[dbProp];
                this._subscribeCollection(dbProp, property.collection, property.statePath, property.paramProperty);
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

        // if there is no dispatch but a statepath, don't allow a value, would be overridden instantly anyways
        // Object.keys(props)
        //     .filter(prop => !props[prop].dispatch && props[prop].statePath)
        //     .forEach((trackedProp) => {
        //         if (props[trackedProp].value) throw new Error(`there should be no value on the dispatch field ${trackedProp}`);
        //     });

        Object.keys(props)
            .filter(prop => props[prop].persistent)
            .forEach((trackedProp) => {
                if (!props[trackedProp].dispatch) throw new Error('when using persistent you have to use dispatch as well');
                const { statePath } = props[trackedProp];

                // one time dispatch you have to use polymer-variables to change value
                this.dispatch({
                    type: 'LOAD_PERSISTENT',
                    statePath,
                });
            });
    }

    _subscribeCollection(propName, coll, statePath, paramWatchProp, isPersistent, filterWatchProp) {
        if (!paramWatchProp && !filterWatchProp) {
            console.info(`${coll} at ${statePath} won't listen for param updates because there is no param property given`);
            console.info(`${coll} at ${statePath} won't listen for filter updates because there is no filter property given`);

            this.dispatch(
                'subscribe',
                [],
                coll,
                statePath,
                isPersistent,
                {},
            );
        } else if (paramWatchProp && !filterWatchProp) {
            // listen for filter changes
            const paramListenerName = `_changeParam_${statePath}`;
            this[paramListenerName] = (params) => {
                // set timeout here because we don't want to execute this before the actual change has been committed
                // otherwise, we're taking an old value
                setTimeout(() => {
                    this.dispatch(
                        'subscribe',
                        params,
                        coll,
                        statePath,
                        isPersistent,
                        {},
                    );
                });
            };
            this._createPropertyObserver(paramWatchProp, paramListenerName);
        } else if (!paramWatchProp && filterWatchProp) {
            // listen for filter changes
            const filterListenerName = `_changeFilter_${statePath}`;
            this[filterListenerName] = (filter) => {
                // set timeout here because we don't want to execute this before the actual change has been committed
                // otherwise, we're taking an old value
                setTimeout(() => {
                    this.dispatch(
                        'subscribe',
                        [],
                        coll,
                        statePath,
                        isPersistent,
                        filter,
                    );
                });
            };
            this._createPropertyObserver(filterWatchProp, filterListenerName);
        } else if (paramWatchProp && filterWatchProp) {
            const paramFilterListenerName = `_changeParamOrFilter_${statePath}`;
            // set timeout here because we don't want to execute this before the actual change has been committed
            // otherwise, we're taking an old value
            this[paramFilterListenerName] = () => {
                // set timeout here because we don't want to execute this before the actual change has been committed
                // otherwise, we're taking an old value
                setTimeout(() => {
                    this.dispatch(
                        'subscribe',
                        this[paramWatchProp],
                        coll,
                        statePath,
                        isPersistent,
                        this[filterWatchProp],
                    );
                });
            };
            this._createPropertyObserver(paramWatchProp, paramFilterListenerName);
            this._createPropertyObserver(filterWatchProp, paramFilterListenerName);
        }

        // in any case, listen for array changes (concerning the database)
        this._createMethodObserver(`_arrayUpdate("${coll}", ${propName}.*)`);
    }

    _arrayUpdate(collName, diff) { // eslint-disable-line class-methods-use-this
        const propName = diff.path.split('.')[0];

        // this is for removals and additions
        if (diff.path.indexOf('.splices') > -1) {
            diff.value.indexSplices.forEach((id) => {
                id.removed.forEach((obj) => {
                    DatabaseHolder.getDatabase(collName).remove({ _id: obj._id });
                });
                if (id.addedCount === 1) {
                    DatabaseHolder.getDatabase(collName).insert(id.object[id.index]);
                }
                if (id.addedCount > 1) throw new Error('multiple additions in splice are not yet supported');
            });
            return;
        }

        // this should only run if there are deeper level updates in an object within the array from the database
        if (diff.path.indexOf('.') === -1 || diff.path.indexOf('.splices') > -1) return;
        const id = (diff.path.split('.')[1]);
        const dbObj = diff.base[id];
        // will automatically trigger the mongo observer which will then update the data in the store
        DatabaseHolder.getDatabase(collName).update({ _id: dbObj._id }, { $set: dbObj });
    }
};
