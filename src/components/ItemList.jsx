// ItemList.js
import React from "react";
import DraggableItem from "./DraggableItem";

const ItemList = ({ items, listId, onDragStart, onDragOver, onDrop }) => {
  return (
    <div
      className="item-list"
      onDragOver={(e) => onDragOver(e)}
      style={{
        padding: "18px",
        borderRadius: "8px",
        boxShadow:
          "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
      }}
    >
      <h2>List {listId}</h2>
      {items.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          listId={listId}
          onDragStart={onDragStart}
          onDragOver={(e) => onDragOver(e, index)}
          onDrop={(e) => onDrop(e, listId, index)}
        />
      ))}
    </div>
  );
};

export default ItemList;
