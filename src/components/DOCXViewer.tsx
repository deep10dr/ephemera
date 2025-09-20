"use client";
import { useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";

interface DOCXViewerProps {
  fileUrl: string;
}

export default function DOCXViewer({ fileUrl }: DOCXViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDocx = async () => {
      if (!containerRef.current) return;

      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        await renderAsync(blob, containerRef.current);
      } catch (error) {
        console.error("Failed to load DOCX file:", error);
      }
    };

    loadDocx();
  }, [fileUrl]);

  return (
    <div
      ref={containerRef}
      style={{ border: "1px solid #ccc", padding: "10px", overflow: "auto" }}
    ></div>
  );
}
