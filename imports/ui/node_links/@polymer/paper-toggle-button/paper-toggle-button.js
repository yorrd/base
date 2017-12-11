import '../polymer/polymer.js';
import '../iron-flex-layout/iron-flex-layout.js';
import '../paper-styles/color.js';
import '../paper-styles/default-theme.js';
import { PaperCheckedElementBehavior } from '../paper-behaviors/paper-checked-element-behavior.js';
import { Polymer } from '../polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '../polymer/lib/utils/render-status.js';
import { setTouchAction } from '../polymer/lib/utils/gestures.js';
import { PaperRippleBehavior } from '../paper-behaviors/paper-ripple-behavior.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="paper-toggle-button">
  <template strip-whitespace="">

    <style>
      :host {
        display: inline-block;
        @apply --layout-horizontal;
        @apply --layout-center;
        @apply --paper-font-common-base;
      }

      :host([disabled]) {
        pointer-events: none;
      }

      :host(:focus) {
        outline:none;
      }

      .toggle-bar {
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: 8px;
        pointer-events: none;
        opacity: 0.4;
        transition: background-color linear .08s;
        background-color: var(--paper-toggle-button-unchecked-bar-color, #000000);

        @apply --paper-toggle-button-unchecked-bar;
      }

      .toggle-button {
        position: absolute;
        top: -3px;
        left: 0;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
        transition: -webkit-transform linear .08s, background-color linear .08s;
        transition: transform linear .08s, background-color linear .08s;
        will-change: transform;
        background-color: var(--paper-toggle-button-unchecked-button-color, var(--paper-grey-50));

        @apply --paper-toggle-button-unchecked-button;
      }

      .toggle-button.dragging {
        -webkit-transition: none;
        transition: none;
      }

      :host([checked]:not([disabled])) .toggle-bar {
        opacity: 0.5;
        background-color: var(--paper-toggle-button-checked-bar-color, var(--primary-color));

        @apply --paper-toggle-button-checked-bar;
      }

      :host([disabled]) .toggle-bar {
        background-color: #000;
        opacity: 0.12;
      }

      :host([checked]) .toggle-button {
        -webkit-transform: translate(16px, 0);
        transform: translate(16px, 0);
      }

      :host([checked]:not([disabled])) .toggle-button {
        background-color: var(--paper-toggle-button-checked-button-color, var(--primary-color));

        @apply --paper-toggle-button-checked-button;
      }

      :host([disabled]) .toggle-button {
        background-color: #bdbdbd;
        opacity: 1;
      }

      .toggle-ink {
        position: absolute;
        top: -14px;
        left: -14px;
        right: auto;
        bottom: auto;
        width: 48px;
        height: 48px;
        opacity: 0.5;
        pointer-events: none;
        color: var(--paper-toggle-button-unchecked-ink-color, var(--primary-text-color));

        @apply --paper-toggle-button-unchecked-ink;
      }

      :host([checked]) .toggle-ink {
        color: var(--paper-toggle-button-checked-ink-color, var(--primary-color));

        @apply --paper-toggle-button-checked-ink;
      }

      .toggle-container {
        display: inline-block;
        position: relative;
        width: 36px;
        height: 14px;
        /* The toggle button has an absolute position of -3px; The extra 1px
        /* accounts for the toggle button shadow box. */
        margin: 4px 1px;
      }

      .toggle-label {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        padding-left: var(--paper-toggle-button-label-spacing, 8px);
        pointer-events: none;
        color: var(--paper-toggle-button-label-color, var(--primary-text-color));
      }

      /* invalid state */
      :host([invalid]) .toggle-bar {
        background-color: var(--paper-toggle-button-invalid-bar-color, var(--error-color));
      }

      :host([invalid]) .toggle-button {
        background-color: var(--paper-toggle-button-invalid-button-color, var(--error-color));
      }

      :host([invalid]) .toggle-ink {
        color: var(--paper-toggle-button-invalid-ink-color, var(--error-color));
      }
    </style>

    <div class="toggle-container">
      <div id="toggleBar" class="toggle-bar"></div>
      <div id="toggleButton" class="toggle-button"></div>
    </div>

    <div class="toggle-label"><slot></slot></div>

  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: 'paper-toggle-button',

  behaviors: [
    PaperCheckedElementBehavior
  ],

  hostAttributes: {
    role: 'button',
    'aria-pressed': 'false',
    tabindex: 0
  },

  properties: {
    /**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */
    /**
     * Fired when the checked state changes.
     *
     * @event iron-change
     */
  },

  listeners: {
    track: '_ontrack'
  },

  attached: function() {
    afterNextRender(this, function() {
      setTouchAction(this, 'pan-y');
    });
  },

  _ontrack: function(event) {
    var track = event.detail;
    if (track.state === 'start') {
      this._trackStart(track);
    } else if (track.state === 'track') {
      this._trackMove(track);
    } else if (track.state === 'end') {
      this._trackEnd(track);
    }
  },

  _trackStart: function(track) {
    this._width = this.$.toggleBar.offsetWidth / 2;
    /*
     * keep an track-only check state to keep the dragging behavior smooth
     * while toggling activations
     */
    this._trackChecked = this.checked;
    this.$.toggleButton.classList.add('dragging');
  },

  _trackMove: function(track) {
    var dx = track.dx;
    this._x = Math.min(this._width,
        Math.max(0, this._trackChecked ? this._width + dx : dx));
    this.translate3d(this._x + 'px', 0, 0, this.$.toggleButton);
    this._userActivate(this._x > (this._width / 2));
  },

  _trackEnd: function(track) {
    this.$.toggleButton.classList.remove('dragging');
    this.transform('', this.$.toggleButton);
  },

  // customize the element's ripple
  _createRipple: function() {
    this._rippleContainer = this.$.toggleButton;
    var ripple = PaperRippleBehavior._createRipple();
    ripple.id = 'ink';
    ripple.setAttribute('recenters', '');
    ripple.classList.add('circle', 'toggle-ink');
    return ripple;
  }

});
