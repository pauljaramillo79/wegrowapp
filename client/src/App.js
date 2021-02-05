import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import Register from "./components/Register";

function App() {
  return (
    <div className="App">
      <Register />
    </div>
  );
}

export default App;
