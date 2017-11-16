import '../../polymer/polymer.js';
import '../../paper-button/paper-button.js';
import { IronCheckedElementBehavior } from '../iron-checked-element-behavior.js';
import { Polymer } from '../../polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }

      :host([invalid]) span {
        color: red;
      }

      #labelText {
        display: inline-block;
        width: 100px;
      }
    </style>

    <input type="checkbox" id="checkbox" on-tap="_onCheckTap">
    <span id="labelText">{{label}}</span>
    <paper-button raised="" on-click="_onClick">validate</paper-button>
`,

  is: 'simple-checkbox',

  behaviors: [
    IronCheckedElementBehavior
  ],

  properties: {
    label: {
      type: String,
      value: 'not validated'
    }
  },

  _onCheckTap: function() {
    this.checked = this.$.checkbox.checked;
  },

  _onClick: function() {
    this.validate();
    this.label = this.invalid ? 'is invalid' : 'is valid';
  }
});
