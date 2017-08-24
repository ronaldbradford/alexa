'use strict';

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome friends to Ronalds Trivia');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'I do not have anything to offer');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye');
    }
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
}

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.registerHandlers(handlers);
    alexa.execute();
};
