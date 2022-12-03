import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { uploadResume } from "../../requestHelper";
import { UserDetailsContext } from "../../user-context";
import "./login-page.css";

export const LoginPage = ({ setRoomID, roomID }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isEmailValid, setValid] = useState(true);
  const [, setOwnUserInfo] = useContext(UserDetailsContext);
  const [isInterviewer, setIsInterviewer] = useState(false);
  const [addedFileFormData, setAddedFileFormData] = useState(null);
  const navigate = useNavigate();

  const onSubmit = useCallback(() => {
    setOwnUserInfo({ userName, email });
    if (roomID) {
      if (!isInterviewer) {
        uploadResume({ userName, email }, addedFileFormData).then(() => {
          navigate(`/room/${roomID}`);
        });
      } else {
        navigate(`/room/${roomID}`);
      }
    } else {
      const newRoomID = uuid4();
      setRoomID(newRoomID);
      navigate(`/room/${newRoomID}`);
    }
  }, [
    setOwnUserInfo,
    userName,
    email,
    roomID,
    navigate,
    isInterviewer,
    addedFileFormData,
    setRoomID,
  ]);

  const onEmailChange = useCallback((event) => {
    const isEmail = /\S+@\S+\.\S+/.test(event.target.value);
    setValid(isEmail);
    setEmail(event.target.value);
  }, []);

  const onUserNameChange = useCallback((event) => {
    setUserName(event.target.value);
  }, []);

  const onInterviewerCheckboxChange = useCallback((event) => {
    setIsInterviewer(!event.target.checked);
  }, []);

  const addFile = useCallback((event) => {
    if (event.target.files.length > 0) {
      const formData = new FormData();
      formData.set("file", event.target.files[0]);
      setAddedFileFormData(formData);
    } else {
      setAddedFileFormData(null);
    }
    console.log(event.target.files);
  }, []);

  return (
    <div>
      <div className="LoginPage_heading">
        <Typography className="LoginPage_heading" variant="h4">
          Interview Easy
        </Typography>
      </div>
      <Box className="LoginPage">
        <TextField
          variant="outlined"
          label="Email ID"
          required
          size="small"
          margin="normal"
          type="email"
          value={email}
          onChange={onEmailChange}
          error={!isEmailValid}
        />
        <TextField
          variant="outlined"
          label="User Name"
          required
          size="small"
          margin="normal"
          value={userName}
          onChange={onUserNameChange}
        />
        {roomID && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!isInterviewer}
                  onChange={onInterviewerCheckboxChange}
                />
              }
              label="Joining interview?"
            />
            {!isInterviewer && (
              <div className="resume-upload-area">
                <input
                  type="file"
                  id="resume-upload"
                  className="resume-upload-input"
                  multiple={false}
                  accept=".doc,.docx,.pdf"
                  onChange={addFile}
                />
                <label className="resume-upload-label" htmlFor="resume-upload">
                  {addedFileFormData !== null
                    ? addedFileFormData.get("file").name
                    : "Add Resume"}
                </label>
              </div>
            )}
          </div>
        )}
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={
            !userName ||
            !isEmailValid ||
            !email ||
            (roomID && !isInterviewer && addedFileFormData === null)
          }
        >
          {roomID ? "Join Meeting" : "Create Meeting"}
        </Button>
      </Box>
    </div>
  );
};
