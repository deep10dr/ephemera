"use client";

import { useEffect, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { RiLockPasswordFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import supabase from "@/utils/client";
import Loading from "@/components/loading";
import { setWithExpiry, getWithExpiry } from "@/utils/storage";

interface Details {
  email: string;
  password: string;
}

interface ErrorDetails {
  error?: boolean;
  sucess?: boolean;
  message: string;
}

export default function Page() {
  useEffect(() => {
    const data = getWithExpiry("user");
  }, []);
  const [userData, setUserData] = useState<Details>({
    email: "",
    password: "",
  });
  const navigate = useRouter();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<ErrorDetails>({
    error: false,
    sucess: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function showError(message: string) {
    setMessage({ error: true, message });
    setTimeout(() => {
      setMessage({ error: false, message: "" });
    }, 2000);
  }

  function validate(): boolean {
    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError("Invalid email format");
      return false;
    }
    if (userData.password.length < 6) {
      showError("Password must be at least 6 characters");
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (validate()) {
      try {
        setLoading(true);
        const { email, password } = userData;
        const responce = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        const { data, error } = responce;
        if (error != null) {
          showError("Error Can you please check you email or Password");
        } else {
          const userDetails = data?.user?.identities;
          setWithExpiry("user", userDetails, 7 * 24 * 60 * 60 * 1000);

          setMessage({ sucess: true, message: "Login successful" });
          setTimeout(() => {
            setMessage({ sucess: false, message: "" });
          }, 2000);
          setTimeout(() => navigate.replace("/user"), 1000);
        }
      } catch (error) {
        showError("Error Occuring while login ");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-3 relative ">
      {/* Error Popup */}
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
      {loading && <Loading />}

      <div className="bg-[#1E293B]/90 backdrop-blur-md text-white w-[340px] rounded-2xl shadow-2xl p-4 ">
        <h1 className="font-bold text-2xl text-center mb-6 tracking-wide">
          Login
        </h1>

        {/* Email */}
        <div className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl mb-3">
          <MdOutlineEmail className="text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl mb-5">
          <RiLockPasswordFill className="text-gray-400" />
          <input
            type={visible ? "text" : "password"}
            placeholder="Enter password"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="text-gray-400 hover:text-gray-200"
          >
            {visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>

        {/* Submit */}
        <div className="w-full flex justify-center items-center">
          <button
            onClick={handleSubmit}
            className="w-max px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition font-semibold text-sm shadow-md"
          >
            Login
          </button>
        </div>

        <p className="text-xs text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <span
            className="underline cursor-pointer text-blue-400 hover:text-blue-300 transition"
            onClick={() => navigate.replace("/user/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
