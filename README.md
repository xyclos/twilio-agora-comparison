# Proof of Concept for Agora and Twilio

## Before you start

- make sure you have react native installed and ready to go

## First

- git clone this repo and cd into the directory
- `yarn install`

## Then

- get your Agora app id from the Agora console and set it in `app/config.ts`
- twilio provides a testing tool for generating a twilio token here: https://www.twilio.com/console/video/project/testing-tools
    - you'll need a twilio account first
    - save the token, you'll input it in the UI in the app
    
## Finally

- you should now be able to run the app
- `yarn ios` or `yarn android`
