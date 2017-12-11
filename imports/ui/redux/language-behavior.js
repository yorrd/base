export default parent => class LanguageBehavior extends parent {
    static get properties() {
        return {
            translations: {
                type: Array,
                statePath: 'translations',
                value: [],
            },
            language: {
                type: String,
                statePath: 'language',
                dispatch: false,
                // observer: '_resubscribe',
            },

            subParams2: {
                type: Array,
                computed: '_computeSubParams(language)',
            },
            l: {
                type: Function,
                computed: '_computeLocalize(translations, language)',
            },
        };
    }

    // _resubscribe(newL, oldL) {
    //     // manual binding
    //     this._subscribeCollection('translations', 'translations', 'translations', 'subParams2', this.persistentCollection);
    // }

    ready() {
        super.ready();

        this._subscribeCollection('translations', 'translations', 'translations', '', this.persistentCollection);
    }

    _computeLocalize() {
        return function y(...args) {
            const key = args[0];
            let value = '...';
            if (this.translations) {
                this.translations.filter((translation) => {
                    if (translation.key === key && translation.language === this.language) {
                        value = translation.value;
                        return true;
                    }
                    return false;
                });
            }
            if (key === '') value = '';
            return value;
        };
    }

    _computeSubParams(lang) {
        return [lang];
    }
};
