const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidV4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
const PORT = process.env.PORT || 4000;
let participants = [];
let rooms = [
  {
    room_id: "",
    room_details: [
      {
        host: true,
        socketId: "",
        officeId: "",
      },
      {
        socketId: "",
        officeId: "",
      },
    ],
  },
];
// app.get("/", (req, res) => {
//   res.status(200).redirect(`/${uuidV4()}`);
// });
// app.get("/api", (req, res) => {
//   console.log('here')
//   res.json({ message: "Hello from Express!" });
// });
// app.get(`/:room`, (req, res) => {
//   res.status(200).send(`hello world`);
//   // res.render("room", { roomId: req.params.room });
// });

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    // socket.emit("participants", participants);
  });
  socket.on("my_videoStream", (arg) => {
    console.log(arg);
    if (participants.find((item) => item.id === arg.id)) {
      let temp = participants.filter((item) => item.id !== arg.id);
      participants = [...temp, arg];
    } else participants.push(arg);
    socket.emit("participants", participants);
  });

  socket.on("caller", (my_id) => {
    const room_id = my_id;
    socket.join(room_id);
    socket.emit("joined", room_id);
    console.log(my_id);
    rooms.push({
      room_id: room_id,
      room_details: [
        {
          host: true,
          socketId: socket.id,
          officeId: my_id,
        },
      ],
    });
    console.log(rooms)
  });
  socket.on("recipient", (room_id, my_id) => {
    socket.join(room_id);
    const roomIndex = rooms.findIndex((each) => each.room_id === room_id);
    if (roomIndex >= 0) {
      const officerIndex = rooms[roomIndex].room_details.findIndex(
        (item) => item.officeId === my_id
      );
      if (officerIndex >= 0) {
        rooms[roomIndex].room_details[officerIndex].socketId = socket.id;
      } else {
        rooms[roomIndex].room_details.push({
          host: false,
          socketId: socket.id,
          officeId: my_id,
        });
      }
    } else {
      //room doesnt exist
    }
    rooms.forEach((each) => {
      if (each.room_id === room_id) {
        if (room_details.findIndex((item) => item.officeId === my_id) < 0) {
        }
      }
    });
    console.log(rooms)
  });
});

server.listen(PORT, function () {
  console.log("listening", uuidV4());
});
