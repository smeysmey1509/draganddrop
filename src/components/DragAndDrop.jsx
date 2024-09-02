import React, { useState } from "react";
import "./DragAndDrop.css";

const DragAndDrop = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Mouy" },
    { id: 2, text: "Mey" },
    { id: 3, text: "Mama" },
  ]);

  const [droppedItems, setDroppedItems] = useState([]);

  const onDragStart = (e, item, from) => {
    e.dataTransfer.setData("itemId", item.id);
    e.dataTransfer.setData("from", from);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    const itemId = e.dataTransfer.getData("itemId");
    const from = e.dataTransfer.getData("from");

    // const draggedItem = items.find((item) => item.id === parseInt(itemId));

    let draggedItem;

    if (from === "items") {
      draggedItem = items.find((item) => item.id === parseInt(itemId));
      setItems(items.filter((item) => item.id !== parseInt(itemId)));
      setDroppedItems([...droppedItems, draggedItem]);
    } else if (from === "droppedItems") {
      draggedItem = droppedItems.find((item) => item.id === parseInt(itemId));
      setDroppedItems(
        droppedItems.filter((item) => item.id !== draggedItem.id)
      );
      setItems([...items, draggedItem]);
    }
  };

  return (
    <div className="drag-and-drop">
      <div
        className="items"
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, "items")}
      >
        <h2>Items</h2>
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item, "items")}
            className="draggable-item"
          >
            {item.text}
          </div>
        ))}
      </div>
      <div
        className="drop-zone"
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, "droppedItems")}
      >
        <h2>Drop Zone</h2>
        {droppedItems.map((item) => (
          <div
            key={item.id}
            className="dropped-item"
            draggable
            onDragStart={(e) => onDragStart(e, item, "droppedItems")}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragAndDrop;
