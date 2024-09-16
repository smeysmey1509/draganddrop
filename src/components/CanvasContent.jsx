import React, { useState, useRef, useEffect, useCallback } from "react";
import Toolbar from "./Toolbar"; // Adjust the import path as needed

const DropZone = () => {
  const [selectedTool, setSelectedTool] = useState("draw"); // Track the selected tool
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [newRectangle, setNewRectangle] = useState(null);
  const [movingRectangleIndex, setMovingRectangleIndex] = useState(null);
  const [resizingRectangleIndex, setResizingRectangleIndex] = useState(null);
  const [selectedRectangleIndex, setSelectedRectangleIndex] = useState(null);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialRectPos, setInitialRectPos] = useState({ x: 0, y: 0 });
  const [initialRectSize, setInitialRectSize] = useState({
    width: 0,
    height: 0,
  });
  const dropZoneRef = useRef(null);

  const getRectangleIndexAtPosition = (x, y) => {
    return rectangles.findIndex((rect) => {
      return (
        x >= rect.startX &&
        x <= rect.startX + rect.width &&
        y >= rect.startY &&
        y <= rect.startY + rect.height
      );
    });
  };

  const handleMouseDown = (e) => {
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const dropZoneRect = dropZone.getBoundingClientRect();
      const startX = e.clientX - dropZoneRect.left;
      const startY = e.clientY - dropZoneRect.top;

      if (
        selectedTool === "resize" &&
        e.target.dataset.resizeIndex !== undefined
      ) {
        const resizeIndex = parseInt(e.target.dataset.resizeIndex, 10);
        setResizingRectangleIndex(resizeIndex);
        setInitialMousePos({ x: e.clientX, y: e.clientY });
        setInitialRectPos({
          x: rectangles[resizeIndex].startX,
          y: rectangles[resizeIndex].startY,
        });
        setInitialRectSize({
          width: rectangles[resizeIndex].width,
          height: rectangles[resizeIndex].height,
        });
        setSelectedRectangleIndex(resizeIndex);
      } else if (selectedTool === "move") {
        const index = getRectangleIndexAtPosition(startX, startY);
        if (index !== -1) {
          setMovingRectangleIndex(index);
          setInitialMousePos({ x: e.clientX, y: e.clientY });
          setInitialRectPos({
            x: rectangles[index].startX,
            y: rectangles[index].startY,
          });
          setSelectedRectangleIndex(index);
        }
      } else if (selectedTool === "draw") {
        setIsDrawing(true);
        setNewRectangle({
          startX,
          startY,
          width: 0,
          height: 0,
        });
      }
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDrawing && newRectangle) {
        const dropZone = dropZoneRef.current;
        if (dropZone) {
          const dropZoneRect = dropZone.getBoundingClientRect();
          const currentX = e.clientX - dropZoneRect.left;
          const currentY = e.clientY - dropZoneRect.top;

          const width = currentX - newRectangle.startX;
          const height = currentY - newRectangle.startY;

          setNewRectangle((prev) => ({
            ...prev,
            width,
            height,
          }));
        }
      } else if (movingRectangleIndex !== null) {
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;

        setRectangles((prev) =>
          prev.map((rect, index) =>
            index === movingRectangleIndex
              ? {
                  ...rect,
                  startX: initialRectPos.x + deltaX,
                  startY: initialRectPos.y + deltaY,
                }
              : rect
          )
        );
      } else if (resizingRectangleIndex !== null) {
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;

        setRectangles((prev) =>
          prev.map((rect, index) =>
            index === resizingRectangleIndex
              ? {
                  ...rect,
                  width: Math.max(initialRectSize.width + deltaX, 0),
                  height: Math.max(initialRectSize.height + deltaY, 0),
                }
              : rect
          )
        );
      }
    },
    [
      isDrawing,
      newRectangle,
      movingRectangleIndex,
      initialMousePos,
      initialRectPos,
      initialRectSize,
      resizingRectangleIndex,
      rectangles,
    ]
  );

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (newRectangle.width !== 0 && newRectangle.height !== 0) {
        setRectangles((prev) => [...prev, newRectangle]);
      }
      setNewRectangle(null);
    } else if (movingRectangleIndex !== null) {
      setMovingRectangleIndex(null);
    } else if (resizingRectangleIndex !== null) {
      setResizingRectangleIndex(null);
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
    <div>
      <Toolbar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
      <div
        ref={dropZoneRef}
        style={{
          width: "100%",
          height: "100vh",
          border: "1px dashed grey",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Render existing rectangles */}
        {rectangles.map((rect, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: rect.startX + "px",
              top: rect.startY + "px",
              width: rect.width + "px",
              height: rect.height + "px",
              backgroundColor: "#fff",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              cursor: selectedTool === "move" ? "move" : "auto",
              border:
                selectedRectangleIndex === index ? "1px solid #007BFF" : "none",
              zIndex: selectedRectangleIndex === index ? 1 : 0,
            }}
          >
            {/* Resizing handles */}
            <div
              data-resize-index={index}
              style={{
                position: "absolute",
                right: "-5px",
                bottom: "-5px",
                width: "10px",
                height: "10px",
                backgroundColor: "#007BFF",
                cursor: "nwse-resize",
              }}
            />
          </div>
        ))}
        {/* Draw new rectangle */}
        {newRectangle && (
          <div
            style={{
              position: "absolute",
              left: newRectangle.startX + "px",
              top: newRectangle.startY + "px",
              width: newRectangle.width + "px",
              height: newRectangle.height + "px",
              border: "1.2px solid #007BFF",
              backgroundColor: "#D9D9D9",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DropZone;
