// src/components/DraggableList.jsx
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function DraggableList({ items, setItems }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(items);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setItems(updated);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-list" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              padding: "20px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {items.map((item, index) => {
              if (!item || !item.id || !item.title) return null;
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: "none",
                        background: snapshot.isDragging ? "#cceeff" : "#f9f9f9",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "16px",
                        boxShadow: snapshot.isDragging
                          ? "0 4px 8px rgba(0,0,0,0.2)"
                          : "0 2px 4px rgba(0,0,0,0.1)",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <h3>{item.title}</h3>
                      <p><strong>Summary:</strong> {item.summary}</p>
                      <p><strong>Duration:</strong> {item.duration}</p>
                      <p><strong>Tech Stack:</strong> {item.techStack?.join(", ")}</p>
                      {item.links?.map((link, i) => (
                        <p key={i}>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            {link.label}
                          </a>
                        </p>
                      ))}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
