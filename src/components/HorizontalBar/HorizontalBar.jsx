import React from "react";
import "./HorizontalBar.css";

const HorizontalBar = () => {
  const notes = [
    { text: "DBMS Basic Concept", emoji: "📘", status: "updated" },
    { text: "Data/ER Model", emoji: "🆕", status: "new" },
    { text: "SQL Notes", emoji: "📝", status: "revised" },
    { text: "Concurrency", emoji: "🔥", status: "latest" },
    { text: "Computer Network", emoji: "📡", status: "updated" },
    { text: "Maths Notes", emoji: "🧮", status: "new" },
    { text: "DAA Notes", emoji: "📈", status: "revised" },
    { text: "Computer Vision", emoji: "👁️", status: "latest" },
  ];

  const handleNoteClick = (note) => {
    console.log("Clicked:", note.text);
  };

  return (
    <div className="horizontal-bar-container">
      <div className="horizontal-bar">
        {[...notes, ...notes].map((note, index) => (
          <div
            key={index}
            className={`note-item ${note.status}`}
            onClick={() => handleNoteClick(note)}
            role="button"
            tabIndex={0}
          >
            <div className="note-content">
              <div className="emoji-container">
                <span className="emoji">{note.emoji}</span>
              </div>
              <div className="text-content">
                <h3 className="note-title">{note.text}</h3>
                <div className="status-pill">{note.status}</div>
              </div>
              <div className="hover-gradient"></div>
              <div className="click-effect"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBar;
