import '../../../polymer/polymer.js';
import '../../../iron-pages/iron-pages.js';
import '../../app-location.js';
import '../../app-route.js';
import './flickr-search-page.js';
import './flickr-image-page.js';
import { Polymer } from '../../../polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style>
      a {
        text-decoration: none;
        color: inherit;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
    <app-location route="{{route}}" use-hash-as-path=""></app-location>
    <app-route route="{{route}}" pattern="/:page" data="{{data}}">
    </app-route>
    <app-route route="{{route}}" pattern="/search" tail="{{searchRoute}}">
    </app-route>
    <app-route route="{{route}}" pattern="/image" tail="{{imageRoute}}">
    </app-route>

    <h1><a href="#/search/">Public Domain Image Search</a></h1>

    <iron-pages attr-for-selected="id" selected="{{data.page}}" selected-attribute="selected">
      <flickr-search-page id="search" api-key="{{apiKey}}" route="{{searchRoute}}">
      </flickr-search-page>
      <flickr-image-page id="image" api-key="{{apiKey}}" route="{{imageRoute}}">
      </flickr-image-page>
    </iron-pages>
`,

  is: 'flickr-search-demo',

  properties: {
    apiKey: {
      type: String,
      value: '5358d9830b6865a13d251e5e1acb4c30'
    }
  },

  attached: function() {
    if (this.route.path === '') {
      this.set('route.path', '/search/');
    }
  }
});
