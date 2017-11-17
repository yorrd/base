
import { createStore, applyMiddleware } from 'redux';
import PolymerRedux from './polymer-redux.js';
import DatabaseHolder from './database-holder';

const reducer = (state = {}, action) => {
    let object = Object.assign({}, state);
    switch (action.type) {
            // actions which are only called from the observer on the mongo database
            case 'ADDED_DOC': {
                // replace the non-hydrated
                if (!state[action.statePath]) {
                    object[action.statePath] = [action.doc];
                } else {
                    const hydrateIndex = state[action.statePath].findIndex(obj => !obj._id);
                    if (hydrateIndex > -1) {
                        state[action.statePath].splice(hydrateIndex, 1, action.doc);
                        object[action.statePath] = [...state[action.statePath]];
                    } else object[action.statePath] = [...state[action.statePath], action.doc];
                }
                break;
            }
            case 'REMOVED_DOC': {
                if (!state[action.statePath]) {
                    object[action.statePath] = [];
                } else {
                    object[action.statePath] = state[action.statePath].filter(item => item._id !== action.doc._id);
                }
                break;
            }
            case 'UPDATED_DOC': {
                if (!state[action.statePath]) {
                    object[action.statePath] = [];
                } else {
                    object[action.statePath] = state[action.statePath].map((item) => {
                        if (item._id === action.doc._id) { return action.doc; }
                        return item;
                    });
                }
                break;
            }
            case 'RESET': {
                object[action.statePath] = [...action.array];
                break;
            }
            default:
                object = Object.assign({}, state);
    }

    // persistent handling
    if (action.type === 'LOAD_PERSISTENT') {
        object[action.statePath] = action.value;
    }

    // insert polymer tracked variables
    if (action.type === 'UPDATE_POLYMER_VARIABLE') {
        object[action.statePath] = action.value;
    }

    // TODO could / should use combineReducers here
    return Object.assign(object, {
    });
};


const mongoMiddleware = middlewareStore => next => (action) => {
    switch (action.type) {
            case 'INSERT_DOC':
                DatabaseHolder.getDatabase(action.collection).insert(action.doc);
                break;
            case 'REMOVE_DOC':
                DatabaseHolder.getDatabase(action.collection).remove({ _id: action.id });
                break;
            case 'SUBSCRIBE': {
                console.log(action);
                middlewareStore.dispatch({
                    type: 'RESET',
                    collection: action.collection,
                    statePath: action.statePath,
                    array: [],
                });
                const obsHandle = DatabaseHolder.getDatabase(action.collection, action.isPersistent).find({}).observe({
                    added: (doc) => {
                        middlewareStore.dispatch({
                            type: 'ADDED_DOC',
                            statePath: action.statePath,
                            doc,
                        });
                    },
                    changed: (doc) => {
                        middlewareStore.dispatch({
                            type: 'UPDATED_DOC',
                            statePath: action.statePath,
                            doc,
                        });
                    },
                    removed: (doc) => {
                        middlewareStore.dispatch({
                            type: 'REMOVED_DOC',
                            statePath: action.statePath,
                            doc,
                        });
                    },
                });
                DatabaseHolder.setObserverHandle(action.statePath, obsHandle, action.collection, action.parameters);
                break;
            }
            default:
    }

    const returnValue = next(action);

    return returnValue;
};

const persistentMiddleware = middlewareStore => next => (action) => {
    switch (action.type) {
            case 'UPDATE_POLYMER_VARIABLE': {
                const { persistent } = action.persistent;
                if (persistent) { localStorage.setItem(action.statePath, typeof action.value === 'string' ? action.value : JSON.stringify(action.value)); }
                break;
            }
            case 'LOAD_PERSISTENT': {
                const value = localStorage.getItem(action.statePath);
                middlewareStore.dispatch({
                    type: 'LOAD_PERSISTENT_VALUE',
                    statePath: action.statePath,
                    value,
                });
                break;
            }
            default:
    }

    const returnValue = next(action);

    return returnValue;
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || (x => x); // for the debugger in the browser
const store = createStore(reducer, {/* SSR hydration!!! */}, composeEnhancers(applyMiddleware([mongoMiddleware, persistentMiddleware])));
ReduxMixin = PolymerRedux(store);
