OpenTok.js Electron Basic Sample for Screensharing
=======================

This sample application shows how to connect to an OpenTok session, publish a screen sharing stream, and subscribe to a stream in a basic Electron application.

## Quick started
1. Get values for your OpenTok API key, session ID, and token. You can obtain these values from your TokBox account. Make sure that the token isn't expired.
For testing, you can use a session ID and token generated at your TokBox account page. However, the final application should obtain these values using the [OpenTok server SDKs](https://tokbox.com/developer/sdks/server/). For more information, see the OpenTok developer guides on [session creation](https://tokbox.com/developer/guides/create-session/) and [token creation](https://tokbox.com/developer/guides/create-token/).

2. `$ npm install`

3. `$ npm start`

*Important:* Read the following sections of the of the README file to get started

## Installing Dependencies with `npm`

`$ npm install`

## Getting an OpenTok session ID, token, and API key

An OpenTok session connects different clients letting them share audio-video streams and send
messages. Clients in the same session can include iOS, Android, and web browsers.

**Session ID** -- Each client that connects to the session needs the session ID, which identifies
the session. Think of a session as a room, in which clients meet. Depending on the requirements of
your application, you will either reuse the same session (and session ID) repeatedly or generate
new session IDs for new groups of clients.

*Important*: This demo application assumes that only two clients -- the local Web client and
another client -- will connect in the same OpenTok session. For sample purposes, you can reuse the
same session ID each time two clients connect. However, in a production application, your
server-side code must create a unique session ID for each pair of clients. In other applications,
you may want to connect many clients in one OpenTok session (for instance, a meeting room) and
connect others in another session (another meeting room).

**Token** -- The client also needs a token, which grants them access to the session. Each client is
issued a unique token when they connect to the session. Since the user publishes an audio-video
stream to the session, the token generated must include the publish role (the default). For more
information about tokens, see the OpenTok [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/).

**API key** -- The API key identifies your OpenTok developer account.

## For more information

Check README file for Electron-Basic-Video-Chat sample

