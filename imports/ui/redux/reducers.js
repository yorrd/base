import { createStore } from 'redux';
import PolymerRedux from '../node_links/@adornis/polymerredux/polymer-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const reducer = (state = {}, action) => {
    const newState = Object.assign({}, state);
    // insert polymer tracked variables
    if (action.type.includes('update/')) {
        let storePart = newState;
        const parts = action.statePath.split('.');
        parts.slice(0, -1).forEach(key => {
            if (!storePart[key])
                storePart[key] = {};
            storePart = storePart[key];
        });
        storePart[parts.slice(-1)] = action.value;
    }
    // TODO could / should use combineReducers here
    return Object.assign(newState, {});
};
const persistConfig = {
    key: 'root',
    storage,
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || (x => x); // for the debugger in the browser
const storeCreate = createStore(persistReducer(persistConfig, reducer), {}, composeEnhancers());
persistStore(storeCreate);
export const store = storeCreate;
export default PolymerRedux(storeCreate);
// new version of the persistent data? --> https://github.com/rt2zz/redux-persist/blob/master/docs/migrations.md
