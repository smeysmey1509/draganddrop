import React, { useState } from "react";
import ItemList from "./ItemList";
import "./DragAndDrop.css";

const DragAndDrop = () => {
  const [lists, setLists] = useState({
    1: [
      { id: 1, text: "Task 1" },
      { id: 2, text: "Task 2" },
    ],
    2: [
      { id: 3, text: "Task 3" },
      { id: 4, text: "Task 4" },
    ],
    3: [
      { id: 5, text: "Task 5" },
      { id: 6, text: "Task 6" },
    ],
  });

  const [draggedItem, setDraggedItem] = useState(null);

  const onDragStart = (e, index, listId) => {
    const item = lists[listId][index];
    setDraggedItem({ item, listId });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetListId) => {
    e.preventDefault();
    const { item, listId } = draggedItem;

    if (listId !== targetListId) {
      const sourceList = lists[listId].filter((i) => i.id !== item.id);
      const targetList = [...lists[targetListId], item];

      setLists({
        ...lists,
        [listId]: sourceList,
        [targetListId]: targetList,
      });
    }
    setDraggedItem(null);
  };

  return (
    <div className="drag-and-drop">
      {Object.keys(lists).map((listId) => (
        <ItemList
          key={listId}
          items={lists[listId]}
          listId={parseInt(listId)}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};

export default DragAndDrop;
