import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';

// import { parseHtml, handleTags } from 'meteor/mwc:synthesis-compiler';

const render = require('@skatejs/ssr');

// import * as data from '../imports/jsonFile.js';

// const fs = require('fs');

const TestCollection = new Mongo.Collection('mongo-data');
const SpendingsCollection = new Mongo.Collection('spendings');
const MieterDaten = new Mongo.Collection('mieterdaten');

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.publish('mongo-data', filtered => TestCollection.find(filtered ? { name: 'xxx' } : {}));
    Meteor.publish('spendings', () => SpendingsCollection.find());
    Meteor.publish('mieterdaten', () => {
        console.log('asdf');
        return MieterDaten.find();
    });
    TestCollection.allow({
        insert: () => true,
        update: () => true,
        remove: () => true,
    });
    SpendingsCollection.allow({
        insert: () => true,
        update: () => true,
        remove: () => true,
    });
    MieterDaten.allow({
        insert: () => true,
        update: () => true,
        remove: () => true,
    });

    // read initial data
    // console.log(data);
    // console.log(data.length);
});

class Hello extends HTMLElement {
    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = '<span>Hello!</span>';
    }
}
render(new Hello(), true);

onPageLoad((sink) => {
    // import('../imports/ui/components/test-layout.js').then(layout => {
    //     render(new layout()).then(console.log);
    // });
    sink.appendToBody('<div id="app"></div>afaf');
    // sink.appendToBody('<test-layout></test-layout><dom-module id="test-layout">\n  <template>\n    <style is="custom-style" include="iron-flex iron-flex-alignment adornis"></style>\n    <style>:root{font-family:sans-serif}.main{@apply(--layout-horizontal);@apply(--layout-center-center);}app-header{background-color:var(--primary-color);color:#fff;}app-header paper-icon-button{--paper-icon-button-ink-color:white;}.print-break{page-break-after:always;page-break-inside:avoid;}paper-input-container input{@apply(--paper-input-container-shared-input-style);}hr{margin:3em 0;}</style>\n\n    \n\n    <app-location route="{{route}}"></app-location>\n\n    <app-route route="{{route}}" pattern="/:page" data="{{routeData}}"></app-route>\n\n    \n\n    <app-header-layout class="fit layout vertical">\n\n        <mongo-repeat id="mdata" collection="mongo-data" sub-params="{{subParams}}" debounce-interval="100">\n            <template>\n                <paper-card>{{item.name}}</paper-card>\n            </template>\n        </mongo-repeat>\n\n        <paper-toggle-button on-checked-changed="_toggleFilter"></paper-toggle-button>\n        <paper-button on-tap="_add">add</paper-button>\n\n        <hr>\n\n        <paper-button on-click="handleUpdateMessage">Insert Hallo Welt</paper-button>\n        <mongo-data id="mongoData" filter="{{filter}}"></mongo-data>\n\n        <hr>\n\n        \n                    \n                    \n                \n                \n\n    </app-header-layout>\n\n  </template>\n</dom-module>\n\n\n');
});
