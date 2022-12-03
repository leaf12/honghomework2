import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOnIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { Chip, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Peer } from "peerjs";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuid4 } from "uuid";
import { SocketContext } from "../../socket-context";
import {
  onRoomIsReady,
  onScreenSharing,
} from "../../socket-context/EventEmitters";
import { UserDetailsContext } from "../../user-context";
import "./VideoArea.css";
import { replaceStream } from "../../helpers";
import { config } from "../../config";
import {getChart} from "../../socket-context/EventListeners";

const myPeer = new Peer(uuid4(), {
  host: config.serverHostName,
  secure: false,
  port: config.serverPort,
  path: "peerjs",
  config: {
    iceServers: config.iceServers,
  },
});

let otherPeer = null;

let streamAlreadyRequested = false;

export const VideoArea = memo(({ roomID, exitRoom }) => {
  const [ownUserInfo] = useContext(UserDetailsContext);
 
  const { otherUserInfo, otherUserPeerID, isOtherUserSharingScreen } =
    useContext(SocketContext);
  const ownVideoRef = useRef();
  const incomingVideoRef = useRef();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenSharingInProgress, setScreenSharingInProgress] = useState(false);
  const [ownVideoStream, setOwnVideoStream] = useState();
  const [incomingVideoStream, setIncomingVideoStream] = useState();

  const toggleAudio = useCallback(() => {
    ownVideoStream.getAudioTracks().forEach((audioTrack) => {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    });
  }, [ownVideoStream]);

  const toggleVideo = useCallback(() => {
    ownVideoStream.getVideoTracks().forEach((videoTrack) => {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    });
  }, [ownVideoStream]);

  const onCallEndClick = useCallback(() => {
    setOpenConfirmationDialog(true);
  }, []);

  const handleCancelDialog = useCallback(() => {
    setOpenConfirmationDialog(false);
  }, []);

  const handleOkDialog = useCallback(() => {
    setOpenConfirmationDialog(false);
    ownVideoStream.getTracks().forEach((track) => track.stop());
    setOwnVideoStream(null);
    myPeer.disconnect();
    ownVideoRef.current.srcObject = null;
    exitRoom();
  }, [exitRoom, ownVideoStream]);
  // const { messages } = useContext(SocketContext);
  const handleOkDialogEmail = useCallback(() => {
    // console.log();
    
    // 发送邮件2
    const massagess={getChart}.getChart();
    // console.log(massagess);
    let htmltext='';
    massagess.map((item)=>(
      htmltext+="<div>"+item['userName']+":"+item["message"]+"</div>"
    ))
    // "http://localhost:2345/test?email="+[ownUserInfo][0]['email']+"&htmltext="+htmltext
    // "http://localhost:3001/sendemail/"+window.encodeURIComponent([ownUserInfo][0]['email'])+"/"+window.encodeURIComponent(htmltext)
    fetch("http://localhost:3001/sendemail/"+window.encodeURIComponent([ownUserInfo][0]['email'])+"/"+window.encodeURIComponent(htmltext))
        .then(res => res.json())
        .then(data => {
            console.log(data)
            this.setState({
                banners:data.europe.list
            })
        })


    setOpenConfirmationDialog(false);
    ownVideoStream.getTracks().forEach((track) => track.stop());
    setOwnVideoStream(null);
    myPeer.disconnect();
    ownVideoRef.current.srcObject = null;
    exitRoom();
  }, [exitRoom, ownVideoStream]);

  const stopScreenSharing = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        replaceStream(otherPeer, stream);
        onScreenSharing(roomID, false);
      });
  }, [roomID]);

  const startScreenSharing = useCallback(() => {
    navigator.mediaDevices.getDisplayMedia().then((stream) => {
      replaceStream(otherPeer, stream);
      onScreenSharing(roomID, true);
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        stopScreenSharing();
      });
    });
  }, [roomID, stopScreenSharing]);

  const toggleScreenSharing = useCallback(() => {
    if (screenSharingInProgress) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
  }, [screenSharingInProgress, startScreenSharing, stopScreenSharing]);

  useEffect(() => {
    if (roomID && ownUserInfo.userName && !streamAlreadyRequested) {
      streamAlreadyRequested = true;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then((ownStream) => {
          setAudioEnabled(
            !ownStream
              .getAudioTracks()
              .some((audioTrack) => !audioTrack.enabled)
          );
          setVideoEnabled(
            !ownStream
              .getVideoTracks()
              .some((videoTrack) => !videoTrack.enabled)
          );
          setOwnVideoStream(ownStream);
          ownVideoRef.current.srcObject = ownStream;
          myPeer.on("call", (call) => {
            call.answer(ownStream);
            call.on("stream", (otherVideoStream) => {
              setIncomingVideoStream(otherVideoStream);
            });
            otherPeer = call;
          });

          onRoomIsReady(roomID, myPeer.id, ownUserInfo);
        })
        .catch((error) => {
          alert("Please allow access to video and audio to continue");
        });
    }
  }, [ownUserInfo, roomID]);

  useEffect(() => {
    if (otherUserInfo.userName && otherUserPeerID && ownVideoStream) {
      const call = myPeer.call(otherUserPeerID, ownVideoStream, otherUserInfo);

      call.on("stream", (otherVideoStream) => {
        setIncomingVideoStream(otherVideoStream);
      });

      call.on("close", () => {
        setIncomingVideoStream(null);
        if (incomingVideoRef.current) incomingVideoRef.current.srcObject = null;
      });

      otherPeer = call;
    } else {
      setIncomingVideoStream(null);
      if (incomingVideoRef.current) incomingVideoRef.current.srcObject = null;
    }
  }, [otherUserInfo, otherUserPeerID, ownVideoStream]);

  useEffect(() => {
    if (incomingVideoStream !== null) {
      incomingVideoRef.current.srcObject = incomingVideoStream;
    }
  }, [incomingVideoStream]);

  useEffect(() => {
    setScreenSharingInProgress(isOtherUserSharingScreen);
  }, [isOtherUserSharingScreen]);

  return (
    <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <div
        className={`videos${
          screenSharingInProgress ? " flex-direction-column" : ""
        }`}
      >
        <div
          className={
            screenSharingInProgress
              ? "top-row"
              : incomingVideoStream !== null
              ? "video-2"
              : "video-1"
          }
        >
          <video
            style={{ width: "100%", height: "100%" }}
            ref={ownVideoRef}
            playsInline
            autoPlay
          ></video>
          <Chip className="user-info" label={ownUserInfo.userName} />
        </div>
        {incomingVideoStream !== null && (
          <div className={screenSharingInProgress ? "bottom-row" : "video-2"}>
            <video
              style={{ width: "100%", height: "100%" }}
              ref={incomingVideoRef}
              playsInline
              autoPlay
            ></video>
            <Chip className="user-info" label={otherUserInfo.userName} />
          </div>
        )}
      </div>
      <div className="media-controls">
        <IconButton sx={{ color: "white" }} onClick={toggleAudio}>
          {audioEnabled ? (
            <MicOnIcon fontSize="large" />
          ) : (
            <MicOffIcon fontSize="large" />
          )}
        </IconButton>
        <IconButton sx={{ color: "white" }} onClick={toggleVideo}>
          {videoEnabled ? (
            <VideocamIcon fontSize="large" />
          ) : (
            <VideocamOffIcon fontSize="large" />
          )}
        </IconButton>
        <IconButton
          sx={{ color: "white" }}
          onClick={toggleScreenSharing}
          className={incomingVideoStream === null ? "disabled-icon" : ""}
        >
          {!screenSharingInProgress ? (
            <PresentToAllIcon fontSize="large" />
          ) : (
            <CancelPresentationIcon fontSize="large" />
          )}
        </IconButton>
        <IconButton sx={{ color: "white" }} onClick={onCallEndClick}>
          <CallEndIcon fontSize="large" />
        </IconButton>
      </div>
      <Dialog open={openConfirmationDialog} onClose={handleCancelDialog}>
        <DialogTitle>End meeting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end the meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialog}>Cancel</Button>
          <Button onClick={handleOkDialogEmail} autoFocus>
            clone and send email
          </Button>
          <Button onClick={handleOkDialog} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
