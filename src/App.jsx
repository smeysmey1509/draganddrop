import React from "react";
import DragDropLists from "./components/DragDropList";
import DropZone from "./components/DropZone";

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
    </div>
  );
};

export default App;
