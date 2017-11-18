
const LanguageBehavior = {

    properties: {
        translations: {
            type: Array,
            statePath: 'translations',
            value: [],
        },
        language: {
            type: String,
            statePath: 'language',
            dispatch: false,
            observer: '_resubscribe',
        },

        subParams2: {
            type: Array,
            computed: '_computeSubParams(language)',
        },
        l: {
            type: Function,
            computed: '_computeLocalize(translations)',
        },
    },

    _resubscribe() {
        // manual binding
        this._subscribeCollection('translations', 'translations', 'translations', 'subParams2', this.persistentCollection);
    },

    _computeLocalize() {
        return function y(...args) {
            const key = args[0];
            let value = '';
            if (this.translations) {
                this.translations.filter((translation) => {
                    if (translation.key === key) {
                        value = translation.value;
                        return true;
                    }
                    return false;
                });
            }
            return value;
        };
    },

    _computeSubParams(lang) {
        return [lang];
    },
};
export default LanguageBehavior;
