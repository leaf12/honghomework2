import { socket } from ".";

export const onNewMessage = (newMessage, userInfo) => {
  socket.emit("new-message", newMessage, userInfo);
};

export const onUserDisconnect = () => {
  socket.emit("disconnect-user");
};

export const onRoomIsReady = (roomID, peerID, userInfo) => {
  socket.emit("room-is-ready", roomID, peerID, userInfo);
};

export const onScreenSharing = (roomID, status) => {
  socket.emit("on-screen-sharing", roomID, status);
};
