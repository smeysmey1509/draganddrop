import React from "react";
import DragDropLists from "./components/DragDropList";
import DropZone from "./components/DropZone";
import Canvas from "./components/Canvas";

const App = () => {
  return (
    <div className="App">
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px",
        }}
      >
        Drag and Drop List
      </h1>
      <DragDropLists />
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px",
        }}
      >
        Drop Zone
      </h1>
      <DropZone />
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px",
        }}
      >
        Canvas Component
      </h1>
      <Canvas />
    </div>
  );
};

export default App;
