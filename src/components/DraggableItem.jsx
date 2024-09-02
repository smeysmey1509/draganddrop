// DraggableItem.js
import React from "react";

const DraggableItem = ({
  item,
  index,
  listId,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index, listId)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, listId, index)}
      className="draggable-item"
    >
      {item.text}
    </div>
  );
};

export default DraggableItem;
