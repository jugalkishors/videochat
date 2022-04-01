import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';


const App = () => {
  const peer = new Peer({
    host: 'https://eduvideochat.herokuapp.com',
    port: '3000',
    path: '/',
    secure: true
  });

  const [userId, setUserId] = useState('');
  const [currentUserpeerId, setCurrnetPeerId] = useState('');
  const currentUserVideoRef = useRef(null);
  const remoteUserVideoRef = useRef(null);
  const { innerWidth: width, innerHeight: height } = window;
  useEffect(() => {
    console.log('The video Ref is ===>', currentUserVideoRef);

    peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
      setCurrnetPeerId(id);
    });

    //it will run reciever call side... (like whome we called to that person)
    peer.on('call', (call) => {
      var selfStream = { video: { width: 400, height: 400 }};
    var remoteAudioStream = { video: { width: 400, height: 400 }, audio: true };

      navigator.mediaDevices.getUserMedia(selfStream)
        .then(function (mediaStream) {
          console.log(mediaStream);
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });


        navigator.mediaDevices.getUserMedia(remoteAudioStream)
        .then(function (mediaStream) {
          call.answer(mediaStream)
          call.on('stream', function (remoteStream) {
            remoteUserVideoRef.current.srcObject = remoteStream;
            remoteUserVideoRef.current.play();
          });
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    });

    // streamCamVideo();
  }, [])


  const call = (remoteId) => {
    var selfStream = { video: { width: 400, height: 400 }};
    var remoteAudioStream = { video: { width: 400, height: 400 }, audio: true };

    navigator.mediaDevices.getUserMedia(selfStream)
      .then(function (mediaStream) {
        var rat = peer.call(remoteId, mediaStream)
        currentUserVideoRef.current.srcObject = mediaStream
        currentUserVideoRef.current.play();
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });


      navigator.mediaDevices.getUserMedia(remoteAudioStream)
      .then(function (mediaStream) {
        var rat = peer.call(remoteId, mediaStream)
        //recieves video from person whom we called...
        rat.on('stream', (remoteStream) => {
          remoteUserVideoRef.current.srcObject = remoteStream
          remoteUserVideoRef.current.play();
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }

  // const streamCamVideo = () => {
  //   var constraints = { video: { width: 400, height: 400 } };
  //   navigator.mediaDevices.getUserMedia(constraints)
  //     .then(function (mediaStream) {
  //       // var video = document.querySelector("video");
  //       console.log(mediaStream);
  //       currentUserVideoRef.current.srcObject = mediaStream;
  //       currentUserVideoRef.current.play();

  //       remoteUserVideoRef.current.srcObject = mediaStream;
  //       remoteUserVideoRef.current.play();
  //     })
  //     .catch(function (err) {
  //       console.log(err.name + ": " + err.message);
  //     }); // always check for errors at the end.
  // }
  return (
    <div>
      <div style={{ marginLeft: 20 }}>
        <h1>Welcome folks</h1>
        <p>Your video chat id : {currentUserpeerId}</p>

      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
        <input type="text" placeholder="Enter person id" value={userId} onChange={e => setUserId(e.target.value)} />
        <button onClick={() => call(userId)}>
          Call
        </button>
      </div>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <div style={{ flexDirection: 'column', backgroundColor: 'red', display: 'flex', marginRight: 20, alignItems: 'center', justifyContent: 'center', height: 450, width: 420, borderRadius: 20 }}>
          <video ref={currentUserVideoRef} style={{ borderRadius: 15 }} />
          <p>You</p>
        </div>
        <div style={{ flexDirection: 'column', backgroundColor: 'red', display: 'flex', marginLeft: 20, alignItems: 'center', justifyContent: 'center', height: 420, width: 420, borderRadius: 20 }}>
          <video ref={remoteUserVideoRef} style={{ borderRadius: 15 }} />
          <p>Called Person</p>
        </div>
      </div>
    </div>
  )
}

export default App;
