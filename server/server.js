const express = require("express");
const PORT = process.env.PORT || 4001;
const path = require("path");
const app = express();
const http = require("http").createServer(app);

// var io = require("socket.io")(http, {
//   cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
// });

var io = require("socket.io")(http, {
  cors: { origin: "https://www.wgappdev.com", methods: ["GET", "POST"] },
});

const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Fix for the Cannot Get... issue. Bsically redirects all server calls to Index.html and then lets React Router handle what to show on browser
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "client", "build", "index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/routes"));

// app.listen(PORT, () => {
//   console.log(`Server listening in port ${PORT}`);
// });

http.listen(PORT, () => {
  let host = http.address().address;
  let port = http.address().port;
  console.log("App listening at http://%s:%s", host, port);
});

io.on("connection", (socket) => {
  // console.log(`Client connected to: ${socket.id}`);

  socket.on("leaveroom", (room) => {
    // console.log("left room", room);
    socket.leave(room);
  });
  socket.on("joinroom", (data) => {
    socket.join(data);
    // console.log(`joined room ${data}`);
  });

  socket.on("sendmsg", (msg) => {
    // console.log("Received a chat msg", msg);
    // io.emit("sendmsg");
    socket.to(msg.QSID).emit("receivemsg", msg);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
