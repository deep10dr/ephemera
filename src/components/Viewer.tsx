"use client";
interface pdfFile {
  file: string;
}
export default function Viewer(pdfFile: pdfFile) {
  function fileLink(): string {
    if (pdfFile.file.endsWith(".pdf")) {
      return pdfFile.file + "#toolbar=0";
    }
    return (
      "https://docs.google.com/gview?url=" + pdfFile.file + "&embedded=true"
    );
  }
  const file: string = fileLink();
  return <iframe src={file} className="w-full min-h-screen"></iframe>;
}
