import React from "react";
import DraggableItem from "./DraggableItem";

const ItemList = ({ items, onDragStart, onDragOver, onDrop, listId }) => {
  return (
    <div
      className="item-list"
      style={{
        width: "100%",
        height: "auto",
        padding: "10px",
        borderRadius: "8px",
        boxShadow:
          "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
      }}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, listId)}
    >
      <h2>List {listId}</h2>
      {items.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          listId={listId}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};

export default ItemList;
