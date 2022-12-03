import axios from "axios";

export const uploadResume = (userInfo, formData) => {
  return axios.post("http://localhost:3001/upload", formData);
};
