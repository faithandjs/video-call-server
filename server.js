const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidV4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
const data = require("./data.json");
const PORT = process.env.PORT || 4000;
let rooms = [];
const getName = (id) => {
  const user = data.find((item) => item.officeId === id);
  return user === undefined ? "not found" : user.name;
};
// app.get("/", (req, res) => {
//   res.status(200).redirect(`/${uuidV4()}`);
// });
// app.get("/api", (req, res) => {
//   res.json({ message: "Hello from Express!" });
// });
// app.get(`/:room`, (req, res) => {
//   res.status(200).send(`hello world`);
//   // res.render("room", { roomId: req.params.room });
// });
const sendUsers = (id) => {
  console.log(rooms[id], id);
  if (id >= 0) io.in(rooms[id].room_id).emit("in-call", rooms[id].room_details);
  else console.log(id);
};
const error = (e) => {
  io.emit("error", e);
};
io.on("connection", (socket) => {
  //caller: creates room and is saved
  //to rooms with host set as true, socket.id, roomid and name
  socket.on("caller", (my_id) => {
    const room_id = my_id;
    socket.emit("join", room_id);
  });
  socket.on("caller-view", (room_id,my_id) => {
    socket.join(room_id);
    const roomIndex = rooms.findIndex((item) => item.room_id === room_id);
    if (roomIndex < 0) {
      rooms.push({
        room_id,
        room_details: [
          {
            host: true,
            name: getName(my_id),
            socketId: socket.id,
            officeId: my_id,
          },
        ],
      });
    } else {
      rooms.splice(roomIndex, 1, {
        room_id,
        room_details: [
          {
            host: true,
            name: getName(my_id),
            socketId: socket.id,
            officeId: my_id,
          },
        ],
      });
    }
    sendUsers(rooms.findIndex((item) => item.room_id === room_id));
  });
  //reciever is added to the rooom an to the rooms object details array
  socket.on("reciever", (room_id, my_id) => {
    const roomIndex = rooms.findIndex((each) => each.room_id === room_id);
    if (roomIndex >= 0) {
      socket.join(room_id);
      const officerIndex = rooms[roomIndex].room_details.findIndex(
        (item) => item.officeId === my_id
      );
      if (officerIndex >= 0) {
        rooms[roomIndex].room_details[officerIndex].socketId = socket.id;
      } else {
        rooms[roomIndex].room_details.push({
          host: false,
          name: getName(my_id),
          socketId: socket.id,
          officeId: my_id,
        });
      }
    } else {
      socket.emit("no-exist");
    } 
    sendUsers(rooms.findIndex((each) => each.room_id === room_id));
  });
  socket.on("disconnecting", () => {
    // console.log("disconnecting", socket.id);
  });
  socket.on("disconnect", () => {
    // console.log("disconnect", socket.id);
  });
  socket.on("connect", () => {
    // console.log("connect", socket.id);
  });
});

server.listen(PORT, function () {
  console.log("listening", uuidV4());
});
