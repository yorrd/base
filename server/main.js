import { Meteor } from 'meteor/meteor';
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
