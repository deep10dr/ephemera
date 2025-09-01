"use client";
import { retriveDataDetails, errorDetails } from "@/utils/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Page(e: retriveDataDetails) {
  const { pin: userpina } = e;
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState<errorDetails>({
    message: "",
    error: false,
  });

  const handleUnlock = () => {
    if (pin != userpina) {
      setMessage({ message: "Incorrect pin", error: true });
      setTimeout(() => {
        setMessage({ message: "", error: false });
      },2000);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center relative p-1 overflow-hidden">
      {/* <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          "https://mpyprfqmvwtetbuvjmgn.supabase.co/storage/v1/object/public/file/0fee8adb-7861-4695-bc80-d208e3e8e321/files/profile-images.docx"
        )}`}
        className="w-full min-h-screen bg-[#0F172A]"
      /> */}
      <AnimatePresence>
        {(message.error || message.sucess) && (
          <motion.div
            key="message"
            className={`${
              message.error ? "bg-red-600" : "bg-green-500"
            } text-white text-sm font-medium rounded-xl shadow-xl px-4 py-2 absolute top-20`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4 }}
          >
            {message.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-1/2 top-1/2 -translate-1/2 w-max rounded-2xl h-max flex justify-center items-center bg-[#1E293B] p-6 flex-col gap-5">
        <p className="text-white">Enter the pin to view the file</p>

        <InputOTP maxLength={6} value={pin} onChange={setPin}>
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
    </div>
  );
}
