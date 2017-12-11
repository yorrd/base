
// Expose globals
import { get as polymerGetPath } from "../../@polymer/polymer/lib/utils/path";

/**
 * Polymer Redux
 *
 * Creates a Class mixin for decorating Elements with a given Redux store.
 *
 * @polymerMixin
 *
 * @param {Object} store Redux store.
 * @return {Function} Class mixin.
 */
export default function PolymerRedux(store) {
    if (!store) {
        throw new TypeError("PolymerRedux: expecting a redux store.");
    } else if (!["getState", "dispatch", "subscribe"].every((k) => typeof store[k] === "function")) {
        throw new TypeError("PolymerRedux: invalid store object.");
    }

    const subscribers = new Map();

    /**
     * Binds element's properties to state changes from the Redux store.
     *
     * @example
     *     const update = bind(el, props) // set bindings
     *     update(state) // manual update
     *
     * @private
     * @param {HTMLElement} element
     * @param {Object} properties
     * @return {Function} Update function.
     */
    const bind = (element, properties) => {
        const bindings = Object.keys(properties)
        .filter((name) => {
            const property = properties[name];
            if (Object.prototype.hasOwnProperty.call(property, "statePath")) {
                if (!property.readOnly && property.notify) {
                    // tslint:disable-next-line
                    console.warn(`PolymerRedux: <${element.constructor.is}>.${name} has "notify" enabled, wo-way bindings goes against Redux's paradigm`);
                }
                return true;
            }
            return false;
        });

        /**
         * Updates an element's properties with the given state.
         *
         * @private
         * @param {Object} state
         */
        const update = (state) => {
            let propertiesChanged = false;
            bindings.forEach((name) => { // Perhaps .reduce() to a boolean?
                const { statePath } = properties[name];
                const value = (typeof statePath === "function") ?
                statePath.call(element, state) :
                polymerGetPath(state, statePath);

                const changed = element._setPendingPropertyOrPath(name, value, true);
                propertiesChanged = propertiesChanged || changed;
            });
            if (propertiesChanged) {
                element._invalidateProperties();
            }
        };

        // Redux listener
        const unsubscribe = store.subscribe(() => {
            const detail = store.getState();
            update(detail);

            element.dispatchEvent(new CustomEvent("state-changed", { detail }));
        });

        subscribers.set(element, unsubscribe);
        update(store.getState());

        return update;
    };

    /**
     * Unbinds an element from state changes in the Redux store.
     *
     * @private
     * @param {HTMLElement} element
     */
    const unbind = (element) => {
        const off = subscribers.get(element);
        if (typeof off === "function") {
            off();
        }
    };

    /**
     * Merges a property's object value using the defaults way.
     *
     * @private
     * @param {Object} what Initial prototype
     * @param {String} which Property to collect.
     * @return {Object} the collected values
     */
    const collect = (what, which) => {
        let res = {};
        while (what) {
            res = Object.assign({}, what[which], res); // Respect prototype priority
            what = Object.getPrototypeOf(what);
        }
        return res;
    };

    /**
     * ReduxMixin
     *
     * @example
     *     const ReduxMixin = PolymerRedux(store)
     *     class Foo extends ReduxMixin(Polymer.Element) { }
     *
     * @polymerMixinClass
     *
     */
    return (parent: Element) => class ReduxMixin extends parent {
        constructor() {
            super();

            // Collect the action creators first as property changes trigger
            // dispatches from observers, see #65, #66, #67
            const actions = collect(this.constructor, "actions");
            Object.defineProperty(this, "_reduxActions", {
                configurable: true,
                value: actions,
            });
        }

        public connectedCallback() {
            super.connectedCallback();
            const properties = collect(this.constructor, "properties");
            bind(this, properties);
        }

        public disconnectedCallback() {
            super.disconnectedCallback();
            unbind(this);
        }

        /**
         * Dispatches an action to the Redux store.
         *
         * @example
         *     element.dispatch({ type: 'ACTION' })
         *
         * @example
         *     element.dispatch('actionCreator', 'foo', 'bar')
         *
         * @example
         *     element.dispatch((dispatch) => {
         *         dispatch({ type: 'MIDDLEWARE'})
         *     })
         *
         * @param  {...*} args
         * @return {Object} The action.
         */
        public dispatch(...args) {
            const actions = this._reduxActions;

            // Action creator
            let [action] = args;
            if (typeof action === "string") {
                if (typeof actions[action] !== "function") {
                    throw new TypeError(`PolymerRedux: <${this.constructor.is}> invalid action creator "${action}"`);
                }
                action = actions[action](...args.slice(1));
            }

            // Proxy async dispatch
            if (typeof action === "function") {
                const originalAction = action;
                action = (...actionArgs) => {
                    // Replace redux dispatch
                    actionArgs.splice(0, 1, (...newActionArgs) => this.dispatch(...newActionArgs));
                    return originalAction(...actionArgs);
                };

                // Copy props from the original action to the proxy.
                // see https://github.com/tur-nr/polymer-redux/issues/98
                Object.keys(originalAction).forEach((prop) => {
                    action[prop] = originalAction[prop];
                });
            }

            return store.dispatch(action);
        }

        /**
         * Gets the current state in the Redux store.
         *
         * @return {*}
         */
        public getState() {
            return store.getState();
        }
    };
}