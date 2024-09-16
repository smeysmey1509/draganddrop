import React from "react";

const Toolbar = ({ selectedTool, onSelectTool }) => {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <button
        style={{
          margin: "0 5px",
          backgroundColor: selectedTool === "draw" ? "#007BFF" : "#fff",
          color: selectedTool === "draw" ? "#fff" : "#000",
        }}
        onClick={() => onSelectTool("draw")}
      >
        Draw
      </button>
      <button
        style={{
          margin: "0 5px",
          backgroundColor: selectedTool === "move" ? "#007BFF" : "#fff",
          color: selectedTool === "move" ? "#fff" : "#000",
        }}
        onClick={() => onSelectTool("move")}
      >
        Move
      </button>
      <button
        style={{
          margin: "0 5px",
          backgroundColor: selectedTool === "resize" ? "#007BFF" : "#fff",
          color: selectedTool === "resize" ? "#fff" : "#000",
        }}
        onClick={() => onSelectTool("resize")}
      >
        Resize
      </button>
    </div>
  );
};

export default Toolbar;
