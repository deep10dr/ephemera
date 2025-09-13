"use client";
import { errorDetails } from "@/utils/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFileData } from "@/context/FileDataContext";
import { decryptLink } from "@/utils/crypto";

export default function Page() {
  const { fileData } = useFileData();
  const [unlocked, setUnlocked] = useState(false);
  const [fileLink, setFileLink] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState<errorDetails>({
    message: "",
    error: false,
  });

  async function handleUnlock() {
    if (pin != fileData.pin) {
      setMessage({ message: "Incorrect pin", error: true });
      setTimeout(() => {
        setMessage({ message: "", error: false });
      }, 2000);
    } else {
      const data = await decryptLink(fileData.data_link, pin);
      let value = "";
      if (data.endsWith(".pdf")) {
        value = `${data}#toolbar=0&navpanes=0&scrollbar=0`;
      } else if (data.endsWith(".doc") || data.endsWith(".docx")) {
        value = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          data
        )}`;
      }
      setFileLink(value);
      setUnlocked(true);
    }
  }
  const [maskedPin, setMaskedPin] = useState("");
  const [showLastDigit, setShowLastDigit] = useState(false);


  useMemo(() => {
    if (pin.length === 0) {
      setMaskedPin("");
      setShowLastDigit(false);
      return;
    }

    setShowLastDigit(true);
    const timer = setTimeout(() => {
      setShowLastDigit(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pin]);

  const pinValue = useMemo(() => {
    if (pin.length === 0) return "";
    if (showLastDigit) {
      return "*".repeat(pin.length - 1) + pin[pin.length - 1];
    }
    
    return  "*".repeat(pin.length);
  }, [pin, showLastDigit]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center relative p-0 overflow-hidden">
      {fileData != undefined && unlocked && (
        <iframe src={fileLink} className="w-full min-h-screen bg-[#0F172A]" />
      )}

      <AnimatePresence>
        {(message.error || message.sucess) && (
          <motion.div
            key="message"
            className={`${
              message.error ? "bg-red-600" : "bg-green-500"
            } text-white text-sm font-medium rounded-xl shadow-xl px-4 py-2 absolute top-2d0`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4 }}
          >
            {message.message}
          </motion.div>
        )}
      </AnimatePresence>

      {!unlocked && (
        <div className="absolute left-1/2 top-1/2 -translate-1/2 w-max rounded-2xl h-max flex justify-center items-center bg-[#1E293B] p-6 flex-col gap-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Secure Access
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Enter the 6-digit PIN to view your file
            </p>
          </div>

          <InputOTP maxLength={6} value={pinValue} onChange={setPin} required>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <button
            onClick={handleUnlock}
            className="w-max px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 
          text-white rounded-lg shadow-md"
          >
            Unlock
          </button>
        </div>
      )}
    </div>
  );
}
