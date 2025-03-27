import React, { useState, useEffect, forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import "./Header.css";

const Header = forwardRef(({ onLoginClick, isLoggedIn, courseData }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Refs for the search container and search results box
  const searchContainerRef = useRef(null);
  const searchResultsBoxRef = useRef(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer1);
  }, []);

  // Handle clicks outside the search input and results box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        searchResultsBoxRef.current &&
        !searchResultsBoxRef.current.contains(event.target)
      ) {
        setSearchResults([]); // Close the search results box
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const bubbles = Array.from({ length: 15 }, (_, index) => (
    <div key={index} className={`bubble bubble${index + 1}`}></div>
  ));

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const results = filterData(query, courseData);
      console.log("Search Results:", results);
      setSearchResults(results);
    }
  };

  // Function to filter data based on the search query
  const filterData = (query, courseData) => {
    const filteredResults = [];

    for (const course in courseData) {
      if (course.toLowerCase().includes(query.toLowerCase())) {
        for (const semester in courseData[course]) {
          courseData[course][semester].forEach((subject) => {
            subject.items.forEach((item) => {
              // Only include PDFs and Papers
              if (item.type === "PDF" || item.type === "Paper") {
                item.subItems.forEach((subItem) => {
                  filteredResults.push({
                    course,
                    semester,
                    subject: subject.name,
                    type: item.type,
                    subItem,
                  });
                });
              }
            });
          });
        }
      }
    }

    return filteredResults;
  };

  // Function to handle click on search results
  const handleSearchResultClick = (result) => {
    const filePathMap = {
      "DBMS Basic Concept": "/pdfs/dbms-basic-concept.pdf",
      "ER Diagram": "/pdfs/er-diagram.pdf",
      "CA": "/papers/ca-paper.pdf",
      "MID": "/papers/mid-paper.pdf",
      "Calculus": "/pdfs/calculus.pdf",
      "Algebra": "/pdfs/algebra.pdf",
      "Network Layers": "/pdfs/network-layers.pdf",
      "TCP/IP": "/pdfs/tcp-ip.pdf",
      "Ohm's Law": "/pdfs/ohms-law.pdf",
      "Kirchhoff's Laws": "/pdfs/kirchhoffs-laws.pdf",
    };

    const filePath = filePathMap[result.subItem];
    if (filePath) {
      window.open(filePath, "_blank");
    } else {
      console.error("File not found for:", result.subItem);
    }
  };

  return (
    <>
      <header className="hero" ref={ref}>
        <h1 className={`heading ${isVisible ? "visible" : ""}`}>
          Smart Study, Sure Success
        </h1>
        <p className={`quote ${isVisible ? "visible" : ""}`}>
          Access quality study materials, stay focused, and achieve your academic
          goals effortlessly!
        </p>
        <div className={`search-container ${isVisible ? "visible" : ""}`} ref={searchContainerRef}>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button aria-label="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
        <div
          className={`scroll-arrow ${isVisible ? "visible" : ""}`}
          onClick={handleScrollDown}
          role="button"
          tabIndex={0}
          aria-label="Scroll Down"
        >
          <i className="fa fa-chevron-down"></i>
        </div>

        {/* Conditionally render login button */}
        {!isLoggedIn && (
          <button
            className="login-button"
            onClick={onLoginClick}
            aria-label="Login or Sign Up"
          >
            Login / Sign Up
          </button>
        )}

        {bubbles}
      </header>

      {/* Search results box */}
      {searchResults.length > 0 && (
        <div
          className="search-results-box"
          ref={searchResultsBoxRef}
          style={{
            top: searchContainerRef.current
              ? searchContainerRef.current.getBoundingClientRect().bottom + window.scrollY + 10
              : "20%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleSearchResultClick(result)}
            >
              <p>
                <strong>{result.subItem}</strong> 
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
});

Header.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  courseData: PropTypes.object.isRequired,
};

export default Header;