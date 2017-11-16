import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';

require('@skatejs/ssr/register');
const render = require('@skatejs/ssr');


const TestCollection = new Mongo.Collection('mongo-data');
const SpendingsCollection = new Mongo.Collection('spendings');
const MieterDaten = new Mongo.Collection('mieterdaten');

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.publish('mongo-data', filtered => TestCollection.find(filtered ? { name: 'xxx' } : {}));
    Meteor.publish('spendings', () => SpendingsCollection.find());
    Meteor.publish('mieterdaten', () => MieterDaten.find());
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
});

class Hello extends HTMLElement {
    static get is() { return 'x-hello'; }
    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = '<span>Hello!</span>';
    }
}
customElements.define('x-hello', Hello);

// mit Hello funktionierts, jetzt polymer...
// import { MyApp } from '../imports/ui/components/polymer-3-test.js';
//
// render(new MyApp(), true).then(console.log);

onPageLoad(async (sink) => {
    sink.appendToBody('<div id="app"></div>afaf<input type="text"/>');
    const skateOut = await render(new Hello(), true);
    sink.appendToBody(skateOut);
});
