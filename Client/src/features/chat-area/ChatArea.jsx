import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useCallback, useState } from "react";
import "./ChatArea.css";
import { useContext } from "react";
import { SocketContext } from "../../socket-context";
import { onNewMessage } from "../../socket-context/EventEmitters";
import { UserDetailsContext } from "../../user-context";

export const ChatArea = () => {
  const { messages } = useContext(SocketContext);
  const [ownUserInfo] = useContext(UserDetailsContext);
  const [message, setMessage] = useState("");

  const handleMessageChange = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const onEnter = useCallback(() => {
    if (message) {
      onNewMessage(message, ownUserInfo.userName);
      setMessage("");
    }
  }, [message, ownUserInfo]);

  return (
    <>
      <div className="chat-header">Chat</div>
      <Paper className="chat-area">
        <div className="messages">
          {messages?.map((messageObj) => {
            return (
              <div
                className={
                  messageObj.userName === ownUserInfo.userName
                    ? "left"
                    : "right"
                }
              >
                {messageObj.message}
              </div>
            );
          })}
        </div>
        <OutlinedInput
          className="message-input"
          value={message}
          onChange={handleMessageChange}
          onSubmit={onEnter}
          endAdornment={
            <InputAdornment>
              <IconButton
                aria-label="toggle password visibility"
                onClick={onEnter}
                edge="end"
              >
                <SendRoundedIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Paper>
    </>
  );
};
