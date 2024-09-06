import React, { useState } from "react";
import DragDropLists from "./components/DragDropList";
import DropZone from "./components/DropZone";
import Canvas from "./components/Canvas";

const App = () => {
  const [activeComponent, setActiveComponent] = useState("DragDropLists");

  const components = [
    {
      name: "Drag and Drop List",
      key: "DragDropLists",
      component: <DragDropLists />,
    },
    { name: "Drop Zone", key: "DropZone", component: <DropZone /> },
    { name: "Canvas Component", key: "Canvas", component: <Canvas /> },
  ];

  const renderComponent = () => {
    const activeItem = components.find((item) => item.key === activeComponent);
    return activeItem ? activeItem.component : null;
  };

  return (
    <div className="App" style={{}}>
      <ul
        style={{
          listStyleType: "none",
          padding: "18px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
      >
        {components.map((item) => (
          <li
            key={item.key}
            style={{
              cursor: "pointer",
              color: activeComponent === item.key ? "blue" : "black",
            }}
            onClick={() => setActiveComponent(item.key)}
          >
            {item.name}
          </li>
        ))}
      </ul>
      <div style={{ padding: "18px" }}>{renderComponent()}</div>
    </div>
  );
};

export default App;
