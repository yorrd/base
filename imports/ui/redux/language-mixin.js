export default parent => class LanguageBehavior extends parent {
    static get properties() {
        return {
            translations: {
                type: Array,
                computed: '_computeTranslations(collReady)',
            },
            language: {
                type: String,
                statePath: 'language',
                dispatch: false,
                // observer: '_resubscribe',
            },
            collReady: {
                type: Boolean,
                statePath: 'subReady.translations',
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

        // this._subscribeCollection('translations', 'translations', 'translations', '', this.persistentCollection);
        if (typeof (this.collReady) === 'undefined' || this.collReady == null) { this.subscribe('translations'); }
    }

    _computeTranslations(ready) {
        if (!ready) return [];
        return this.getCollection('translations').find().fetch();
    }

    _computeLocalize() { // eslint-disable-line class-methods-use-this
        return function y(...args) {
            const key = args[0];
            let value = '...';
            if (key === '') return '';
            if (this.translations) {
                const valueTmp = this.translations.find(translation => translation.key === key && translation.language === this.language);
                if (valueTmp) value = valueTmp.value;
            }
            return value;
        };
    }

    _computeSubParams(lang) { // eslint-disable-line class-methods-use-this
        return [lang];
    }
};
