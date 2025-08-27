"use client";

import { useState } from "react";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import supabase from "@/utils/client";

interface Details {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface MessageDetails {
  error?: boolean;
  success?: boolean;
  message: string;
}

export default function Page() {
  const router = useRouter();

  const [userData, setUserData] = useState<Details>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<MessageDetails>({
    error: false,
    success: false,
    message: "",
  });

  async function checkUser(email?: string, phone?: string): Promise<boolean> {
    let query = supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (email) query = query.eq("email", email);
    if (phone) query = query.eq("phone", phone);

    const { count, error } = await query;

    if (error) {
      console.error("Error checking user:", error.message);
      return false;
    }
    return count !== null && count > 0;
  }

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

  async function validate(): Promise<boolean> {
    if (!userData.name.trim()) {
      showError("Name is required");
      return false;
    }

    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError("Invalid email format");
      return false;
    }

    if (await checkUser(userData.email)) {
      showError("Email is already registered");
      return false;
    }

    if (!/^\d{10,}$/.test(userData.phone)) {
      showError("Phone number must be at least 10 digits");
      return false;
    }

    if (await checkUser(undefined, userData.phone)) {
      showError("Phone number already exists");
      return false;
    }

    if (userData.password.length < 6) {
      showError("Password must be at least 6 characters");
      return false;
    }

    if (userData.password !== userData.confirmPassword) {
      showError("Passwords do not match");
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (await validate()) {
      try {
        const { email, password, name, phone } = userData;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
            },
          },
        });

        if (error) {
          showError(error.message);
          return;
        }

        setMessage({
          success: true,
          message: "Please check your email to verify your account.",
        });

        setTimeout(() => {
          setMessage({ success: false, message: "" });
          router.replace("/user/login"); // redirect after signup
        }, 2000);
      } catch (error) {
        console.error(error);
        showError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-4 relative ">
      {/* Error/Success Popup */}
      <AnimatePresence>
        {(message.error || message.success) && (
          <motion.div
            key="popup"
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

      <div className="bg-[#1E293B]/90  backdrop-blur-md text-white w-[340px] rounded-2xl shadow-2xl p-6 ">
        <h1 className="font-bold text-2xl text-center mb-6 tracking-wide">
          Create an Account
        </h1>

        {/* Name */}
        <div className="flex items-center gap-2 bg-[#0F172A] autofill:bg-[#0F172A] hover:bg-[#1a2237] focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl mb-3">
          <FiUser className="text-gray-400" />
          <input
            type="text"
            placeholder="Enter your name"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </div>

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

        {/* Phone */}
        <div className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl mb-3">
          <MdOutlinePhone className="text-gray-400" />
          <input
            type="text"
            placeholder="Enter your phone number"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl mb-3">
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

        {/* Confirm Password */}
        <div className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl mb-5">
          <RiLockPasswordLine className="text-gray-400" />
          <input
            type="password"
            placeholder="Confirm password"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <div className="w-full flex justify-center items-center">
          <button
            onClick={handleSubmit}
            className="w-max px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition font-semibold text-sm shadow-md"
          >
            Sign Up
          </button>
        </div>

        <p className="text-xs text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer text-blue-400 hover:text-blue-300 transition"
            onClick={() => router.replace("/user/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
