import React, { useState } from "react";
import CanvasSidebar from "./CanvasSidebar";
import CanvasContent from "./CanvasContent";

const Canvas = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (item) => {
    setDroppedItems((prevItems) => [...prevItems, item]);
  };

  const items = [
    { type: "move", label: "Move", color: "white" },
    { type: "button", label: "Button", color: "white" },
    { type: "card", label: "Card", color: "white" },
    { type: "profile", label: "Profile", color: "white" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "78vh",
        display: "flex",
        gap: "5px",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <CanvasSidebar items={items} />
      <CanvasContent droppedItems={droppedItems} onDrop={handleDrop} />
    </div>
  );
};

export default Canvas;
