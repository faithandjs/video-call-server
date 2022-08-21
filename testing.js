// // const express = require("express");

// // const app = express();
// // const server = require("http").Server(app);
// // const { v4: uuidv4 } = require("uuid");
// // app.set("view engine", "ejs");
// // const io = require("socket.io")(server, {
// //   cors: {
// //     origin: '*'
// //   }
// // });
// // const { ExpressPeerServer } = require("peer");
// // const peerServer = ExpressPeerServer(server, {
// //   debug: true,
// // });

// // app.use("/peerjs", peerServer);
// // app.use(express.static("public"));

// // app.get("/", (req, res) => {
// //   res.redirect(`/${uuidv4()}`);
// // });

// // app.get("/:room", (req, res) => {
// //   res.render("room", { roomId: req.params.room });
// // });

// // io.on("connection", (socket) => {
// //   socket.on("join-room", (roomId, userId, userName) => {
// //     socket.join(roomId);
// //     socket.to(roomId).broadcast.emit("user-connected", userId);
// //     socket.on("message", (message) => {
// //       io.to(roomId).emit("createMessage", message, userName);
// //     });
// //   });
// // });
// console.log()

// // const socket = io(“/”);
// // const videoGrid = document.getElementById(“video-grid”);
// // const myVideo = document.createElement(“video”);
// // myVideo.muted = true;
// var peer = new Peer(undefined, {
// path: “/peerjs”,
// host: “/”,
// port: “3030”,
// });
// let myVideoStream;
// navigator.mediaDevices
// .getUserMedia({
// audio: true,
// video: true,
// })
// .then((stream) => {
// myVideoStream = stream;
// addVideoStream(myVideo, stream);
// peer.on(“call”, (call) => {
//     call.answer(stream);
//     const video = document.createElement(“video”);
//     call.on(“stream”, (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
// });
// });
// socket.on(“user-connected”, (userId) => {
// connectToNewUser(userId, stream);
// });
// });
// const connectToNewUser = (userId, stream) => {
// const call = peer.call(userId, stream);
// const video = document.createElement(“video”);
// call.on(“stream”, (userVideoStream) => {
// addVideoStream(video, userVideoStream);
// });
// };
// peer.on(“open”, (id) => {
// socket.emit(“join-room”, ROOM_ID, id);
// });
// const addVideoStream = (video, stream) => {
// video.srcObject = stream;
// video.addEventListener(“loadedmetadata”, () => {
// video.play();
// videoGrid.append(video);
// });
// };