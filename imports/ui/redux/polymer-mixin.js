import ReduxMixin from './reducers.js';
import DatabaseHolder from './database-holder';

export default parent => class ReduxComponent extends ReduxMixin(parent) {
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
            subscribe(params, collection, statePath) {
                if (!params || !collection || !statePath) throw new Error('no params, collection or statePath given');
                return {
                    type: 'SUBSCRIBE',
                    parameters: params,
                    collection,
                    statePath,
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
                    });
                };

                // handle persistency
                const { persistent } = props[trackedProp];
                if (persistent) { localStorage.setItem(statePath, typeof newVal === 'string' ? newVal : JSON.stringify(newVal)); }

                this._createPropertyObserver(trackedProp, listenerName);
            });

        // if there is no dispatch but a statepath, don't allow a value, would be overridden instantly anyways
        Object.keys(props)
            .filter(prop => !props[prop].dispatch && props[prop].statePath)
            .forEach((trackedProp) => {
                if (props[trackedProp].value) throw new Error(`there should be no value on the dispatch field ${trackedProp}`);
            });

        Object.keys(props)
            .filter(prop => props[prop].persistent)
            .forEach((trackedProp) => {
                if (!props[trackedProp].dispatch) throw new Error('when using persistent you have to use dispatch as well');
                const { statePath } = props[trackedProp];
                const value = localStorage.getItem(statePath);

                // one time dispatch you have to use polymer-variables to change value
                this.dispatch({
                    type: 'LOAD_PERSISTENT',
                    statePath,
                    value,
                });
            });
    }

    _subscribeCollection(propName, coll, statePath, paramWatchProp) {
        let parameters = this[paramWatchProp];
        if (!parameters) parameters = [];

        this.dispatch(
            'subscribe',
            parameters,
            coll,
            statePath,
        );
        this._createMethodObserver(`_arrayUpdate("${coll}", ${propName}.*)`);

        // listen for filter changes
        const filterListenerName = `_changeFilter_${statePath}`;
        this[filterListenerName] = (params) => {
            console.log(this, params);
            this.dispatch(
                'subscribe',
                params,
                coll,
                statePath,
            );
        };
        this._createPropertyObserver(paramWatchProp, filterListenerName);
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

    // convenience methods

    div(a, b) { // eslint-disable-line class-methods-use-this
        return +a / +b;
    }

    mul(...args) { // eslint-disable-line class-methods-use-this
        return args.reduce((prod, curr) => prod * +curr, 1);
    }

    sum(...args) { // eslint-disable-line class-methods-use-this
        return args.reduce((sum, curr) => sum + +curr, 0);
    }

    sub(...args) { // eslint-disable-line class-methods-use-this
        return args.slice(1).reduce((diff, curr) => diff - +curr, args[0]);
    }

    f(val, digits = 2, unit = '') { // eslint-disable-line class-methods-use-this
        const number = `${(+val).toFixed(digits)}`.replace('.', ',');
        const numArr = number.split(',');
        return `${numArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${numArr[1]} ${unit}`;
    }

    date(date) { // eslint-disable-line class-methods-use-this
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        const d = new Date(date);
        return `${d.getDay()}. ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }

    print(...x) { // eslint-disable-line class-methods-use-this
        console.log(x);
    }
};
