"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { retriveDataDetails } from "@/utils/types";


type FileDataContextType = {
  fileData: retriveDataDetails;
  setFileData: React.Dispatch<React.SetStateAction<retriveDataDetails>>;
};

// Default values
const defaultFileData: retriveDataDetails = {} as retriveDataDetails;

const FileDataContext = createContext<FileDataContextType | undefined>(undefined);

export const FileDataContextProvider = ({children,}: {children: ReactNode;}) => {
  const [fileData, setFileData] = useState<retriveDataDetails>(defaultFileData);
  return (
    <FileDataContext.Provider value={{ fileData, setFileData }}>
      {children}
    </FileDataContext.Provider>
  );
};


export const useFileData = () => {
  const ctx = useContext(FileDataContext);
  if (!ctx)
    throw new Error("useFileData must be used inside FileDataContextProvider");
  return ctx;
};
