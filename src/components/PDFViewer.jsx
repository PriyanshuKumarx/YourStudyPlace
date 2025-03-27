import React, { useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const PDFViewer = ({ fileUrl }) => {
  const containerRef = React.useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
        const container = containerRef.current;
        container.innerHTML = ""; // Clear previous content

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          container.appendChild(canvas);

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();
  }, [fileUrl]);

  return (
    <div
      ref={containerRef}
      className="pdf-viewer-container"
      style={{
        width: "100%",
        height: "100vh",
        overflow: "auto",
        padding: "20px",
        background: "#f0f0f0",
      }}
    />
  );
};

export default PDFViewer;