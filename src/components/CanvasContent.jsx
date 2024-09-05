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
  const dropZoneRef = useRef(null);

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggingItemIndex(index);

    // Save the initial mouse position and the initial item position
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialItemPos({ x: positions[index].x, y: positions[index].y });

    // Save the current state to history
    setHistory((prevHistory) => [...prevHistory, positions]);
  };

  const handleMouseMove = (e) => {
    if (isDragging && draggingItemIndex !== null) {
      const dropZone = dropZoneRef.current;

      if (dropZone) {
        const dropZoneRect = dropZone.getBoundingClientRect();

        // Calculate the offset based on the initial mouse position and current mouse position
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;

        // Calculate new position
        const newX = initialItemPos.x + deltaX;
        const newY = initialItemPos.y + deltaY;

        // Ensure the new position is within the drop zone boundaries
        const constrainedX = Math.max(
          0,
          Math.min(newX, dropZoneRect.width - 100) // assuming item width is 100px
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, dropZoneRect.height - 100) // assuming item height is 100px
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

      // Ensure the dropped item is within the drop zone boundaries
      const itemWidth = 100; // Width of the item
      const itemHeight = 100; // Height of the item

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
    event.preventDefault(); // Necessary to allow a drop
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setPositions(lastState);
    }
  };

  console.log("history", history);

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
      {droppedItems.map((item, index) => (
        <div
          key={index}
          style={{
            width: "100px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            cursor: "move",
            position: "absolute",
            transform: `translate3d(${positions[index].x}px, ${positions[index].y}px, 0px)`,
            zIndex: isDragging && draggingItemIndex === index ? 2 : 1,
            boxShadow:
              isDragging && draggingItemIndex === index
                ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0.4px, rgba(60, 64, 67, 0.25) 0px 2px 6px 2.8px"
                : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
          onMouseDown={(e) => handleMouseDown(e, index)}
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
