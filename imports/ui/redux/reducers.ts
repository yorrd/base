import { compose, createStore, applyMiddleware, combineReducers } from "redux";
import PolymerRedux from "../node_links/@adornis/polymerredux/polymer-redux";
import CollectionHolder from "./collection-holder";
import { persistReducer, autoRehydrate, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const reducer = (state = { subReady: {} }, action) => {
    const stateObj = Object.assign({}, state);

    // insert polymer tracked variables
    if (action.type.includes("update/")) {
        console.log(action);
        let storePart = stateObj;
        const parts = action.statePath.split(".");
        parts.slice(0, -1).forEach(key => {
            if (!storePart[key]) storePart[key] = {};
            storePart = storePart[key];
        });
        storePart[parts.slice(-1)] = action.value;
    }

    if (action.type === "SUB_STATUS")
        stateObj.subReady[action.coll] = action.ready;

    // TODO could / should use combineReducers here
    return Object.assign(stateObj, {});
};

const persistConfig = {
    key: "root",
    storage,
    // this should not be loaded because it will set collections ready before they are actually ready
    blacklist: ["subReady", "router", "__test"],
};

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || (x => x); // for the debugger in the browser
const storeCreate = createStore(
    persistReducer(persistConfig, reducer),
    undefined /* SSR rehydration */,
    composeEnhancers(),
);
persistStore(storeCreate);
export const store = storeCreate;
export default PolymerRedux(storeCreate);
