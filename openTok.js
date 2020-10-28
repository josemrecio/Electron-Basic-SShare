const OT = require('@opentok/client');

// Set Credentials
const apiKey = '';
const sessionId = '';
const token = '';

if (!apiKey || !sessionId || !token) {
  alert('You need to add your apiKey, sessionId and token to openTok.js');
}

// stats
async function collectPubStats(thePublisher) {
  try {
    const pubStats = await thePublisher.getRtcStatsReport();
    //console.log(`Raw publisher stats:`, pubStats);
    // Print publisher raw stats on the console.
    pubStats.forEach(({ subscriberId, connectionId, rtcStatsReport }) => {
      console.log(`Raw publisher stats for subscriber ${subscriberId} with connectionId ${connectionId}`);
      rtcStatsReport.forEach(console.log);
    });
  } catch(err) {
    console.log(`Raw publisher stats:`, err);
  }
}

async function collectSubStats(theSubscriber) {
  try {
    const subStats = await theSubscriber.getRtcStatsReport();
    console.log(`Raw stats for subscriber to stream ` + theSubscriber.streamId, subStats);
    // Print subscriber raw stats on the console.
    subStats.forEach(console.log);
  } catch(err) {
    console.log(`Error getting raw stats for subscriber to stream ` + theSubscriber.streamId + ` stats:`, err);
    theSubscriber.getStats((err, data) => {
      if (err) {
        console.error(`getStats for subscriber:`, err);
        return;
      }
      console.log(`getStats for subscriber collected ok`);
    });
  }
} 

// Initialize Session
const session = OT.initSession(apiKey, sessionId);

// Set session event listeners
session.on({
  streamCreated: (event) => {
    let subscriber = session.subscribe(event.stream, 'subscriber', (error) => {
      if (error) {
        console.error(`There was an issue subscribing to the stream: ${error}`);
      }
      else {
        setInterval( function() {
          collectSubStats(subscriber);
        }, 5000);
        console.log("subscriber to stream " + subscriber.streamId + " ok");
      }
    });
  },
  streamDestroyed: (event) => {
    console.log(`Stream with name ${event.stream.name} ended because of reason: ${event.reason}`);
  },
  sessionConnected: function () {
    console.log('session connected, start to publish');
    session.publish(publisher).on("streamCreated", function(event) {
      console.log("Publisher started streaming");
      /*setInterval( function() {
          collectPubStats(publisher);
        }, 5000);*/
      console.log("Subscribing to own stream");
      let subscriber = session.subscribe(event.stream, 'subscriber1', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, function (err) {
          if (err) {
            console.error("subscribe:", err);
          }
          else {
            /*setInterval( function() {
              collectSubStats(subscriber);
            }, 5000);*/
            console.log("subscriber to stream " + subscriber.streamId + " ok");
          }
      });
    });
  }
});

let publisher;

// electron capturer
const { desktopCapturer } = require('electron');

async function initSSPublisher() {
  try {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      for (const source of sources) {
        // if (source.name === 'OpenTok Electron Application') { // get my own window
        { // get first source, whatever
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: source.id,
                  minWidth: 1280,
                  maxWidth: 1280,
                  minHeight: 720,
                  maxHeight: 720
                }
              }
            })
            const videoTrack = stream.getVideoTracks()[0];
            publisher = OT.initPublisher({videoSource: videoTrack, audioSource: null}, function(err) {
              if (err) {
                console.error('initSSPublisher() - init publisher error', err);
              }
            });
          } catch (e) {
            handleError(e)
          }
          return
        }
      }
    })
  } catch (e) {
    console.error("Error in initSSPublisher2(): ", e);
  }
}

async function initPublisher() {
  publisher = OT.initPublisher('publisher', function(err) {
    if (err) {
      console.error('init publisher error', err);
    }
  });
}

initSSPublisher();

// Connect to the session
session.connect(token, (error) => {
  // If the connection is successful, initialize a publisher and publish to the session
  if (error) {
    console.error(`There was an error connecting to session: ${error}`);
    publisher.destroy();
    return;
  }
});
