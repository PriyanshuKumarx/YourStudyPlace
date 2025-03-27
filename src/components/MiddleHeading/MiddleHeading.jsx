import React from "react";
import "./MiddleHeading.css";

const MiddleHeading = () => {
  return (
    <section className="middle-heading">
      <div className="decorative-circle" />
      <h2>Your Learning, Our Priority</h2>
      <p>
        Discover expertly curated study materials designed to help you master
        every subject with confidence and ease.
      </p>
      <a href="/resources" className="cta-button">
        Explore Resources
      </a>
    </section>
  );
};

export default MiddleHeading;
