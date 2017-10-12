import { Meteor } from 'meteor/meteor';

const TestCollection = new Mongo.Collection('mongo-data');

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.publish('mongo-data');
});
