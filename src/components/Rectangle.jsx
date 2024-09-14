import React from "react";

const Rectangle = ({ x, y, width, height, color, lineWidth }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        border: `${lineWidth}px solid ${color}`,
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    />
  );
};

export default Rectangle;
