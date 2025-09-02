"use client";
import { FileDataContextProvider } from "@/context/FileDataContext";
export default function FileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FileDataContextProvider>{children}</FileDataContextProvider>;
}
