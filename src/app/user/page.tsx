"use client";

import { useRouter } from "next/navigation";
import data from "@/animations/wel.json";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { setWithExpiry, getWithExpiry } from "@/utils/storage";
import { Mail, User, Phone, Globe, AtSign } from "lucide-react";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface User {
  id: string;
  email: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_sign_in_at: string; // ISO timestamp
  phone: string;
  name: string;
  provider: string;
  identity_id: string;
}

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const data = getWithExpiry("user");
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      typeof data[0] === "object" &&
      data[0] !== null
    ) {
      const {
        email,
        identity_id,
        created_at,
        updated_at,
        provider,
        user_id,
        last_sign_in_at,
      } = data[0];
      const { name, phone } = data[0]?.identity_data || {};
      setUser({
        name: name,
        id: user_id,
        email: email,
        created_at: created_at,
        updated_at: updated_at,
        phone: phone,
        identity_id: identity_id,
        last_sign_in_at: last_sign_in_at,
        provider: provider,
      });
      console.log(data);
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#0F172A] p-2">
      {user ? (
        //user details
        <div className="g-[#1E293B] text-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <div className="flex justify-center items-center gap-2">
            <User /> {user.name}
          </div>

          {/* Email */}
          <div className="flex justify-center items-center gap-2">
            <Mail /> {user.email}
          </div>

          {/* Phone */}
          <div className="flex justify-center items-center gap-2">
            <Phone /> {user.phone}
          </div>
        </div>
      ) : (
        <div className="bg-[#1E293B] text-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <Lottie
            animationData={data}
            loop={true}
            className="text-xl font-bold"
          />
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
      )}
    </div>
  );
}
