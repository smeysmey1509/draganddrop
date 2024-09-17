import React, { useState, useRef, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoDuplicateOutline } from "react-icons/io5";
import "./CanvasContent.css";
import Toolbar from "./Toolbar";

const CanvasContent = ({ onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
  const [resizingItemIndex, setResizingItemIndex] = useState(null);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialItemPos, setInitialItemPos] = useState({ x: 0, y: 0 });
  const [initialRectSize, setInitialRectSize] = useState({
    width: 0,
    height: 0,
  });
  const [rectStartPos, setRectStartPos] = useState(null);
  const [rectangles, setRectangles] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const canvasRef = useRef(null);

  const handleMouseDownCanvas = (e) => {
    if (selectedTool === "draw") {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const startX = e.clientX - canvasRect.left;
      const startY = e.clientY - canvasRect.top;
      setRectStartPos({ x: startX, y: startY });
      setRectangles((prev) => [
        ...prev,
        { x: startX, y: startY, width: 0, height: 0 },
      ]);
    }
  };

  const handleMouseMoveCanvas = (e) => {
    if (rectStartPos) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - canvasRect.left;
      const currentY = e.clientY - canvasRect.top;
      const updatedRectangles = [...rectangles];
      const lastIndex = updatedRectangles.length - 1;
      updatedRectangles[lastIndex] = {
        x: rectStartPos.x,
        y: rectStartPos.y,
        width: currentX - rectStartPos.x,
        height: currentY - rectStartPos.y,
      };
      setRectangles(updatedRectangles);
    }
    if (isDragging && draggingItemIndex !== null) {
      const dropZone = canvasRef.current;
      const dropZoneRect = dropZone.getBoundingClientRect();
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;
      const newX = initialItemPos.x + deltaX;
      const newY = initialItemPos.y + deltaY;
      const updatedRectangles = [...rectangles];
      updatedRectangles[draggingItemIndex] = {
        ...updatedRectangles[draggingItemIndex],
        x: newX,
        y: newY,
      };
      setRectangles(updatedRectangles);
    }
    if (isResizing && resizingItemIndex !== null) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - canvasRect.left;
      const currentY = e.clientY - canvasRect.top;
      const updatedRectangles = [...rectangles];
      updatedRectangles[resizingItemIndex] = {
        ...updatedRectangles[resizingItemIndex],
        width: currentX - updatedRectangles[resizingItemIndex].x,
        height: currentY - updatedRectangles[resizingItemIndex].y,
      };
      setRectangles(updatedRectangles);
    }
  };

  const handleMouseUpCanvas = () => {
    setRectStartPos(null);
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMoveCanvas);
    window.addEventListener("mouseup", handleMouseUpCanvas);
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveCanvas);
      window.removeEventListener("mouseup", handleMouseUpCanvas);
    };
  }, [
    isDragging,
    isResizing,
    rectStartPos,
    draggingItemIndex,
    resizingItemIndex,
  ]);

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
  };

  const handleRectMouseDown = (e, index) => {
    e.preventDefault();
    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
      setResizingItemIndex(index);
      const rect = e.target.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setInitialMousePos({ x: e.clientX, y: e.clientY });
      setInitialRectSize({
        width: rect.width,
        height: rect.height,
      });
    } else {
      setIsDragging(true);
      setDraggingItemIndex(index);
      setInitialMousePos({ x: e.clientX, y: e.clientY });
      setInitialItemPos({
        x: rectangles[index].x,
        y: rectangles[index].y,
      });
    }
  };

  const handleRectMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleRectMouseMove = (e, index) => {
    if (isDragging && draggingItemIndex === index) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;
      const newX = initialItemPos.x + deltaX;
      const newY = initialItemPos.y + deltaY;
      const updatedRectangles = [...rectangles];
      updatedRectangles[index] = {
        ...updatedRectangles[index],
        x: newX,
        y: newY,
      };
      setRectangles(updatedRectangles);
    }
    if (isResizing && resizingItemIndex === index) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - canvasRect.left;
      const currentY = e.clientY - canvasRect.top;
      const updatedRectangles = [...rectangles];
      updatedRectangles[index] = {
        ...updatedRectangles[index],
        width: currentX - updatedRectangles[index].x,
        height: currentY - updatedRectangles[index].y,
      };
      setRectangles(updatedRectangles);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedItemIndex !== null &&
        !canvasRef.current?.contains(event.target)
      ) {
        setSelectedItemIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedItemIndex]);

  return (
    <div
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        border: "1px dashed black",
        position: "relative",
      }}
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={(e) => handleMouseMoveCanvas(e)}
      onMouseUp={handleMouseUpCanvas}
    >
      <Toolbar selectedTool={selectedTool} onSelectTool={handleSelectTool} />
      {rectangles.map((rect, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            cursor: "move",
          }}
          onMouseDown={(e) => handleRectMouseDown(e, index)}
          onMouseMove={(e) => handleRectMouseMove(e, index)}
          onMouseUp={handleRectMouseUp}
        >
          {selectedItemIndex === index && (
            <div
              className="resize-handle"
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "10px",
                height: "10px",
                backgroundColor: "black",
                cursor: "nwse-resize",
              }}
            />
          )}
        </div>
      ))}
      <button className="undo-button">Undo</button>
    </div>
  );
};

export default CanvasContent;
