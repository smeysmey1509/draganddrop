import React, { useState, useRef, useEffect, useCallback } from "react";

const DropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null); // For handling direction
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialItemPos, setInitialItemPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [itemSize, setItemSize] = useState({ width: 100, height: 100 });
  const itemRef = useRef(null);
  const dropZoneRef = useRef(null);

  const GRID_SIZE = 5; // Size of grid cells for snapping

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialItemPos({ x: currentPos.x, y: currentPos.y });
  };

  const handleResizeMouseDown = (e, direction) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction); // Set the direction being resized
    setInitialMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const dropZone = dropZoneRef.current;
        const item = itemRef.current;

        if (dropZone && item) {
          const dropZoneRect = dropZone.getBoundingClientRect();
          const itemRect = item.getBoundingClientRect();

          const deltaX = e.clientX - initialMousePos.x;
          const deltaY = e.clientY - initialMousePos.y;

          const newX = initialItemPos.x + deltaX;
          const newY = initialItemPos.y + deltaY;

          const constrainedX = Math.max(
            0,
            Math.min(newX, dropZoneRect.width - itemRect.width)
          );
          const constrainedY = Math.max(
            0,
            Math.min(newY, dropZoneRect.height - itemRect.height)
          );

          const snappedX = Math.round(constrainedX / GRID_SIZE) * GRID_SIZE;
          const snappedY = Math.round(constrainedY / GRID_SIZE) * GRID_SIZE;

          setCurrentPos({ x: snappedX, y: snappedY });
        }
      } else if (isResizing) {
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;

        let newWidth = itemSize.width;
        let newHeight = itemSize.height;
        let newX = currentPos.x;
        let newY = currentPos.y;

        if (resizeDirection === "bottom-right") {
          newWidth = Math.max(50, itemSize.width + deltaX);
          newHeight = Math.max(50, itemSize.height + deltaY);
        } else if (resizeDirection === "bottom-left") {
          newWidth = Math.max(50, itemSize.width - deltaX);
          newHeight = Math.max(50, itemSize.height + deltaY);
          newX = currentPos.x + deltaX;
        } else if (resizeDirection === "top-right") {
          newWidth = Math.max(50, itemSize.width + deltaX);
          newHeight = Math.max(50, itemSize.height - deltaY);
          newY = currentPos.y + deltaY;
        } else if (resizeDirection === "top-left") {
          newWidth = Math.max(50, itemSize.width - deltaX);
          newHeight = Math.max(50, itemSize.height - deltaY);
          newX = currentPos.x + deltaX;
          newY = currentPos.y + deltaY;
        }

        setItemSize({ width: newWidth, height: newHeight });
        setCurrentPos({ x: newX, y: newY });
        setInitialMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [
      isDragging,
      isResizing,
      initialMousePos,
      initialItemPos,
      resizeDirection,
      itemSize,
      currentPos,
    ]
  );

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    } else if (isResizing) {
      setIsResizing(false);
      setResizeDirection(null); // Reset resize direction
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={dropZoneRef}
      style={{
        width: "100%",
        height: "100vh",
        border: isDragging ? "1px dashed #007BFF" : "1px dashed grey",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease-in-out",
      }}
    >
      {/* Draggable & Resizable Button */}
      <div
        ref={itemRef}
        style={{
          width: `${itemSize.width}px`,
          height: `${itemSize.height}px`,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          cursor: isDragging ? "move" : "default",
          boxShadow: isDragging
            ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0.4px, rgba(60, 64, 67, 0.25) 0px 2px 6px 2.8px"
            : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          position: "absolute",
          transform: `translate3d(${currentPos.x}px, ${currentPos.y}px, 0px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-in-out",
          zIndex: 2,
          backgroundColor: "#f0f0f0",
        }}
        onMouseDown={handleMouseDown}
      >
        Button
        {/* Resize handles at the four corners */}
        <div
          style={resizeHandleStyle("bottom-right")}
          onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
        />
        <div
          style={resizeHandleStyle("bottom-left")}
          onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
        />
        <div
          style={resizeHandleStyle("top-right")}
          onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
        />
        <div
          style={resizeHandleStyle("top-left")}
          onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
        />
      </div>
    </div>
  );
};

// Helper function to generate styles for resize handles based on their position
const resizeHandleStyle = (position) => {
  const size = "10px";
  const backgroundColor = "#000";
  const commonStyle = {
    width: size,
    height: size,
    position: "absolute",
    backgroundColor,
    zIndex: 3,
  };

  switch (position) {
    case "bottom-right":
      return { ...commonStyle, bottom: 0, right: 0, cursor: "se-resize" };
    case "bottom-left":
      return { ...commonStyle, bottom: 0, left: 0, cursor: "sw-resize" };
    case "top-right":
      return { ...commonStyle, top: 0, right: 0, cursor: "ne-resize" };
    case "top-left":
      return { ...commonStyle, top: 0, left: 0, cursor: "nw-resize" };
    default:
      return commonStyle;
  }
};

export default DropZone;
