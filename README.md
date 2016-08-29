# Alexa Groupme Bot Message Skill
A simple [AWS Lambda](http://aws.amazon.com/lambda) function that sends messages as a Groupme Bot.

## Setup
- `src` folder contains the code for the AWS Lamda function
- `speechAssets` folder contains the Alexa skill interaction model
- Also need to create your own [Groupme Bot](https://dev.groupme.com/bots)

## Examples
Example user interactions:
### Sending Messages
    User:  "Alexa, ask Groupme to send message."
    Alexa: "What is the message you want to send?"
    User:  "Dinner time"
    Alexa: "Sending Message"
### Reading Messages
    User:  "Alexa, ask Groupme to read the last two messages."
    Alexa: "Reading messages. Andrew said Dinner time. Kimball said I'm hungry."
