"use client";
import { useState, useEffect } from "react";
import supabase from "@/utils/client";
import { useRouter } from "next/navigation";
import { errorDetails } from "@/utils/types";
import { AnimatePresence, motion } from "framer-motion";
import { ImSpinner3 } from "react-icons/im";

interface PasswordInter {
  password: string;
  confirm_password: string;
}
export default function UpdatePasswordPage() {
  const [password, setPassword] = useState<PasswordInter>({
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<errorDetails>({
    error: false,
    sucess: false,
    message: "",
  });
  const router = useRouter();

  function showError(message: string) {
    setMessage({ error: true, message });
    setTimeout(() => {
      setMessage({ error: false, message: "" });
    }, 2000);
  }
  async function handleUpdatePassword() {
    if (password.password.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      pass,
    });
    setLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showError("Password updated! Redirecting...");
      setPassword("");
      setTimeout(() => router.push("/user/login"), 1500); // Redirect to login page
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center relative">
      <AnimatePresence>
        {(message.error || message.sucess) && (
          <motion.div
            key="message"
            className={`${
              message.error ? "bg-red-600" : "bg-green-500"
            } text-white text-sm font-medium rounded-xl shadow-xl px-4 py-2 absolute top-10`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4 }}
          >
            {message.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#1E293B]/90 backdrop-blur-md text-white w-72 rounded-2xl p-4 space-y-3 shadow-lg">
        <h2 className="text-center font-semibold">Set a New Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="bg-[#0F172A] p-3 rounded-xl w-full outline-none text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="bg-[#0F172A] p-3 rounded-xl w-full outline-none text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center items-center">
          <button
            className="bg-sky-400 hover:bg-sky-500 px-3 py-2 rounded-xl font-medium w-max cursor-pointer"
            disabled={loading}
            onClick={handleUpdatePassword}
          >
            {loading ? (
              <ImSpinner3 className="animate-spin " />
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
