"use client";
import { useState } from "react";
import supabase from "@/utils/client";
import { MdOutlineEmail } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function showMessage(type: "error" | "success", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSendLink() {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showMessage("error", "Invalid email address");
      return;
    }
    if (!agree) {
      showMessage("error", "Please confirm to continue");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://ephemera-phi.vercel.app/user/password-reset/",
    });
    setLoading(false);

    if (error) {
      showMessage("error", error.message);
    } else {
      showMessage("success", "Reset link sent! Check your email.");
      setEmail("");
      setAgree(false);
    }
  }

  return (
    <>
      {/* Floating message */}
      <AnimatePresence>
        {message && (
          <motion.div
            key="message"
            className={`${
              message.type === "error" ? "bg-red-600" : "bg-green-500"
            } text-white text-sm font-medium rounded-xl shadow-xl px-4 py-2 absolute top-10`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4 }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset box */}
      <div className="bg-[#1E293B]/90 backdrop-blur-md text-white w-72 rounded-2xl p-4 space-y-3 shadow-lg">
        {/* Email input */}
        <div className="flex items-center gap-2 bg-[#0F172A]   transition p-3 rounded-xl">
          <MdOutlineEmail className="text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Agreement checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <p className="text-xs">I confirm I want to reset my password</p>
        </div>

        {/* Reset button */}
        <div className="w-full flex justify-center items-center">
          <button
            className={`w-max px-3 py-2 rounded-xl font-medium transition ${
              agree
                ? "bg-sky-400 hover:bg-sky-500 cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!agree || loading}
            onClick={handleSendLink}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </div>
    </>
  );
}
