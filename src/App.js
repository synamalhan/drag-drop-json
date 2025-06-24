import React, { useState } from "react";
import { projects } from "./Projects";
import DraggableList from "./components/DraggableList";

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("savedList");
    if (saved) return JSON.parse(saved);
    return projects.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
    }));
  });

  const saveOrder = () => {
    localStorage.setItem("savedList", JSON.stringify(items));
    console.log("Saved Order:", items);
    alert("List saved to localStorage!");
  };

const downloadJSX = () => {
  const validItems = items.filter((i) => i && i.title); // filter out bad entries
  const formatted = `export const projects = [\n${validItems
    .map(formatJSXEntry)
    .join(",\n")}\n];`;

  const blob = new Blob([formatted], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = "projects.jsx";
  link.href = url;
  link.click();
};

const formatJSXEntry = (item) => {
  if (!item || !item.title) return "";

  const { title, summary, duration, techStack, details, links } = item;

  // Fallback if details are missing or malformed
  let detailsString = "<></>";
  try {
    if (details?.props?.children) {
      const children = Array.isArray(details.props.children)
        ? details.props.children
        : [details.props.children];

      detailsString = `<>\n${children
        .map((child) => {
          if (!child?.props?.children) return "";
          const content = Array.isArray(child.props.children)
            ? child.props.children
            : [child.props.children];
          return `  <p><strong>${content[0]?.props?.children || ""}</strong> ${content[1] || ""}</p>`;
        })
        .join("\n")}\n</>`;
    }
  } catch (err) {
    console.warn("Error formatting details JSX for item:", item, err);
  }

  return `  {
    title: ${JSON.stringify(title)},
    summary: ${JSON.stringify(summary)},
    duration: ${JSON.stringify(duration)},
    techStack: ${JSON.stringify(techStack)},
    details: (${detailsString}),
    links: ${JSON.stringify(links, null, 2)}
  }`;
};



  const downloadJSON = () => {
    const fileData = JSON.stringify(items, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "draggable-list.json";
    link.href = url;
    link.click();
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🧩 Draggable List</h1>
      <DraggableList items={items} setItems={setItems} />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={saveOrder}
          style={buttonStyle}
        >
          Save Order
        </button>
        <button
          onClick={downloadJSON}
          style={{ ...buttonStyle, backgroundColor: "#28a745", marginLeft: "10px" }}
        >
          Download JSON
        </button>
        <button
  onClick={downloadJSX}
  style={{ ...buttonStyle, backgroundColor: "#6f42c1", marginLeft: "10px" }}
>
  Download as JSX
</button>

      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "6px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default App;
