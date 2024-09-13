import React from "react";

const Rectangle = ({ x, y, width, height, color, lineWidth }) => {
  return (
    <div
      style={{
        position: "relative",
        width: width,
        height: height,
        border: `${lineWidth}px solid ${color}`,
        boxSizing: "border-box",
        transform: `translate3d(${x}px, ${y}px, 0)`,
        pointerEvents: "none",
      }}
    />
  );
};

export default Rectangle;
