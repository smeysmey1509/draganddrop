import React from "react";

const Toolbar = ({ selectedTool, onSelectTool }) => {
  return (
    <div
      style={{ display: "flex", padding: "10px", backgroundColor: "#f1f1f1" }}
    >
      <button
        onClick={() => onSelectTool("draw")}
        style={{
          backgroundColor: selectedTool === "draw" ? "#007BFF" : "transparent",
          color: selectedTool === "draw" ? "#fff" : "#000",
        }}
      >
        Rectangle
      </button>
      <button
        onClick={() => onSelectTool("resize")}
        style={{
          backgroundColor:
            selectedTool === "resize" ? "#007BFF" : "transparent",
          color: selectedTool === "resize" ? "#fff" : "#000",
        }}
      >
        Resize
      </button>
      <button
        onClick={() => onSelectTool("move")}
        style={{
          backgroundColor: selectedTool === "move" ? "#007BFF" : "transparent",
          color: selectedTool === "move" ? "#fff" : "#000",
        }}
      >
        Move
      </button>
    </div>
  );
};

export default Toolbar;
