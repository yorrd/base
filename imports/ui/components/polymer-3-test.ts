import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";

export class MyApp extends PolymerElement {
    static get template() {
        return html`

            <paper-button>test</paper-button>

        `;
    }

    static get properties() {
        return {};
    }

    public connectedCallback() {
        super.connectedCallback();
        afterNextRender(
            this,
            () => {
                import("@polymer/paper-button/paper-button.js");
            },
            [],
        );
    }
}

customElements.define("polymer-3-test", MyApp);
