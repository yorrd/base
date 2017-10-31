import { Meteor } from 'meteor/meteor';
// import * as data from '../imports/jsonFile.js';

// const fs = require('fs');

const TestCollection = new Mongo.Collection('mongo-data');
const SpendingsCollection = new Mongo.Collection('spendings');

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.publish('mongo-data');
    Meteor.publish('spendings');

    // read initial data
    // console.log(data);
    // console.log(data.length);
});
