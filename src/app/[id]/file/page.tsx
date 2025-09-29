"use client";

import { errorDetails } from "@/utils/types";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFileData } from "@/context/FileDataContext";
import { decryptLink } from "@/utils/crypto";
import OtpInput from "@/components/OtpInput";
import Viewer from "@/components/Viewer";
import DOCXViewer from "@/components/DOCXViewer";

// It's good practice to define the type if it's not already global
// interface errorDetails {
//   message: string;
//   error: boolean;
//   success?: boolean; // Changed from sucess
// }

export default function Page() {
  const { fileData } = useFileData();

  const [unlocked, setUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileLink, setFileLink] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState<errorDetails>({
    message: "",
    error: false,
  });

  // Use a ref to manage the timeout and prevent memory leaks
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handleUnlock = useCallback(async () => {
    // Prevent multiple clicks while loading or if data is missing
    if (isLoading || !fileData) {
      return;
    }

    // Clear any existing message timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    setIsLoading(true);

    if (pin !== fileData.pin) {
      setMessage({ message: "Incorrect PIN", error: true });
      messageTimeoutRef.current = setTimeout(() => {
        setMessage({ message: "", error: false });
      }, 3000);
      setIsLoading(false);
      return;
    }

    try {
      const decryptedUrl = await decryptLink(fileData.data_link, pin);
      setFileLink(decryptedUrl);
      setUnlocked(true);
      // No need to set loading to false here, as the component will unmount
    } catch (e) {
      console.error("Decryption failed:", e);
      setMessage({
        message: "Failed to unlock file. Please try again.",
        error: true,
      });
      messageTimeoutRef.current = setTimeout(() => {
        setMessage({ message: "", error: false });
      }, 3000);
      setIsLoading(false);
    }
  }, [pin, fileData, isLoading]);

  // Render a fallback if file data is not yet available
  if (!fileData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-slate-900 text-white">
        <p>File data not available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center relative overflow-hidden bg-slate-800">
      {unlocked && fileLink && (
        <div className="w-full min-h-screen">
          <Viewer file={fileLink} />
        </div>
      )}

      {/* AnimatePresence for displaying user feedback messages */}
      <AnimatePresence>
        {(message.error || message.sucess) && (
          <motion.div
            key="message"
            className={`${
              message.error ? "bg-red-600" : "bg-green-500"
            } text-white text-sm font-medium rounded-xl shadow-xl px-4 py-2 absolute top-5`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {message.message}
          </motion.div>
        )}
      </AnimatePresence>
      {!unlocked && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max rounded-2xl h-max flex justify-center items-center bg-[#1E293B] p-6 flex-col gap-5 shadow-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Secure Access
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Enter the 6-digit PIN to view your file
            </p>
          </div>
          <OtpInput length={6} value={pin} onChange={setPin} />
          <button
            onClick={handleUnlock}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Unlocking..." : "Unlock"}
          </button>
        </div>
      )}
    </div>
  );
}
