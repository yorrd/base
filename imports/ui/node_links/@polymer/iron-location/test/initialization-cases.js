import '../iron-location.js';
import '../../polymer/polymer.js';
import { Polymer } from '../../polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="ready-container">
  <template>
    <iron-location query="{{val}}"></iron-location>
  </template>
  
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: 'default-value',
  properties: {
    value: {
      type: String,
      notify: true,
      value: 'default-value'
    }
  },
});

Polymer({
  is: 'on-attached',
  properties: {
    val: {
      type: String,
      notify: true,
      value: 'on-attached-default-value'
    }
  },
  attached: function() {
    if (this.val === 'on-attached-default-value') {
      this.val = 'on-attached';
    }
  }
});

Polymer({
  is: 'on-ready',
  properties: {
    val: {
      type: String,
      notify: true,
      value: 'on-ready-default-value'
    }
  },

  ready: function() {
    this.val = 'on-ready';
  }
});

Polymer({
  is: 'on-timeout',
  properties: {
    val: {
      type: String,
      notify: true,
      value: 'on-timeout-default-value'
    }
  },
  attached: function() {
    setTimeout(function() {
      this.val = 'on-timeout';
    }.bind(this), 10);
  }
})
Polymer({
  _template: `
    <default-value value="{{val}}"></default-value>
    <iron-location query="{{val}}"></iron-location>
`,

  is: 'default-before',
  properties: {val: {type: String}}
});Polymer({
  _template: `
    <on-attached val="{{val}}"></on-attached>
    <iron-location query="{{val}}"></iron-location>
`,

  is: 'attached-before',
  properties: {val: {type: String}}
});
Polymer({
  _template: `
    <on-ready val="{{val}}"></on-ready>
    <iron-location query="{{val}}"></iron-location>
`,

  is: 'ready-before',

  properties: {
    val: String
  }
});
Polymer({
  _template: `
    <on-timeout val="{{val}}"></on-timeout>
    <iron-location query="{{val}}"></iron-location>
`,

  is: 'timeout-before',
  properties: {val: {type: String}}
});Polymer({
  _template: `
    <iron-location query="{{val}}"></iron-location>
    <default-value value="{{val}}"></default-value>
`,

  is: 'default-after',
  properties: {val: {type: String}}
});Polymer({
  _template: `
    <iron-location query="{{val}}"></iron-location>
    <on-attached val="{{val}}"></on-attached>
`,

  is: 'attached-after',
  properties: {val: {type: String}}
});
Polymer({
  _template: `
    <iron-location query="{{val}}"></iron-location>
    <on-ready val="{{val}}"></on-ready>
`,

  is: 'ready-after',

  properties: {
    val: String
  }
});
Polymer({
  _template: `
    <iron-location query="{{val}}"></iron-location>
    <on-timeout val="{{val}}"></on-timeout>
`,

  is: 'timeout-after',
  properties: {val: {type: String}}
});Polymer({
  _template: `
    <iron-location query="{{val}}">
      <default-value value="{{val}}"></default-value>
    </iron-location>
`,

  is: 'default-below',
  properties: {val: {type: String}}
});Polymer({
  _template: `
    <iron-location query="{{val}}">
      <on-attached val="{{val}}"></on-attached>
    </iron-location>
`,

  is: 'attached-below',
  properties: {val: {type: String}}
});
Polymer({
  _template: `
    <iron-location query="{{val}}">
      <on-ready val="{{val}}"></on-ready>
    </iron-location>
`,

  is: 'ready-below',

  properties: {
    val: String
  }
});
Polymer({
  _template: `
    <iron-location query="{{val}}">
      <on-timeout val="{{val}}"></on-timeout>
    </iron-location>
`,

  is: 'timeout-below',
  properties: {val: {type: String}}
});Polymer({
  _template: `
    <default-value value="{{val}}">
      <iron-location query="{{val}}"></iron-location>
    </default-value>
`,

  is: 'default-above',
  properties: {val: {type: String}}
});Polymer({
  _template: `
    <on-attached val="{{val}}">
      <iron-location query="{{val}}">
      </iron-location>
    </on-attached>
`,

  is: 'attached-above',
  properties: {val: {type: String}}
});
Polymer({
  _template: `
    <on-ready val="{{val}}">
      <iron-location query="{{val}}"></iron-location>
    </on-ready>
`,

  is: 'ready-above',

  properties: {
    val: String
  }
});
Polymer({
  _template: `
    <on-timeout val="{{val}}">
      <iron-location query="{{val}}"></iron-location>
    </on-timeout>
`,

  is: 'timeout-above',
  properties: {val: {type: String}}
});
Polymer({
  _template: `
    <iron-location query="{{val}}"></iron-location>
`,

  is: 'default-container',
  properties: {val: {type: String, value: 'default-container-val'}}
});
Polymer({
  _template: `
    <iron-location query="{{val}}"></iron-location>
`,

  is: 'attached-container',
  properties: {val: {type: String, value: 'container-attached-default-val'}},

  attached: function() {
    if (this.val === 'container-attached-default-val') {
      this.val = 'attached-container-val';
    }
  }
});
Polymer({
  _template: `
    <on-ready val="{{val}}">
      <iron-location query="{{val}}"></iron-location>
    </on-ready>
`,

  is: 'ready-above',

  properties: {
    val: String
  },

  ready: function() {
    this.val = 'ready-container-val';
  }
});
Polymer({
  _template: `
    <iron-location query="{{val}}"></iron-location>
`,

  is: 'timeout-container',

  properties: {
    val: {
      type: String,
      notify: true
    }
  },

  attached: function() {
    setTimeout(function() {
      this.val = 'on-timeout';
    }.bind(this), 10);
  }
});
