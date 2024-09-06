import React, { useState, useRef, useEffect } from "react";

const CanvasContent = ({ droppedItems, onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialItemPos, setInitialItemPos] = useState({ x: 0, y: 0 });
  const [positions, setPositions] = useState(
    droppedItems.map(() => ({ x: 0, y: 0 }))
  );
  const [history, setHistory] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const dropZoneRef = useRef(null);
  const itemRefs = useRef([]); // To keep references of items

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggingItemIndex(index);

    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialItemPos({ x: positions[index].x, y: positions[index].y });

    setHistory((prevHistory) => [...prevHistory, positions]);
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
      setPositions([
        ...positions,
        {
          x: constrainedX,
          y: constrainedY,
        },
      ]);
      setHistory((prevHistory) => [...prevHistory, [...positions]]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setPositions(lastState);
    }
  };

  const handleItemClick = (index) => {
    setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    // Function to handle clicks outside
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
        padding: "10px",
        position: "relative",
      }}
    >
      <div>Hello</div>
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
            zIndex:
              isDragging && draggingItemIndex && selectedItemIndex === index
                ? 1000
                : 1,
            boxShadow:
              isDragging && draggingItemIndex === index
                ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0.4px, rgba(60, 64, 67, 0.25) 0px 2px 6px 2.8px"
                : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            border: selectedItemIndex === index ? "2px solid #007BFF" : "none",
            backgroundColor: "transparent",
            textTransform: "capitalize",
          }}
          onMouseDown={(e) => handleMouseDown(e, index)}
          onClick={() => handleItemClick(index)}
        >
          {item}
        </div>
      ))}
      <button
        onClick={handleUndo}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          padding: "5px 10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Undo
      </button>
    </div>
  );
};

export default CanvasContent;
