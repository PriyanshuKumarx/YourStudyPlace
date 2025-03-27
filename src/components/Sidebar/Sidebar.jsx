import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaAngleRight, FaUser, FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";
import { auth } from "../Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import "./Sidebar.css";

const Sidebar = React.memo(({ isActive, onToggle, onCourseSelect, onSemesterSelect }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [toast, setToast] = useState(null);
  const sidebarRef = useRef(null);
  const [user, setUser] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);
  const [recents, setRecents] = useState([]);
  const [profileImageError, setProfileImageError] = useState(false);

  // Load recents from localStorage
  useEffect(() => {
    const savedRecents = localStorage.getItem(`recents_${user?.uid}`);
    if (savedRecents) setRecents(JSON.parse(savedRecents));
  }, [user]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onToggle]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Try to get photoURL from provider data first
        const providerData = currentUser.providerData?.[0];
        let photoURL = providerData?.photoURL || currentUser.photoURL;

        // Add cache busting for Google hosted images
        if (photoURL?.includes("googleusercontent.com")) {
          photoURL = `${photoURL}?t=${new Date().getTime()}`;
        }

        setProfileUrl(photoURL || null);
        setProfileImageError(!photoURL);
      } else {
        setUser(null);
        setProfileUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageError = () => {
    if (user?.providerData?.[0]?.photoURL) {
      // Directly use provider data URL
      const providerUrl = `${user.providerData[0].photoURL}?t=${new Date().getTime()}`;
      setProfileUrl(providerUrl);
    } else {
      setProfileImageError(true);
    }
  };

  const trackRecentItem = (item) => {
    const newRecents = [
      item,
      ...recents.filter((recent) => recent.path !== item.path),
    ].slice(0, 5);
    setRecents(newRecents);
    if (user) localStorage.setItem(`recents_${user.uid}`, JSON.stringify(newRecents));
  };

  const clearRecents = () => {
    setRecents([]);
    if (user) localStorage.removeItem(`recents_${user.uid}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfileUrl(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout Failed:", error.message);
    }
  };

  const handleItemClick = (menuName, item, e) => {
    if (menuName === "Course") {
      setSelectedCourse(item);
      onCourseSelect?.(item);
    } else if (menuName === "Semester") {
      setSelectedSemester(item);
      onSemesterSelect?.(item);
    }

    // Ripple effect
    if (e.currentTarget) {
      e.currentTarget.classList.add("click-effect");
      setTimeout(() => {
        e.currentTarget.classList.remove("click-effect");
      }, 500);
    }

    // Show toast notification
    setToast(`${menuName} Selected: ${item}`);
    setTimeout(() => setToast(null), 2000);

    setOpenDropdown(null);
  };

  const menuItems = [
    {
      name: "Course",
      items: ["Computer Science", "Electrical", "Mechanical", "Bio Tech", "Chemical"],
    },
    {
      name: "Semester",
      items: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", 
             "Semester 5", "Semester 6", "Semester 7", "Semester 8"],
    },
    {
      name: "Recents",
      items: recents.length > 0 ? recents : ["No recent items"],
    },
  ];

  return (
    <>
      <div className="menu-btn" onClick={() => onToggle(!isActive)} aria-label="Toggle Sidebar">
        <FaBars />
      </div>

      <div className={`side-bar ${isActive ? "active" : ""}`} ref={sidebarRef}>
        <header>
          <div className="close-btn" onClick={() => onToggle(false)} aria-label="Close Sidebar">
            <FaTimes />
          </div>
          <div className="profile-container">
            {profileUrl && !profileImageError ? (
              <div className="profile-image-container">
                <img 
                  src={profileUrl} 
                  alt="Profile" 
                  className="profile-icon" 
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="profile-icon-fallback">
                <FaUser className="profile-icon-svg" />
              </div>
            )}
            <div className="profile-text">
              <h1>{user ? user.displayName || user.email : "Guest User"}</h1>
            </div>
          </div>
        </header>

        <nav aria-label="Main navigation">
          <div className="menu">
            {menuItems.map((menu, index) => (
              <div key={index} className="item">
                <a
                  className="sub-btn"
                  onClick={() => setOpenDropdown(openDropdown === menu.name ? null : menu.name)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openDropdown === menu.name}
                >
                  {menu.name}
                  <FaAngleRight className={`dropdown ${openDropdown === menu.name ? "rotate" : ""}`} />
                </a>
                <div
                  className={`sub-menu ${openDropdown === menu.name ? "active" : ""}`}
                  aria-hidden={openDropdown !== menu.name}
                >
                  {menu.items.map((item, i) => (
                    <a
                      key={i}
                      className={`sub-item ${
                        (menu.name === "Course" && item === selectedCourse) ||
                        (menu.name === "Semester" && item === selectedSemester)
                          ? "selected"
                          : ""
                      }`}
                      role="menuitem"
                      tabIndex={openDropdown === menu.name ? 0 : -1}
                      onClick={(e) => {
                        if (typeof item === "object") return;
                        handleItemClick(menu.name, item, e);
                      }}
                    >
                      {typeof item === "object" ? (
                        <>
                          {item.name}
                          {(menu.name === "Course" && item === selectedCourse) ||
                          (menu.name === "Semester" && item === selectedSemester) ? (
                            <span className="checkmark">✓</span>
                          ) : null}
                        </>
                      ) : item}
                    </a>
                  ))}
                  {menu.name === "Recents" && recents.length > 0 && (
                    <button className="clear-recents-btn" onClick={clearRecents}>
                      <FaTrash /> Clear Recents
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="side">
          <div className="log">
            <a onClick={handleLogout} href="#" role="button" tabIndex={0}>
              Log Out
            </a>
          </div>
        </div>

        {/* Toast Notification */}
        <div className="toast-container">
          {toast && <div className="selection-toast">{toast}</div>}
        </div>
      </div>
    </>
  );
});

Sidebar.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onCourseSelect: PropTypes.func,
  onSemesterSelect: PropTypes.func,
};

export default Sidebar;