import React, { useState, useRef, useEffect } from "react";

const DropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialItemPos, setInitialItemPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    // Save the initial mouse position and the initial item position
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialItemPos({ x: currentPos.x, y: currentPos.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dropZone = dropZoneRef.current;
      const item = itemRef.current;

      if (dropZone && item) {
        const dropZoneRect = dropZone.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        // Calculate the offset based on the initial mouse position and current mouse position
        const deltaX = e.clientX - initialMousePos.x;
        const deltaY = e.clientY - initialMousePos.y;

        // Calculate new position
        const newX = initialItemPos.x + deltaX;
        const newY = initialItemPos.y + deltaY;

        // Ensure the new position is within the drop zone boundaries
        const constrainedX = Math.max(
          0,
          Math.min(newX, dropZoneRect.width - itemRect.width)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, dropZoneRect.height - itemRect.height)
        );

        setCurrentPos({ x: constrainedX, y: constrainedY });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  console.log("initialMousePos", initialMousePos);

  return (
    <div
      ref={dropZoneRef}
      style={{
        width: "100%",
        height: "45vh",
        border: isDragging ? "2px dashed #007BFF" : "2px dashed grey",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease-in-out",
      }}
    >
      {/* Draggable Item */}
      <div
        ref={itemRef}
        style={{
          width: "100px",
          height: "100px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          cursor: "move",
          boxShadow: isDragging
            ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0.4px, rgba(60, 64, 67, 0.25) 0px 2px 6px 2.8px"
            : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          position: "absolute",
          transform: `translate3d(${currentPos.x}px, ${currentPos.y}px, 0px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-in-out",
          zIndex: 2,
        }}
        onMouseDown={handleMouseDown}
      >
        Move
      </div>
    </div>
  );
};

export default DropZone;
