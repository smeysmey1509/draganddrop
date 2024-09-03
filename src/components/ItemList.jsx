// ItemList.js
import React from "react";
import DraggableItem from "./DraggableItem";

const ItemList = ({ items, listId, onDragStart, onDragOver, onDrop }) => {
  return (
    <div
      className="item-list"
      onDragOver={(e) => onDragOver(e)}
      style={{
        width: "100%",
        padding: "18px",
        borderRadius: "8px",
        boxShadow:
          "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
      }}
    >
      <h2>List {listId}</h2>
      {items.length === 0 ? (
        <div style={{ padding: "10px", textAlign: "center", color: "#888" }}>
          No Task Available
        </div>
      ) : (
        items.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            index={index}
            listId={listId}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
          />
        ))
      )}
    </div>
  );
};

export default ItemList;
