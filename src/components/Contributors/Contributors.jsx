import React from 'react';
import './Contributors.css';

const ContributorsEnhanced = () => {
  const contributors = [
    {
      name: "Priyanshu",
      role: "Lead Developer",
      bio: "Full-stack developer focused on building scalable solutions.",
      image: "src/assets/images/Con3sub.jpg",
      socials: {
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        email: "mailto:john@example.com",
      }
    },
    // {
    //   name: "Devika",
    //   role: "Contributor",
    //   bio: "Contributed to this website development and progress.",
    //   image: "src/assets/images/Contributor2.png",
    //   socials: {
    //     github: "https://github.com/janesmith",
    //     linkedin: "https://linkedin.com/in/janesmith",
    //     email: "mailto:jane@example.com",
    //   }
    // }
  ];

  return (
    <section className="contributors-section">
      <div className="contributors-container">
        <div className="contributors-header">
          <h2>Our Team</h2>
          <div className="header-line"></div>
        </div>
        
        <div className="contributors-grid">
          {contributors.map((contributor, index) => (
            <div className="contributor-card" key={index}>
              <div className="card-top">
                <div className="avatar-container">
                  <img 
                    src={contributor.image} 
                    alt={contributor.name} 
                    className="contributor-avatar"
                  />
                </div>
                <div className="pattern-overlay"></div>
              </div>
              
              <div className="card-content">
                <div className="contributor-info">
                  <h3>{contributor.name}</h3>
                  <span className="contributor-role">{contributor.role}</span>
                  <p className="contributor-bio">{contributor.bio}</p>
                  
                  <div className="social-links">
                    <a href={contributor.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href={contributor.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href={contributor.socials.email} aria-label="Email">
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContributorsEnhanced;