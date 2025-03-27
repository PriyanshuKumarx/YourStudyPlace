import React, { useState, useRef, useEffect } from "react";
import { auth } from "./components/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import MiddleHeading from "./components/MiddleHeading/MiddleHeading";
import DropdownMenu from "./components/Dropdown/Dropdown";
import Footer from "./components/Footer/Footer";
import FeaturedResources from "./components/FeaturedResources/FeaturedResources";
import Horizontalbar from "./components/HorizontalBar/HorizontalBar";
import ResourceHighlights from "./components/Resourcehighlights/ResourceHighlights";
import Contributors from "./components/Contributors/Contributors";
import "./App.css";

function App() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [user, setUser] = useState(null);
  const [recents, setRecents] = useState([]);

  // Refs for sections
  const homeRef = useRef(null);
  const getPapersRef = useRef(null);
  const featuredRef = useRef(null);

  // Course data (moved from Dropdown.jsx)
  const courseData = {
    "Computer Science": {
      "Semester 1": [
        {
          name: "DBMS",
          items: [
            { type: "PDF", subItems: ["DBMS Basic Concept", "ER Diagram"] },
            { type: "Papers", subItems: ["CA", "MID"] },
          ],
        },
        {
          name: "Maths",
          items: [
            { type: "PDF", subItems: ["Calculus", "Algebra"] },
            { type: "Papers", subItems: ["CA", "MID"] },
          ],
        },
      ],
      "Semester 2": [
        {
          name: "Computer Network",
          items: [
            { type: "PDF", subItems: ["Network Layers", "TCP/IP"] },
            { type: "Papers", subItems: ["CA", "MID"] },
          ],
        },
      ],
    },
    Electrical: {
      "Semester 1": [
        {
          name: "Circuit Theory",
          items: [
            { type: "PDF", subItems: ["Ohm's Law", "Kirchhoff's Laws"] },
            { type: "Papers", subItems: ["CA", "MID"] },
          ],
        },
      ],
    },
  };

  // Track user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setIsLoginVisible(false); // Close login modal if user logs out
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to track recent items
  const trackRecent = (item) => {
    setRecents((prevRecents) => {
      const updatedRecents = [item, ...prevRecents.slice(0, 4)]; // Keep only the last 5 items
      return updatedRecents;
    });
    console.log("Recent item tracked:", item);
  };

  const toggleLogin = () => setIsLoginVisible(!isLoginVisible);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleProfileClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsSidebarActive(true);
  };

  return (
    <div className="main-content">
      {/* Sidebar */}
      <Sidebar
        isActive={isSidebarActive}
        onToggle={setIsSidebarActive}
        onCourseSelect={setSelectedCourse}
        onSemesterSelect={setSelectedSemester}
      />

      {/* Header */}
      <Header
        ref={homeRef}
        onLoginClick={toggleLogin}
        isLoggedIn={!!user}
        courseData={courseData} // Pass courseData as a prop
      />

      {/* Middle Heading */}
      <MiddleHeading />

      {/* Login Modal */}
      <Login isVisible={isLoginVisible} onClose={toggleLogin} />

      {/* Dropdown Section */}
      <div
        ref={getPapersRef}
        className="scroll-section"
        style={{ padding: "20px", background: "var(--background-color)" }}
      >
        <DropdownMenu
          onTrackRecent={trackRecent} // Pass the trackRecent function
          selectedCourse={selectedCourse}
          selectedSemester={selectedSemester}
        />
      </div>

      {/* Featured Resources */}
      <FeaturedResources id="featured-resources" className="scroll-section" />

      {/* Horizontal Bar */}
      <Horizontalbar />

      {/* Resource Highlights */}
      <ResourceHighlights />

      {/* Contributors */}
      <Contributors />

      {/* Footer */}
      <Footer
        scrollToHome={() => scrollToSection(homeRef)}
        scrollToGetPapers={() => scrollToSection(getPapersRef)}
        onProfileClick={handleProfileClick}
      />
    </div>
  );
}

export default App;