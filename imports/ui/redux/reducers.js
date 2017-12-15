import { createStore, applyMiddleware } from 'redux';
import PolymerRedux from '../node_links/@adornis/polymerredux/polymer-redux';
const reducer = (state = {}, action) => {
    let object = Object.assign({}, state);
    switch (action.type) {
        case 'UPDATE_PAGE': {
            if (!object.route)
                object.route = {};
            object.route.page = action.value;
            break;
        }
        case 'UPDATE_PAGETYPE': {
            if (!object.route)
                object.route = {};
            object.route.pagetype = action.value;
            break;
        }
        case 'UPDATE_MANUAL': {
            if (!object.route)
                object.route = {};
            object.route.manual = action.value;
            break;
        }
        case 'UPDATE_TAIL': {
            if (!object.route)
                object.route = {};
            object.route.tail = action.value;
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
    return Object.assign(object, {});
};
const persistentMiddleware = middlewareStore => next => (action) => {
    switch (action.type) {
        case 'UPDATE_POLYMER_VARIABLE': {
            const { persistent } = action;
            if (persistent) {
                localStorage.setItem(action.statePath, typeof action.value === 'string' ? action.value : JSON.stringify(action.value));
            }
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
export const store = createStore(reducer, {}, composeEnhancers(applyMiddleware(persistentMiddleware)));
export default PolymerRedux(store);
