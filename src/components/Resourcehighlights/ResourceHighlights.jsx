// StaticResourceSection.jsx
import React from "react";
import "./ResourceHighlights.css";

const ResourceHighlights = () => {
  return (
    <section className="static-resource-section">
      <div className="static-container">
        <div className="static-header">
          <h2>Your Academic Success Toolkit</h2>
          <p className="static-subtitle">
            Essential Resources at Your Fingertips
          </p>
        </div>

        <div className="static-grid">
          <div className="static-card notes-card">
            <div className="static-icon">📚</div>
            <h3>Comprehensive Notes</h3>
            <p>Well-organized study materials for all major subjects</p>
          </div>

          <div className="static-card papers-card">
            <div className="static-icon">📝</div>
            <h3>Previous Papers</h3>
            <p>Past exam papers with model solutions</p>
          </div>

          <div className="static-card community-card">
            <div className="static-icon">👥</div>
            <h3>Study Community</h3>
            <p>Connect with peers and experts.</p>
            <p>(Coming Soon)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceHighlights;
