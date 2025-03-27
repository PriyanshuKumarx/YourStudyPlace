import React from "react";
import "./FeaturedResources.css";

const FeaturedResources = ({id}) => {
  const resources = [
    {
      id: 1,
      title: "DBMS Notes",
      description: "Comprehensive notes on Database Management Systems.",
      image: "src/assets/images/DBMS subject without humans.png"
,
    },
    {
      id: 2,
      title: "Computer Networks",
      description: "Detailed notes on Computer Networks.",
      image: "src/assets/images/computer networks.png",
    },
    {
      id: 3,
      title: "Data Structures",
      description: "Learn about various data structures and algorithms.",
      image: "src/assets/images/data structure without human.png",
    },
    {
      id: 4,
      title: "Operating Systems",
      description: "Understand the core concepts of Operating Systems.",
      image: "src/assets/images/operating system without humans.png",
    },
  ];


  return (
    <section className="featured-resources" id={id}>
      <h2>Featured Resources</h2>
      <div className="resources-grid">
        {resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <img src={resource.image} alt={resource.title} />
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <button>View Resource</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedResources;
