import React from "react";

const Rectangle = ({ x, y, width, height, color, lineWidth }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        border: `${lineWidth}px solid ${color}`,
        boxSizing: "border-box",
        pointerEvents: "none",
        background: "#D9D9D9",
        cursor: "move",
      }}
    />
  );
};

export default Rectangle;
