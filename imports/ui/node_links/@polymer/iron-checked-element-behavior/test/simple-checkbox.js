import '../../polymer/polymer.js';
import { IronCheckedElementBehavior } from '../iron-checked-element-behavior.js';
import { Polymer } from '../../polymer/lib/legacy/polymer-fn.js';

Polymer({

  is: 'simple-checkbox',

  behaviors: [
    IronCheckedElementBehavior
  ]

});
