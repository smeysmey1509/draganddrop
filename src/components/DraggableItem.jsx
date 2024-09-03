// DraggableItem.js
import React, { useRef } from "react";

const DraggableItem = ({
  item,
  index,
  listId,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const dragPreviewRef = useRef(null);
  const handleDragStart = (e) => {
    onDragStart(e, index, listId);

    //Set drag image
    if (dragPreviewRef.current) {
      e.dataTransfer.setDragImage(dragPreviewRef.current, 0, 0);
    }
  };

  return (
    <>
      {" "}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, index)}
        className="draggable-item"
      >
        {item.text}
      </div>
      <div
        ref={dragPreviewRef}
        style={{
          position: "absolute",
          top: "-100%",
          left: "-100%",
          pointerEvents: "none",
          opacity: 0.7,
          backgroundColor: "lightblue",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {item.text}
      </div>
    </>
  );
};

export default DraggableItem;
