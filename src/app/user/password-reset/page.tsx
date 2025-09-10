"use client";
import { useState } from "react";
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

  function showError(message: string, isSuccess = false) {
    setMessage({ error: !isSuccess, sucess: isSuccess, message });
    setTimeout(() => {
      setMessage({ error: false, sucess: false, message: "" });
    }, 2500);
  }

  async function handleUpdatePassword() {
    if (password.password.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }
    if (password.password !== password.confirm_password) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password.password,
    });
    setLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showError("✅ Password updated! Redirecting...", true);
      setPassword({ password: "", confirm_password: "" });
      setTimeout(() => router.push("/user/login"), 2000);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Toast / Message */}
      <AnimatePresence>
        {(message.error || message.sucess) && (
          <motion.div
            key="message"
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white font-medium text-sm 
            ${message.error ? "bg-red-500/90" : "bg-green-500/90"}`}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
          >
            {message.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl w-80 p-6 space-y-5"
      >
        <h2 className="text-center text-lg font-semibold text-white">
          Set a New Password
        </h2>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            className="bg-slate-900/60 focus:bg-slate-900  
              transition-all duration-200 rounded-xl px-4 py-3 w-full outline-none text-sm"
            value={password.password}
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="bg-slate-900/60 focus:bg-slate-900 
              transition-all duration-200 rounded-xl px-4 py-3 w-full outline-none text-sm"
            value={password.confirm_password}
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                confirm_password: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex justify-center items-center">
          <button
            disabled={loading}
            onClick={handleUpdatePassword}
            className="w-max flex justify-center items-center bg-sky-500 hover:bg-sky-600 
            transition-colors duration-200 px-2 py-2 rounded-xl font-medium text-white shadow-md 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <ImSpinner3 className="animate-spin text-lg" />
            ) : (
              "Update Password"
            )}
          </button>
        </div>

        <p className="text-xs text-center text-slate-400">
          Make sure your password is at least 6 characters long.
        </p>
      </motion.div>
    </div>
  );
}
