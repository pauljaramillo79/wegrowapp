import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

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
      <h2>{flower.name}</h2>
      <p>{flower.colour}</p>
    </div>
  );
}

export default App;
