import React, { useState, useEffect } from "react";
import "./Footer.css";

const Footer = ({ scrollToHome, scrollToGetPapers, onProfileClick }) => {
  const [showMore, setShowMore] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: "IN",
    name: "English (India)",
    flagUrl: "https://flagcdn.com/in.svg",
  });

  const languages = [
    // Suggested Languages
    {
      code: "IN",
      name: "English (India)",
      flagUrl: "https://flagcdn.com/in.svg",
      region: "suggested",
    },
    {
      code: "GB",
      name: "English (UK)",
      flagUrl: "https://flagcdn.com/gb.svg",
      region: "suggested",
    },
    {
      code: "US",
      name: "English (US)",
      flagUrl: "https://flagcdn.com/us.svg",
      region: "suggested",
    },
    // Africa & Europe
    {
      code: "ZA",
      name: "English (ZA)",
      flagUrl: "https://flagcdn.com/za.svg",
      region: "africa_europe",
    },
    {
      code: "ES",
      name: "Català",
      flagUrl: "https://flagcdn.com/es.svg",
      region: "africa_europe",
    },
    {
      code: "DK",
      name: "Dansk",
      flagUrl: "https://flagcdn.com/dk.svg",
      region: "africa_europe",
    },
    {
      code: "DE",
      name: "Deutsch",
      flagUrl: "https://flagcdn.com/de.svg",
      region: "africa_europe",
    },
    // Asia Pacific
    {
      code: "AU",
      name: "English (AU)",
      flagUrl: "https://flagcdn.com/au.svg",
      region: "asia_pacific",
    },
    {
      code: "HK",
      name: "English (HK)",
      flagUrl: "https://flagcdn.com/hk.svg",
      region: "asia_pacific",
    },
    {
      code: "NZ",
      name: "English (NZ)",
      flagUrl: "https://flagcdn.com/nz.svg",
      region: "asia_pacific",
    },
    // Americas
    {
      code: "CA",
      name: "English (CA)",
      flagUrl: "https://flagcdn.com/ca.svg",
      region: "americas",
    },
    {
      code: "MX",
      name: "Español (MX)",
      flagUrl: "https://flagcdn.com/mx.svg",
      region: "americas",
    },
    {
      code: "BR",
      name: "Português (BR)",
      flagUrl: "https://flagcdn.com/br.svg",
      region: "americas",
    },
  ];

  const regions = {
    suggested: "Suggested languages for you",
    africa_europe: "Africa and Europe",
    asia_pacific: "Asia Pacific",
    americas: "North, South and Central America",
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };

  const handleClickOutside = (event) => {
    if (event.target.classList.contains("language-modal")) {
      setShowLanguageModal(false);
    }
  };

  useEffect(() => {
    const btn = document.querySelector(".language-btn");
    if (btn) {
      btn.style.setProperty("--flag-url", `url(${selectedLanguage.flagUrl})`);
    }
  }, [selectedLanguage]);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>About Us</h4>
          <p>
            [Your Website Name] is your go-to platform for college study
            materials, PDFs, subject-wise papers, and important notes.
            {showMore && (
              <span>
                <br />
                We aim to make learning easier by providing well-organized
                resources to help students succeed. Whether you're preparing for
                exams or need quick references, we’ve got you covered! 🚀 Let me
                know if you need further tweaks! 😊
              </span>
            )}
          </p>
          <a
            href="#!"
            onClick={() => setShowMore(!showMore)}
            className="more-link"
          >
            {showMore ? "Show Less" : "More"}
          </a>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <a
            href="src\components\Footer Link\FAQ-2\FAQ-2\Faq.html"
            target="_blank"
          >
            F/AQ
          </a>
          <a
            href="src\components\Footer Link\Privacy policy\Privacy policy\policy.html"
            target="_blank"
          >
            Privacy Policy
          </a>
          <a
            href="src\components\Footer Link\Terms and conditions\Terms and conditions\index.html"
            target="_blank"
          >
            Terms & Conditions
          </a>
        </div>
        <div className="footer-column">
          <h4>Quick Access</h4>
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              scrollToHome();
            }}
          >
            Home
          </a>
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              scrollToGetPapers();
            }}
          >
            Get Papers
          </a>
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              onProfileClick();
            }}
          >
            Profile
          </a>
        </div>
        <div className="footer-column">
          <h4>Contact Details</h4>
          <a href="mailto:support@studentshel.com">
            <i className="fas fa-envelope"></i> support@studentshel.com
          </a>
          <div className="physical-address">
            <i className="fas fa-map-marker-alt"></i>
            <span>
              Jalandhar,Punjab
              <br />
              144411,India
            </span>
          </div>
        </div>
      </div>

      <div className="language-selector">
        <button
          className="language-btn"
          onClick={() => setShowLanguageModal(true)}
          style={{ "--flag-url": `url(${selectedLanguage.flagUrl})` }}
        >
          <span className="selected-flag"></span>
          {selectedLanguage.name}
        </button>
      </div>

      {showLanguageModal && (
        <div className="language-modal" onClick={handleClickOutside}>
          <div className="language-modal-content">
            <h2>Select your language</h2>
            <p className="modal-subtitle">
              ✨Website Translation Depending on your Region is on Development
              and Will Come in Future.✨
            </p>

            {Object.entries(regions).map(([regionKey, regionName]) => (
              <div key={regionKey} className="language-region">
                <h3>{regionName}</h3>
                <div className="language-grid">
                  {languages
                    .filter((lang) => lang.region === regionKey)
                    .map((language) => (
                      <button
                        key={language.code}
                        className="language-option"
                        onClick={() => handleLanguageSelect(language)}
                      >
                        <img
                          src={language.flagUrl}
                          alt={`${language.name} flag`}
                          className="country-flag"
                        />
                        <span className="language-name">{language.name}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="social-media-icons">
        <a href="#" className="social-icon instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="social-icon linkedin">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="#" className="social-icon facebook">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="#" className="social-icon youtube">
          <i className="fab fa-youtube"></i>
        </a>
      </div>

      <div className="footer-notes-container">
        <p className="footer-note">
          Company is not affiliated to or endorsed by any school, college or
          university.
        </p>
        <p className="footer-note">
          Copyright &copy; 2025 Studentshel B.V., Keizersgracht 424-sous, 1016
          GC Amsterdam, KVK: 56320787, BTW: NL85232136
        </p>
      </div>
    </footer>
  );
};

export default Footer;
