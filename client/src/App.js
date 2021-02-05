import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import Register from "./components/Register";

function App() {
  const [flower, setFlower] = useState({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await Axios.get("/flower").then((result) => {
      setFlower(result.data);
    });
  }, []);
  return (
    <div className="App">
      {/* <h2>{flower.name}</h2>
      <p>{flower.colour}</p> */}
      <Register />
    </div>
  );
}

export default App;
