import { createStore, applyMiddleware } from 'redux';
import PolymerRedux from '../node_links/@adornis/polymerredux/polymer-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
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
        default:
            object = Object.assign({}, state);
    }
    // insert polymer tracked variables
    if (action.type.includes('__UPDATE_')) {
        // const statePath = 
        object[action.statePath] = action.value;
    }
    // TODO could / should use combineReducers here
    return Object.assign(object, {});
};
const persistConfig = {
    key: 'root', storage: storage,
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || (x => x); // for the debugger in the browser
const storeCreate = createStore(persistReducer(persistConfig, reducer), {}, composeEnhancers(applyMiddleware(persistentMiddleware)));
persistStore(storeCreate);
export const store = storeCreate;
export default PolymerRedux(storeCreate);
