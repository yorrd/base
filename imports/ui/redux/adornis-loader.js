import { Element } from '../node_links/@polymer/polymer/polymer-element.js';

export class AdornisLoader extends Element { // eslint-disable-line import/prefer-default-export
    static get is() {
        return 'adornis-loader';
    }

    static get template() {
        // eslint-disable-next-line
        return innerHTML = `
            <style>
                @keyframes fadeOut {
                     from {opacity: 1;}
                     to {opacity: 0;}
                }
                @keyframes fadeIn {
                    from {opacity: 0;}
                    to {opacity: 1;}
                }

                #loaderWrapper {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                }
                #loaderWrapper.fadeout {
                    animation-name: fadeOut;
                    animation-duration: 0.5s;
                    pointer-events: none;
                    opacity: 0;
                }
                #loaderWrapper.fadein {
                    animation-name: fadeIn;
                    animation-duration: 0.5s;
                    opacity: 1;
                }

                #loader {
                    width: 10%;
                    height: 10%;
                    margin: auto;
                }
                #loader #img {
                    height: 100%;
                    width: auto;
                }

                *[hidden] {display: none !important;}
            </style>
            <div id="loaderWrapper" style$="background: {{background}}" hidden>
                <div id="loader">
                    <img id="img" src="{{animation}}"></img>
                </div>
            </div>
        `;
    }

    static get properties() {
        return {
            // Enable fade in (default: false)
            fadeIn: {
                type: Boolean,
            },

            // Enable fade out (default: false)
            fadeOut: {
                type: Boolean,
            },

            // Loading Animation (default: paper material spinner)
            animation: {
                type: String,
                value: '/loader.svg',
            },

            // When should animation fade out (if it didnt before) (default: 1000) [0: never]
            timeOut: {
                type: Number,
                value: 1000,
            },

            // Background color (default: white)
            background: {
                type: String,
                value: 'white',
            },
        };
    }

    connectedCallback() {
        super.connectedCallback();

        if (isNaN(+this.timeOut)) { console.error('AdornisLoader::timeOut only accepts numbers!'); return; }
        this.show();
    }

    show() {
        this._fadeIn();
        if (+this.timeOut > 0) { setTimeout(this._fadeOut.bind(this), +this.timeOut); }
    }

    hide() {
        this._fadeOut();
    }

    _fadeIn() {
        if (this.fadeIn) this.$.loaderWrapper.setAttribute('class', 'fadein');
        this.$.loaderWrapper.hidden = false;
    }

    _fadeOut() {
        this.$.loaderWrapper.setAttribute('class', 'fadeout');
        setTimeout(() => { this.$.loaderWrapper.hidden = true; }, this.fadeOut ? 500 : 0);
    }
}

customElements.define(AdornisLoader.is, AdornisLoader);
