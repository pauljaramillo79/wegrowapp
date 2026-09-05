import React, { useState, useEffect } from "react";
import "./Chat.css";
// import io from "socket.io-client";

// const socket = io.connect("http://localhost:4001");

const Chat = () => {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [msg, setMsg] = useState();

  const joinRoom = () => {
    if (user !== "" && room !== "") {
      //   socket.emit("joinroom", room);
    }
  };

  const sendMsg = async () => {
    if (msg !== "" && room !== "") {
      const msgdata = {
        msg: msg,
        room: room,
        user: user,
      };
      //   await socket.emit("sendmsg", msgdata);
      setMsg("");
    }
  };

  useEffect(() => {
    // socket.on("receivemsg", (msg) => {
    console.log(msg);
  });
  //   }, [socket]);

  return (
    <div className="chatcontainer">
      {/* <div className="joinroom">
        <input
          type="text"
          placeholder="user"
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="room"
          onChange={(e) => {
            setRoom(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            joinRoom();
          }}
        >
          Join
        </button>
      </div>
      <div className="chatmain">
        <div className="chatbody"></div>
        <div className="chatfooter">
          <input
            type="text"
            placeholder="type msg"
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            value={msg}
          />
          <button
            onClick={(e) => {
              sendMsg();
            }}
          >
            Send
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Chat;
