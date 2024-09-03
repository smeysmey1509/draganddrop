// src/App.js
import React, { useState } from "react";
import DragAndDrop from "./components/DragAndDrop";

const App = () => {
  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Drag and Drop Demo</h1>
      <DragAndDrop />
    </div>
  );
};

export default App;
