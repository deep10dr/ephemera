"use client";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import data from "@/animations/wel.json";
export default function AlertUser() {
  const router = useRouter();
  return (
    <div className="bg-[#1E293B] text-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
      <Lottie animationData={data} loop={true} className="text-xl font-bold" />
      <p className="text-sm text-gray-400 mb-8">
        Secure your secrets with trust and reliability. Choose an option to
        continue.
      </p>

      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/user/login")}
          className="w-24 px-4 py-2 rounded-xl border border-gray-600 hover:bg-gray-700 transition cursor-pointer"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/user/signup")}
          className="w-24 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition cursor-pointer"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
