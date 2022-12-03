import { ListItemText } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import { SocketContext } from "../../socket-context";
import { UserDetailsContext } from "../../user-context";
import "./ParticipantsList.css";

export const ParticipantsList = () => {
  const [ownUserInfo] = useContext(UserDetailsContext);
  const { otherUserInfo } = useContext(SocketContext);

  return (
    <>
      <div className="participants-header">Participants</div>
      <List className="participants-list">
        <ListItem>
          <Avatar
            alt="C"
            src={ownUserInfo.userName ? ownUserInfo.userName.split("~")[1] : ""}
          />
          <ListItemText primary={ownUserInfo.userName} />
        </ListItem>
        {otherUserInfo.userName && (
          <ListItem>
            <Avatar
              alt="C"
              src={
                otherUserInfo.userName
                  ? otherUserInfo.userName.split("~")[1]
                  : ""
              }
            />
            <ListItemText primary={otherUserInfo?.userName} />
          </ListItem>
        )}
      </List>
    </>
  );
};
