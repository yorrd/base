import ReduxMixin from './reducers.js';

export default parent => class AdornisMixin extends ReduxMixin(parent) {
    constructor() {
        super();

        const props = this.constructor.properties;

        // get automatically managed polymer properties
        Object.keys(props)
            .filter(prop => {
                const hasStatePath = !!props[prop].statePath;
                const doesntHaveComputed = !props[prop].computed;
                if(hasStatePath && !doesntHaveComputed) throw new Error('cant have computed on a statePath-bound variable ' + prop + ' atm. Coming soon, see the issue on gogs');
                return hasStatePath && doesntHaveComputed;
            })
            .forEach((trackedProp) => {
                const { statePath } = props[trackedProp];
                if (typeof statePath === 'function') return;
                const listenerName = `_trackedPropChanged__${statePath.replace('.', '_')}`;
                this[listenerName] = (newVal) => {
                    if (!newVal) return;
                    this.dispatch({
                        type: `update/${statePath}`,
                        statePath,
                        value: newVal,
                    });
                };

                // this._createPropertyObserver(trackedProp, listenerName);
                this._createMethodObserver(`${listenerName}(${trackedProp}, ${trackedProp}.*)`);
            });
    }

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

    num(val, digits = Infinity) { // eslint-disable-line class-methods-use-this
        return +(+val).toFixed(digits);
    }

    date(date) { // eslint-disable-line class-methods-use-this
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        const d = new Date(date);
        return `${d.getDay()}. ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }

    log(...x) { // eslint-disable-line class-methods-use-this
        setTimeout(() => {
            if (this.getState().__debug) { console.log(`${Date.now()}:: ${x}`); }
        });
    }

    print(x) { // eslint-disable-line class-methods-use-this
        return JSON.stringify(x);
    }

    string(...args) { // eslint-disable-line class-methods-use-this
        return args.join('');
    }

    bool(arg) {
        console.log(arg, !!arg);
        return !!arg;
    }
};
