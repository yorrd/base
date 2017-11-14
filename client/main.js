
console.log('asdf');
import { Element as PolymerElement }
    from '../node_modules/@polymer/polymer/polymer-element.js';
import '../imports/startup/client/index.js';

Meteor.startup(() => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((err) => {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    }
});
