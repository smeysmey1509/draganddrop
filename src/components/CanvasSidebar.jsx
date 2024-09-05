import React from "react";

const CanvasSidebar = () => {
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", item);
  };
  return (
    <div
      style={{
        width: "20%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "5%",
        padding: "10px",
        border: "1px solid black",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "serif",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          Component
        </h2>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "move")}
          style={{
            width: "100px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            cursor: "move",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
        >
          Move
        </div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "Button")}
          style={{
            width: "100px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            cursor: "move",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
        >
          Button
        </div>
      </div>
    </div>
  );
};

export default CanvasSidebar;
