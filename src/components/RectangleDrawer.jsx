import React, { useState, useRef, useEffect } from "react";
import Rectangle from "./Rectangle";

const RectangleDrawer = ({
  width = 800,
  height = 600,
  color = "black",
  lineWidth = 2,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [rectangles, setRectangles] = useState([]);
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      // This part is now only used for visual feedback while drawing
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Clear canvas and redraw all rectangles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rectangles.forEach((r) => {
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.width, r.height);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.lineWidth;
        ctx.stroke();
      });

      // Draw new rectangle
      ctx.beginPath();
      ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  const handleMouseUp = (e) => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Save the new rectangle
      setRectangles([
        ...rectangles,
        {
          x: startPos.x,
          y: startPos.y,
          width: x - startPos.x,
          height: y - startPos.y,
          color,
          lineWidth,
        },
      ]);

      setIsDrawing(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDrawing, rectangles, color, lineWidth]);

  return (
    <div style={{ position: "relative", width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "2px dashed grey",
          display: "block",
          position: "absolute",
        }}
        onMouseDown={handleMouseDown}
      />
      {rectangles.map((r, index) => (
        <Rectangle
          key={index}
          x={r.x}
          y={r.y}
          width={r.width}
          height={r.height}
          color={r.color}
          lineWidth={r.lineWidth}
        />
      ))}
    </div>
  );
};

export default RectangleDrawer;
