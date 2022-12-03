import { socket } from ".";
import {  useCallback } from "react";
var messageListInfoS="";
export const initEventListeners = ({ setValue }, ownUserInfo) => {
  socket.on("list-of-messages", (listOfMessages) => {
    messageListInfoS=listOfMessages;
    setValue((state) => {
      return { ...state, messages: listOfMessages };
    });
  });
  socket.on("user-joined", (peerID, userInfo) => {
    setValue((state) => {
      return {
        ...state,
        otherUserInfo: userInfo,
        otherUserPeerID: peerID,
      };
    });
  });

  socket.on("user-disconnected", () => {
    setValue((state) => {
      return {
        ...state,
        otherUserInfo: {},
        otherUserPeerID: undefined,
      };
    });
  });

  socket.on("list-of-users", (usersList) => {
    setValue((state) => {
      const otherUserInfo = {};
      for (let user in usersList) {
        if (user !== ownUserInfo.userName) {
          otherUserInfo.userName = user;
          otherUserInfo.email = usersList[user];
        }
      }

      return { ...state, otherUserInfo };
    });
  });

  socket.on("on-screen-sharing", (isOtherUserSharingScreen) => {
    setValue((state) => {
      return { ...state, isOtherUserSharingScreen };
    });
  });
};
export const getChart=()=>{
  return messageListInfoS;
}

