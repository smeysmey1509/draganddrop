// DragAndDrop.js
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
    setDraggedItem({ item, sourceListId: listId, index });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetListId, targetIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, sourceListId } = draggedItem;

    // Handle moving items between different lists
    if (sourceListId !== targetListId) {
      const sourceList = lists[sourceListId].filter((i) => i.id !== item.id);
      const targetList = [...lists[targetListId]];

      targetList.splice(targetIndex, 0, item);

      setLists({
        ...lists,
        [sourceListId]: sourceList,
        [targetListId]: targetList,
      });
    } else {
      // Handle reordering within the same list
      const sourceList = [...lists[sourceListId]];
      sourceList.splice(draggedItem.index, 1); // Remove the item from its original position
      sourceList.splice(targetIndex, 0, item); // Insert the item at the new position

      setLists({
        ...lists,
        [sourceListId]: sourceList,
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
          onDrop={(e) => onDrop(e, parseInt(listId))}
        />
      ))}
    </div>
  );
};

export default DragAndDrop;
