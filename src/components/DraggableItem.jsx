import React from "react";

const DraggableItem = ({
  item,
  index,
  onDragStart,
  listId,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index, listId)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, listId)}
      className="draggable-item"
    >
      {item.text}
    </div>
  );
};

export default DraggableItem;
