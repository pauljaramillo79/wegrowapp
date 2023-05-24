import React, { useEffect, useState, useRef, useContext } from "react";
import Axios from "axios";
import moment from "moment";
import "./OperationNotes.css";
import { LogisticsContext } from "../contexts/LogisticsProvider";

// import io from "socket.io-client";
// const socket = io.connect("http://localhost:4001");

const OperationNotes = ({
  // opToEdit,
  // opNotes,
  // setOpNotes,
  reloadnotes,
  setReloadnotes,
  socket,
}) => {
  const {
    opToEdit,
    opNotes,
    setOpNotes,
    setOpsWithNewNotes,
    opsWithNewNotes,
  } = useContext(LogisticsContext);

  const user = JSON.parse(localStorage.getItem("WGusercode"));
  const [noteDate, setNoteDate] = useState(moment().format("YYYY-MM-DD"));
  const [noteToAdd, setNoteToAdd] = useState("");

  const [messageList, setMessageList] = useState();

  // useEffect(() => {
  //   setMessageList(opNotes);
  // }, [opToEdit]);
  // useEffect(() => {
  //   if (user !== "" && opToEdit !== "" && opToEdit !== null) {
  //     socket.emit("joinroom", opToEdit);
  //     console.log("room:", opToEdit);
  //   }
  // }, [opToEdit]);

  useEffect(() => {
    socket.on("receivemsg", (msg) => {
      console.log(msg);

      // if (Array.isArray(opNotes)) {
      setOpNotes((opNotes) => [...opNotes, msg]);

      // } else {
      //   setOpNotes([msg]);
      // }
    });
  }, [socket]);

  const handleSaveNote = (QSID) => {
    if (noteToAdd !== "" && user !== "") {
      const msgdata = {
        // room: QSID,
        QSID: QSID,
        opnote: noteToAdd,
        opNoteDate: moment().format("YYYY-MM-DD HH:mm"),
        userCode: user,
      };
      Axios.post("/savenewnote", {
        QSID: QSID,
        opNote: noteToAdd,
        opNoteDate: moment().format("YYYY-MM-DD HH:mm"),
        userCode: user,
      }).then(async (response) => {
        await socket.emit("sendmsg", msgdata);
        // setReloadnotes(!reloadnotes);
        // if (Array.isArray(opNotes)) {
        setOpNotes([...opNotes, msgdata]);
        // setOpsWithNewNotes([...opsWithNewNotes, QSID]);
        // } else {
        //   setOpNotes([msgdata]);
        // }
      });
      if (!opsWithNewNotes.includes(QSID)) {
        console.log("sending");
        Axios.post("/addQStonewmsglist", { QSID: QSID, user: user });
      }
    }
    setNoteToAdd("");
  };

  const refBottomNote = useRef(null);

  useEffect(() => {
    if (refBottomNote.current) {
      refBottomNote.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [opNotes]);

  return (
    <div className="operationNotes">
      <div className="opnotes">
        {opNotes ? (
          opNotes.map((note, ind) => {
            if (note.opnote) {
              return (
                <div
                  className={
                    note.userCode === user
                      ? "opnotegroup"
                      : "opnotegroup otherusermsg"
                  }
                >
                  {ind === opNotes.length - 1 ? (
                    <p ref={refBottomNote} className="opnote">
                      {note.opnote}
                    </p>
                  ) : (
                    <p className="opnote">{note.opnote}</p>
                  )}
                  <div className="opnotemetadata">
                    <p>{moment(note.opnotedate).format("MMM DD - HH:mm")}</p>
                    <p>{note.userCode}</p>
                  </div>
                </div>
              );
            }
          })
        ) : opNotes ? (
          <p>{opNotes.message}</p>
        ) : (
          ""
        )}
      </div>
      <div className="opnoteinputs">
        <textarea
          value={noteToAdd}
          onChange={(e) => setNoteToAdd(e.target.value)}
          type="text"
          placeholder="type new note"
          className="opnoteinput"
          onKeyDown={(e) => {
            e.key === "Enter" && handleSaveNote(opToEdit);
          }}
        ></textarea>
        <button
          className="opnotepost"
          onClick={(e) => handleSaveNote(opToEdit)}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default OperationNotes;
