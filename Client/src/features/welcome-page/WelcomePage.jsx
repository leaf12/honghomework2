import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./welcome-page.css";
import LandingImage from "./../../images/background.PNG";

export const WelcomePage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState();
  const [roomID, setRoomID] = useState("");

  const onRoomIDChange = useCallback((event) => {
    setRoomID(event.target.value);
  }, []);

  const onClickingCreateMeeting = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const onJoinMeeting = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCancelDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOkDialog = useCallback(() => {
    navigate(`/room/${roomID}`);
  }, [navigate, roomID]);

  return (
    <div className="welcome-page">
      <div className="HomePageContainer">
        <img
          alt="React Task board App"
          style={{ height: "100%", width: "100%" }}
          src={LandingImage}
        ></img>
      </div>

      <div className="HomePageContainer_2">
        <div className="HomePageContainer_2_heading">
          <Typography className="HomePageContainer_2_heading" variant="h3">
            Interview Easy
          </Typography>
        </div>

        <div className="HomePageContainer_2_buttons">
          <Box sx={{ minWidth: 250 }} className="interviewer_card">
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  Interviewer ?
                </Typography>
                <Typography variant="body2">
                  <br />
                  Go Ahead and create the interview room.
                  <br />
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={onClickingCreateMeeting}>
                  Create Meeting
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Box sx={{ minWidth: 250 }} className="interviewee_card">
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  Interviewee ?
                </Typography>
                <Typography variant="body2">
                  <br />
                  Go Ahead and join the interview room.
                  <br />
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={onJoinMeeting}>
                  Join Meeting
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Dialog open={open} onClose={handleCancelDialog}>
            <DialogTitle>Join Room</DialogTitle>
            <DialogContent>
              <TextField
                variant="outlined"
                label="Room ID"
                required
                size="small"
                margin="normal"
                type="input"
                value={roomID}
                onChange={onRoomIDChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDialog}>Cancel</Button>
              <Button onClick={handleOkDialog} autoFocus disabled={!roomID}>
                Join
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <p className="text-center" style={FooterStyle}>
      Copyright © 2022 Interview Easy
    </p>
  );
};

const FooterStyle = {
  background: "#222",
  fontSize: ".8rem",
  color: "#fff",
  position: "absolute",
  bottom: 0,
  padding: "1rem",
  margin: 0,
  width: "100%",
  opacity: ".5",
  "padding-right": "0rem",
  "padding-left": "0rem",
  display: "flex",
  "justify-content": "center",
};
