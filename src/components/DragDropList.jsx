import React, { useState } from "react";

const DragDropLists = () => {
  const [list1, setList1] = useState(["Item 1", "Item 2", "Item 3"]);
  const [list2, setList2] = useState(["Item A", "Item B", "Item C"]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [sourceList, setSourceList] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(null);
  const [placeholderList, setPlaceholderList] = useState(null);
  const [dropPosition, setDropPosition] = useState("middle"); // top, middle, bottom

  const handleDragStart = (e, item, index, list) => {
    setDraggedItem(item);
    setSourceList(list);
    setDraggedIndex(index);

    // Add dragging class to the item
    document
      .querySelector(`[data-id="${item}-${index}"]`)
      .classList.add("dragging");
  };

  const handleDragEnter = (e, list, index) => {
    e.preventDefault();
    const itemHeight = e.currentTarget.offsetHeight;
    const offsetY = e.nativeEvent.offsetY;

    // Determine drop position based on cursor's position
    if (offsetY < itemHeight / 3) {
      setDropPosition("top");
    } else if (offsetY > (2 * itemHeight) / 3) {
      setDropPosition("bottom");
    } else {
      setDropPosition("middle");
    }

    setPlaceholderIndex(index);
    setPlaceholderList(list);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, list) => {
    e.preventDefault();
    if (draggedItem === null || sourceList === null) return;

    let finalIndex = placeholderIndex;

    if (dropPosition === "bottom") {
      finalIndex++;
    }

    // Handle transfer between lists
    if (list !== sourceList) {
      if (sourceList === "list1") {
        setList1(list1.filter((_, idx) => idx !== draggedIndex));
        setList2([
          ...list2.slice(0, finalIndex),
          draggedItem,
          ...list2.slice(finalIndex),
        ]);
      } else {
        setList2(list2.filter((_, idx) => idx !== draggedIndex));
        setList1([
          ...list1.slice(0, finalIndex),
          draggedItem,
          ...list1.slice(finalIndex),
        ]);
      }
    } else {
      // Handle reordering within the same list
      const newList = list === "list1" ? [...list1] : [...list2];
      newList.splice(draggedIndex, 1);
      newList.splice(finalIndex, 0, draggedItem);

      if (list === "list1") {
        setList1(newList);
      } else {
        setList2(newList);
      }
    }

    // Remove dragging class from the item and reset states
    requestAnimationFrame(() => {
      const draggedElement = document.querySelector(
        `[data-id="${draggedItem}-${draggedIndex}"]`
      );
      if (draggedElement) {
        draggedElement.classList.remove("dragging");
        draggedElement.classList.add("dropped");
        setTimeout(() => draggedElement.classList.remove("dropped"), 300); // Duration of the animation
      }
    });

    setDraggedItem(null);
    setSourceList(null);
    setDraggedIndex(null);
    setPlaceholderIndex(null);
    setPlaceholderList(null);
    setDropPosition("middle");
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.list}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "list1")}
      >
        <h3>List 1</h3>
        {list1.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item, index, "list1")}
            onDragEnter={(e) => handleDragEnter(e, "list1", index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "list1")}
            data-id={`${item}-${index}`}
            data-index={index}
            style={styles.item}
          >
            {item}
          </div>
        ))}
        {placeholderList === "list1" && placeholderIndex !== null && (
          <div
            style={{
              ...styles.placeholder,
              top: `${
                dropPosition === "middle"
                  ? placeholderIndex * 50 + 8
                  : dropPosition === "bottom"
                  ? (placeholderIndex + 1) * 50 + 8
                  : placeholderIndex * 50
              }px`, // Adjust based on item height and margin
            }}
          />
        )}
      </div>

      <div
        style={styles.list}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "list2")}
      >
        <h3>List 2</h3>
        {list2.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item, index, "list2")}
            onDragEnter={(e) => handleDragEnter(e, "list2", index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "list2")}
            data-id={`${item}-${index}`}
            data-index={index}
            style={styles.item}
          >
            {item}
          </div>
        ))}
        {placeholderList === "list2" && placeholderIndex !== null && (
          <div
            style={{
              ...styles.placeholder,
              top: `${
                dropPosition === "middle"
                  ? placeholderIndex * 50 + 8
                  : dropPosition === "bottom"
                  ? (placeholderIndex + 1) * 50 + 8
                  : placeholderIndex * 50
              }px`, // Adjust based on item height and margin
            }}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
  },
  list: {
    width: "300px",
    height: "fit-content",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    minHeight: "fit-content",
    position: "relative",
    overflow: "auto",
  },
  item: {
    padding: "12px",
    margin: "8px 0",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "move",
    transition: "transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    zIndex: 1,
  },
  placeholder: {
    height: "40px", // Adjust according to item height
    backgroundColor: "#eee",
    border: "2px dashed #ddd",
    borderRadius: "6px",
    position: "absolute",
    width: "calc(100% - 40px)", // Adjust width to fit list padding
    // left: "10px", // Adjust to fit padding
    margin: "8px 0",
    zIndex: 1,
    transition: "top 0.3s ease",
  },
};

export default DragDropLists;
