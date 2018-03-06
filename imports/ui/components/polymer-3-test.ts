import {
    Element,
    html,
} from "../node_links/@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../node_links/@polymer/polymer/lib/utils/render-status.js";

export class MyApp extends Element {
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
                import("../node_links/@polymer/paper-button/paper-button.js");
            },
            [],
        );
    }
}

customElements.define("polymer-3-test", MyApp);
