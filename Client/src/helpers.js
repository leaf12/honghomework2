export const reInitializeStream = (otherPeer) => {
  return new Promise((resolve) => {
    navigator.mediaDevices.getDisplayMedia().then((stream) => {
      // toggleVideoTrack({ audio, video }, ownVideo);
      replaceStream(otherPeer, stream);
      resolve(stream);
    });
  });
};

// export const toggleVideoTrack = (status, ownVideo) => {
//   ownVideo.srcObject?.getVideoTracks().forEach((track) => {
//     if (track.kind === "video") {
//       !status.video && track.stop();
//     }
//   });
// };

export const replaceStream = (otherPeer, mediaStream) => {
  otherPeer.peerConnection?.getSenders().forEach((sender) => {
    if (sender.track.kind === "audio") {
      if (mediaStream.getAudioTracks().length > 0) {
        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
      }
    }
    if (sender.track.kind === "video") {
      if (mediaStream.getVideoTracks().length > 0) {
        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
      }
    }
  });
};
