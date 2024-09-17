import React, { useState, useRef, useCallback, useEffect } from "react";
import Toolbar from "./Toolbar"; // Adjust the import path as needed

const DropZone = () => {
  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newRectangle, setNewRectangle] = useState(null);
  const [selectedRectangleIndex, setSelectedRectangleIndex] = useState(null);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialRectPos, setInitialRectPos] = useState({ x: 0, y: 0 });
  const [initialRectSize, setInitialRectSize] = useState({
    width: 0,
    height: 0,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedTool, setSelectedTool] = useState("draw"); // Added state for the selected tool
  const dropZoneRef = useRef(null);

  // Load rectangles from local storage
  useEffect(() => {
    const savedRectangles =
      JSON.parse(localStorage.getItem("rectangles")) || [];
    setRectangles(savedRectangles);
  }, []);

  // Save rectangles to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("rectangles", JSON.stringify(rectangles));
  }, [rectangles]);

  // Click outside handler
  const handleClickOutside = (e) => {
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.target)) {
      setSelectedRectangleIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      console.log("dropZoneRect", dropZoneRect);
      const startX = e.clientX - dropZoneRect.left;
      const startY = e.clientY - dropZoneRect.top;

      const clickedRectangleIndex = getRectangleIndexAtPosition(startX, startY);

      if (e.target.dataset.resizeIndex !== undefined) {
        // Resize mode
        const resizeIndex = parseInt(e.target.dataset.resizeIndex, 10);
        setIsResizing(true);
        setIsMoving(false); // Ensure moving is reset
        setSelectedTool("resize"); // Set the tool to resize
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
      } else if (clickedRectangleIndex !== -1) {
        // Move or select mode
        setIsMoving(true);
        setIsResizing(false); // Ensure resizing is reset
        setSelectedTool("move"); // Set the tool to move
        setSelectedRectangleIndex(clickedRectangleIndex);
        setInitialMousePos({ x: e.clientX, y: e.clientY });
        setInitialRectPos({
          x: rectangles[clickedRectangleIndex].startX,
          y: rectangles[clickedRectangleIndex].startY,
        });
      } else {
        // Draw mode
        setIsDrawing(true);
        setIsMoving(false); // Ensure moving is reset
        setIsResizing(false); // Ensure resizing is reset
        setSelectedTool("draw"); // Set the tool to draw
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
      } else if (isMoving && selectedRectangleIndex !== null) {
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;

        setRectangles((prev) =>
          prev.map((rect, index) =>
            index === selectedRectangleIndex
              ? {
                  ...rect,
                  startX: initialRectPos.x + deltaX,
                  startY: initialRectPos.y + deltaY,
                }
              : rect
          )
        );
      } else if (isResizing && selectedRectangleIndex !== null) {
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;

        setRectangles((prev) =>
          prev.map((rect, index) =>
            index === selectedRectangleIndex
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
      isMoving,
      initialMousePos,
      initialRectPos,
      selectedRectangleIndex,
      isResizing,
      initialRectSize,
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
    } else if (isMoving) {
      setIsMoving(false);
    } else if (isResizing) {
      setIsResizing(false);
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
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent onMouseDown
              setSelectedRectangleIndex(index);
            }}
            style={{
              position: "absolute",
              left: rect.startX + "px",
              top: rect.startY + "px",
              width: rect.width + "px",
              height: rect.height + "px",
              backgroundColor: "#D9D9D9",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              cursor: isMoving ? "move" : "auto",
              border:
                selectedRectangleIndex === index ? "2px solid #007BFF" : "none",
              zIndex: selectedRectangleIndex === index ? 1 : 0,
            }}
          >
            {/* Resizing handles */}
            {selectedRectangleIndex === index && (
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
            )}
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
