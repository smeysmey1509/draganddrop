import React, { useState } from "react";
import CanvasSidebar from "./CanvasSidebar";
import CanvasContent from "./CanvasContent";

const Canvas = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (item) => {
    setDroppedItems((prevItems) => [...prevItems, item]);
  };

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
      <CanvasSidebar />
      <CanvasContent droppedItems={droppedItems} onDrop={handleDrop} />
    </div>
  );
};

export default Canvas;
