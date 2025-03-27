import React, { useState, useRef, useEffect } from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./Dropdown.css";

// IMPORTANT: Make sure this path is correctly configured
// This is CRITICAL for PDF.js to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
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

// Create a custom PDF viewer component for use in the main application
const PDFViewer = ({ fileUrl, docTitle }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [url, setUrl] = useState(null);
  
  // Use effect to handle URL processing
  useEffect(() => {
    // For Firebase Storage URLs or other URLs with special characters
    // we need to ensure they're properly encoded
    try {
      // First try to use the URL as-is
      setUrl(fileUrl);
      setLoading(true);
      setError(false);
    } catch (err) {
      console.error("Error setting URL:", err);
      setError(true);
      setLoading(false);
    }
  }, [fileUrl]);
  
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  }
  
  function changePage(offset) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // Debugging function to manually create an embedded PDF viewer using object/embed tags
  const createEmbeddedViewer = () => {
    return (
      <div className="embedded-pdf-container">
        <object
          data={url}
          type="application/pdf"
          width="100%"
          height="100%"
          className="embedded-pdf"
        >
          <embed 
            src={url} 
            type="application/pdf"
            width="100%" 
            height="100%" 
          />
          <p>This browser does not support PDFs. Please download the PDF to view it.</p>
        </object>
      </div>
    );
  };

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer-header">
        <h2>{docTitle}</h2>
        {!error && numPages && (
          <div className="pdf-controls">
            <button 
              onClick={previousPage} 
              disabled={pageNumber <= 1}
              className="page-button"
            >
              Previous
            </button>
            <span className="page-info">
              Page {pageNumber} of {numPages || '--'}
            </span>
            <button 
              onClick={nextPage} 
              disabled={!numPages || pageNumber >= numPages}
              className="page-button"
            >
              Next
            </button>
          </div>
        )}
      </div>
      
      <div className="pdf-document-container">
        {loading && <div className="loading">Loading document...</div>}
        
        {error ? (
          // If react-pdf fails, fall back to browser's built-in PDF viewing capability
          createEmbeddedViewer()
        ) : (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error("Error loading PDF:", err);
              setError(true);
              setLoading(false);
            }}
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
              cMapPacked: true,
              standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/standard_fonts'
            }}
          >
            {!loading && !error && (
              <Page 
                pageNumber={pageNumber} 
                width={800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="pdf-page"
              />
            )}
          </Document>
        )}
      </div>
    </div>
  );
};

// Custom Modal component to display the PDF viewer
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const DropdownMenu = ({ selectedCourse, selectedSemester, onTrackRecent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ url: '', title: '' });
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const closeAllPanels = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setActiveNestedDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeAllPanels();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const height = menuRef.current.getBoundingClientRect().height;
      const featuredResources = document.getElementById("featured-resources");
      if (featuredResources) {
        featuredResources.style.marginTop = `${height + 30}px`;
      }
    } else {
      const featuredResources = document.getElementById("featured-resources");
      if (featuredResources) {
        featuredResources.style.marginTop = "0";
      }
    }
    return () => {
      const featuredResources = document.getElementById("featured-resources");
      if (featuredResources) {
        featuredResources.style.marginTop = "0";
      }
    };
  }, [isOpen]);

  // Add CSS to disable context menu and other actions
  useEffect(() => {
    // Add styles to disable PDF interactions that might allow downloading
    const style = document.createElement('style');
    style.innerHTML = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        overflow: hidden;
        position: relative;
      }
      
      .modal-close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 1010;
      }
      
      .pdf-viewer-container {
        display: flex;
        flex-direction: column;
        height: 80vh;
        user-select: none;
      }
      
      .pdf-viewer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
      }
      
      .pdf-document-container {
        flex-grow: 1;
        overflow-y: auto;
        position: relative;
        min-height: 500px;
      }
      
      .pdf-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .page-button {
        padding: 5px 10px;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .page-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .page-info {
        margin: 0 10px;
      }
      
      .loading {
        text-align: center;
        padding: 20px;
      }
      
      .pdf-page {
        margin: 0 auto;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        user-select: none;
        pointer-events: none;
      }
      
      /* Embedded PDF viewer */
      .embedded-pdf-container {
        width: 100%;
        height: 100%;
        min-height: 500px;
      }
      
      .embedded-pdf {
        border: none;
      }
      
      /* This prevents selection, right-click, etc. */
      .pdf-document-container,
      .pdf-document-container * {
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Disable context menu on the entire document while viewing PDFs
    const disableContextMenu = (e) => {
      if (modalOpen) {
        e.preventDefault();
        return false;
      }
    };
    
    document.addEventListener('contextmenu', disableContextMenu);
    
    return () => {
      document.head.removeChild(style);
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, [modalOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
    setActiveNestedDropdown(null);
  };

  const toggleNestedDropdown = (index) => {
    setActiveNestedDropdown(activeNestedDropdown === index ? null : index);
  };

  const handleItemClick = (subject, itemType, subItem) => {
    onTrackRecent({
      name: subItem,
      type: itemType.toLowerCase(),
      path: `${subject}/${itemType}/${subItem}`,
      timestamp: new Date().getTime(),
    });

    // Here's our example Firebase URL that we know works
    const testPdf = "https://firebasestorage.googleapis.com/v0/b/login-63f67.firebasestorage.app/o/materials%2FComputer%20Science%2FSemester%201%2FDBMS%2FPDF%2F3.%20Line%20Types.pdf?alt=media&token=a2e1a11c-4631-476b-ad74-e0c32e67910d";
    
    const filePathMap = {
      "DBMS Basic Concept": testPdf,
      "ER Diagram": testPdf, // Using the known working URL for testing
      CA: testPdf,
      MID: testPdf,
      Calculus: testPdf,
      Algebra: testPdf,
      "Network Layers": testPdf,
      "TCP/IP": testPdf,
      "Ohm's Law": testPdf,
      "Kirchhoff's Laws": testPdf,
    };

    const filePath = filePathMap[subItem];
    if (filePath) {
      console.log("Opening PDF:", filePath);
      // Open the PDF in our custom viewer modal
      setSelectedPdf({ url: filePath, title: subItem });
      setModalOpen(true);
    } else {
      console.error("File path not found for:", subItem);
    }
  };

  const subjects = courseData[selectedCourse]?.[selectedSemester] || [];

  return (
    <>
      <div className="dropdown-container" ref={dropdownRef}>
        <button
          onClick={toggleMenu}
          className="dropdown-button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Toggle dropdown menu"
        >
          {selectedCourse && selectedSemester
            ? `${selectedCourse}`
            : "Select Your Subject"}
          <FaCaretDown className={`caret ${isOpen ? "open" : ""}`} />
        </button>
        <div
          className={`dropdown-menu ${isOpen ? "open" : ""}`}
          role="menu"
          ref={menuRef}
        >
          {!selectedCourse || !selectedSemester ? (
            <div>Please select a course and semester</div>
          ) : subjects.length === 0 ? (
            <div>No subjects available</div>
          ) : (
            subjects.map((subject, index) => (
              <DropdownItem
                key={index}
                label={subject.name}
                isOpen={activeDropdown === index}
                onClick={() => toggleDropdown(index)}
              >
                {subject.items.map((item, i) => (
                  <DropdownItem
                    key={i}
                    label={item.type}
                    isOpen={activeNestedDropdown === i}
                    onClick={() => toggleNestedDropdown(i)}
                  >
                    {item.subItems.map((subItem, j) => (
                      <button
                        key={j}
                        className="dropdown-link nested-item"
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                        aria-label={`Select ${subItem}`}
                        onClick={() =>
                          handleItemClick(subject.name, item.type, subItem)
                        }
                      >
                        {subItem}
                      </button>
                    ))}
                  </DropdownItem>
                ))}
              </DropdownItem>
            ))
          )}
        </div>
      </div>
      
      {/* Modal for PDF viewing */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <PDFViewer fileUrl={selectedPdf.url} docTitle={selectedPdf.title} />
      </Modal>
    </>
  );
};

const DropdownItem = React.memo(({ label, isOpen, onClick, children }) => {
  return (
    <div className={`dropdown-link ${isOpen ? "active" : ""}`}>
      <button
        onClick={onClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="dropdown-toggle"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
        tabIndex={0}
        aria-label={`Toggle ${label} dropdown`}
      >
        <span className="button-content">
          {label}
          {children && <FaCaretRight className={`sub-caret ${isOpen ? "open" : ""}`} />}
        </span>
      </button>
      {children && (
        <div
          className={`dropdown-nested ${isOpen ? "open" : ""}`}
          role="menu"
          aria-hidden={!isOpen}
        >
          {children}
        </div>
      )}
    </div>
  );
});

DropdownItem.propTypes = {
  label: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

DropdownMenu.propTypes = {
  selectedCourse: PropTypes.string,
  selectedSemester: PropTypes.string,
  onTrackRecent: PropTypes.func.isRequired,
};

export default DropdownMenu;