import React, { useState, useRef, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { IoDuplicateOutline } from "react-icons/io5";
import "./CanvasContent.css";
import { GoDotFill } from "react-icons/go";

const CanvasContent = ({ onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialItemPos, setInitialItemPos] = useState({ x: 0, y: 0 });
  const [positions, setPositions] = useState([]);
  const [droppedItems, setDroppedItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const dropZoneRef = useRef(null);
  const itemRefs = useRef([]);

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggingItemIndex(index);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialItemPos({ x: positions[index].x, y: positions[index].y });
    setHistory((prevHistory) => [
      ...prevHistory,
      { items: [...droppedItems], positions: [...positions] },
    ]);
  };

  const handleMouseMove = (e) => {
    if (isDragging && draggingItemIndex !== null) {
      const dropZone = dropZoneRef.current;
      if (dropZone) {
        const dropZoneRect = dropZone.getBoundingClientRect();
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;
        const newX = initialItemPos.x + deltaX;
        const newY = initialItemPos.y + deltaY;
        const constrainedX = Math.max(
          0,
          Math.min(newX, dropZoneRect.width - 100)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, dropZoneRect.height - 100)
        );
        const updatedPositions = [...positions];
        updatedPositions[draggingItemIndex] = {
          x: constrainedX,
          y: constrainedY,
        };
        setPositions(updatedPositions);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggingItemIndex(null);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, draggingItemIndex]);

  const handleDrop = (event) => {
    event.preventDefault();
    const item = event.dataTransfer.getData("text/plain");
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const dropZoneRect = dropZone.getBoundingClientRect();
      const mouseX = event.clientX - dropZoneRect.left;
      const mouseY = event.clientY - dropZoneRect.top;
      const itemWidth = 100;
      const itemHeight = 100;
      const constrainedX = Math.max(
        0,
        Math.min(mouseX - itemWidth / 2, dropZoneRect.width - itemWidth)
      );
      const constrainedY = Math.max(
        0,
        Math.min(mouseY - itemHeight / 2, dropZoneRect.height - itemHeight)
      );
      onDrop(item);
      setDroppedItems((prevItems) => [...prevItems, item]);
      setPositions([...positions, { x: constrainedX, y: constrainedY }]);
      setHistory((prevHistory) => [
        ...prevHistory,
        { items: [...droppedItems], positions: [...positions] },
      ]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setDroppedItems(lastState.items);
      setPositions(lastState.positions);
    }
  };

  const handleItemClick = (index) => {
    setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDuplicate = (index) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { items: [...droppedItems], positions: [...positions] },
    ]);

    const newItem = droppedItems[index];
    const newItemPosition = {
      x: positions[index].x + 10,
      y: positions[index].y + 10,
    };

    setDroppedItems((prevItems) => [...prevItems, newItem]);
    setPositions((prevPositions) => [...prevPositions, newItemPosition]);
  };

  const handleDelete = (index) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { items: [...droppedItems], positions: [...positions] },
    ]);

    setDroppedItems((prevItems) => prevItems.filter((_, i) => i !== index));
    setPositions((prevPositions) =>
      prevPositions.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedItemIndex !== null &&
        !itemRefs.current[selectedItemIndex]?.contains(event.target)
      ) {
        setSelectedItemIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedItemIndex]);

  return (
    <div
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: "80%",
        height: "100%",
        border: "1px dashed black",
        position: "relative",
      }}
    >
      {droppedItems.map((item, index) => (
        <div
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          style={{
            width: "100px",
            height: "80px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            cursor: "move",
            position: "absolute",
            transform: `translate3d(${positions[index].x}px, ${positions[index].y}px, 0px)`,
            zIndex: isDragging && draggingItemIndex === index ? 1000 : 1,
            boxShadow:
              isDragging && draggingItemIndex === index
                ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0.4px, rgba(60, 64, 67, 0.25) 0px 2px 6px 2.8px"
                : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            border: selectedItemIndex === index ? "2px solid #007BFF" : "none",
            backgroundColor: "transparent",
            textTransform: "capitalize",
          }}
          className="test"
          onMouseDown={(e) => handleMouseDown(e, index)}
          onClick={() => handleItemClick(index)}
        >
          {item}
          <div
            className="list"
            style={{
              width: "100%",
              position: "absolute",
              bottom: `${positions[index].y <= 50 ? -60 : 100}px`,
              cursor: "pointer",
              fontSize: "18px",
              display: selectedItemIndex === index ? "flex" : "none",
              zIndex: 1001,
            }}
          >
            <ul
              style={{
                width: "100%",
                height: "auto",
                listStyleType: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                gap: "5px",
                background: "white",
                fontSize: "18px",
                padding: "10px 8px",
                borderRadius: "10px",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            >
              <li
                style={{ display: "flex" }}
                onClick={() => handleDuplicate(index)}
              >
                <IoDuplicateOutline />
              </li>
              <li
                style={{ display: "flex" }}
                onClick={() => handleDelete(index)}
              >
                <AiOutlineDelete />
              </li>
              <li style={{ display: "flex" }}>
                <BsThreeDots />
              </li>
            </ul>
          </div>
          {selectedItemIndex == index && (
            <div className="size-btn">
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  position: "absolute",
                  top: "-6%",
                  left: "-6%",
                  color: "white",
                  borderRadius: "50%",
                  border: "1px solid gray",
                  background: "white",
                }}
                onClick={() => alert(123)}
              ></div>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  position: "absolute",
                  top: "-6%",
                  right: "-6%",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "50%",
                  // background: "#007bff",
                  border: "1px solid gray",
                  background: "white",
                }}
              ></div>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  position: "absolute",
                  bottom: "-6%",
                  right: "-6%",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "50%",
                  // background: "#007bff",
                  border: "1px solid gray",
                  background: "white",
                }}
              ></div>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  position: "absolute",
                  bottom: "-6%",
                  left: "-6%",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "50%",
                  // background: "#007bff",
                  border: "1px solid gray",
                  background: "white",
                }}
              ></div>
              <div
                style={{
                  width: "24px",
                  height: "10px",
                  position: "absolute",
                  top: "-6%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                  // background: "#007bff",
                  border: "1px solid gray",
                  background: "white",
                }}
              ></div>
              <div
                style={{
                  width: "24px",
                  height: "10px",
                  position: "absolute",
                  bottom: "-6%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                  // background: "#007bff",
                  border: "1px solid gray",
                  background: "white",
                }}
              ></div>
              <div
                style={{
                  width: "10px",
                  height: "24px",
                  position: "absolute",
                  bottom: "50%",
                  left: "-6%",
                  transform: "translateY(50%)",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                  // background: "#007bff",
                  border: "1px solid gray",
                  background: "white",
                }}
              ></div>
              <div
                style={{
                  width: "10px",
                  height: "24px",
                  position: "absolute",
                  bottom: "50%",
                  right: "-6%",
                  transform: "translateY(50%)",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                  // background: "#007bff",
                  border: "1px solid gray",
                  background: "white",
                }}
              ></div>
            </div>
          )}
        </div>
      ))}
      <button
        className="canvas-content"
        onClick={handleUndo}
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          padding: "10px",
          border: "none",
          backgroundColor: "#007BFF",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
          opacity: "0.8",
        }}
      >
        Undo
      </button>
    </div>
  );
};

export default CanvasContent;
