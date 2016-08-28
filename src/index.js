/**
 * Author: Andrew Tang
 * This is an AlexaSkill that sends messages as a Groupme bot.
 * This project was forked off of the HistoryBuff sample project
 * from Amazon at (https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/historyBuff)
 */


/**
 * App ID for the skill
 */
var APP_ID = 'YOUR ALEXA SKILL APP ID';

var https = require('https');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * GroupmeSkill is a child of AlexaSkill.
 *
 */
var GroupmeSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
GroupmeSkill.prototype = Object.create(AlexaSkill.prototype);
GroupmeSkill.prototype.constructor = GroupmeSkill;

GroupmeSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("GroupmeSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

GroupmeSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("GroupmeSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

GroupmeSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

GroupmeSkill.prototype.intentHandlers = {

    "StartMessageIntent": function(intent, session, response) {
        handleStartMessageRequest(intent, session, response);
    },

    "SendMessageIntent": function(intent, session, response) {
        handleSendMessageRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = 'With Groupme, you can send messages as a Groupme bot.';
        var repromptText = "What message do you want?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

/**
 * Prompts the user for the message content for the bot to send.
 */
function handleStartMessageRequest(intent, session, response) {
    var cardTitle = "Groupme Bot Message";

    var speechOutput = {
        speech: "<speak> What is the message you want to send? </speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: 'You can make the Groupme bot post a message',
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    response.ask(speechOutput, repromptOutput);
}

/**
 * Listens to message and sends message as bot
 */
function handleSendMessageRequest(intent, session, response) {
    var message = intent.slots.message;
    var cardTitle = "Groupme Bot Message";

    var speechOutput = {
        speech: "<speak> Sending message </speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: 'You can make the Groupme bot post a message, what should the message say?',
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    var post_options = {
        host: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    var req = https.request(post_options, function(res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body: ' + body);
            response.tellWithCard(speechOutput, cardTitle, message.value);
        });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    // write data to request body
    req.write('{"bot_id": "YOUR GROUPME BOT ID", "text": "' + message.value + '"}');
    req.end();
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Groupme Skill.
    var skill = new GroupmeSkill();
    skill.execute(event, context);
};

