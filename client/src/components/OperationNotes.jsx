import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import moment from "moment";
import "./OperationNotes.css";

const OperationNotes = ({
  opToEdit,
  opNotes,
  setOpNotes,
  reloadnotes,
  setReloadnotes,
}) => {
  const user = JSON.parse(localStorage.getItem("WGusercode"));
  const [noteDate, setNoteDate] = useState(moment().format("YYYY-MM-DD"));
  const [noteToAdd, setNoteToAdd] = useState("");

  const handleSaveNote = (QSID) => {
    if (noteToAdd !== "") {
      Axios.post("/savenewnote", {
        QSID: QSID,
        opNote: noteToAdd,
        opNoteDate: moment().format("YYYY-MM-DD HH:mm"),
        userCode: user,
      }).then((response) => {
        setReloadnotes(!reloadnotes);
      });
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
    <>
      <div className="opnotes">
        {opNotes && opNotes.length > 0 ? (
          opNotes.map((note, ind) => {
            if (note.opnote) {
              return (
                <div className="opnotegroup">
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
        ></textarea>
        <button
          className="opnotepost"
          onClick={(e) => handleSaveNote(opToEdit, e.target.value)}
        >
          Post
        </button>
      </div>
    </>
  );
};

export default OperationNotes;
