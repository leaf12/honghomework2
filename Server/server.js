const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const formidable = require("formidable");
const fs = require("fs");
const config = require("./config");
const { ExpressPeerServer } = require("peer");
const path = require("path");
const getcoderouter = require('./email/index')

const peerServer = ExpressPeerServer(server, {
  debug: true,
  expire_timeout: 600000,
  alive_timeout: 600000,
});

app.use(cors());

app.use("/peerjs", peerServer);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(require("express").json());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("server is running");
});

app.post("/", (req, res) => {
  res.send("server is running");
});
app.get("/sendemail/:email/:text",(req,res)=>{
  // res.send(req.params);
  getcoderouter.test(req.params.email,req.params.text);
})
app.post("/upload", (req, res) => {
  let form = new formidable.IncomingForm({
    uploadDir: path.join(__dirname, config.default.vault),
    keepExtensions: true,
  });

  form.parse(req, function (error, fields, file) {
    let filepath = file.file.filepath;
    let newpath = path.join(
      __dirname,
      config.default.vault,
      file.file.originalFilename
    );

    fs.rename(filepath, newpath, function () {
      res.write("File Upload Success!");
      res.end();
    });
  });
});

const userListByRoomID = {};
const messagesByRoomID = {};

io.on("connection", (socket) => {
  socket.emit("registered", socket.id);

  socket.on("room-is-ready", (roomId, peerID, userInfo) => {
    if (!userListByRoomID[roomId]) {
      userListByRoomID[roomId] = {};
    }

    userListByRoomID[roomId][userInfo.userName] = userInfo.email;

    socket.join(roomId);
    socket.to(roomId).emit("user-joined", peerID, userInfo);
    io.in(roomId).emit("list-of-users", userListByRoomID[roomId]);
    io.in(roomId).emit("list-of-messages", messagesByRoomID[roomId]);

    socket.on("disconnect-user", () => {
      socket.to(roomId).emit("user-disconnected", userInfo);
      socket.to(roomId).emit("on-screen-sharing", false);
      delete userListByRoomID[roomId][userInfo.userName];
      io.in(roomId).emit("list-of-users", userListByRoomID[roomId]);
    });

    socket.on("new-message", (newMessage, userName) => {
      if (!messagesByRoomID[roomId]) {
        messagesByRoomID[roomId] = [];
      }
      const newMessageObj = { message: newMessage, userName: userName };
      messagesByRoomID[roomId].push(newMessageObj);
      io.in(roomId).emit("list-of-messages", messagesByRoomID[roomId]);
    });

    socket.on("on-screen-sharing", (roomId, status) => {
      socket.to(roomId).emit("on-screen-sharing", status);
    });
  });
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
