"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserWithExpiry } from "@/utils/storage";
import AlertUser from "@/components/AlertUser";
import { Mail, Phone, Clock, Shield, LogOut } from "lucide-react";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill, RiShareForwardFill } from "react-icons/ri";
import { FaTelegram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { removeItem } from "@/utils/storage";
import { user } from "@/utils/types";

export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState<user | null>(null);
  useEffect(() => {
    const data = getUserWithExpiry("user");
    setUserData(data);
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#0F172A] p-2">
      {userData != null ? (
        <div className="bg-[#1E293B] text-white rounded-2xl shadow-lg w-full md:w-2/3 lg:w-1/2 mx-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            {/* Left: Avatar + Name */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-gray-700 overflow-hidden shadow-md">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userData.name
                  )}&background=0D8ABC&color=fff&format=png`}
                  alt="profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-gray-400 capitalize">{userData.provider}</p>
              </div>
            </div>

            {/* Right: Logout */}
          </div>

          {/* Professional Info Section */}
          <div className="grid grid-cols-1  gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>{userData.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-400" />
              <span>{userData.phone || "Not provided"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span>
                Last Sign-in:{" "}
                {new Date(userData.last_sign_in_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>
                Account Created:{" "}
                {new Date(userData.created_at).toLocaleDateString()}
              </span>
            </div>
            <button
              className="flex w-max items-center gap-2 text-sm px-4 py-2 hover:text-red-500 cursor-pointer  rounded-lg shadow-md transition"
              onClick={() => {
                removeItem("user");
                setUserData(null);
              }}
            >
              <LogOut className="w-4 h-4 " />
              Logout
            </button>
          </div>

          {/* Footer Social Section */}
          <div className="mt-8 border-t border-gray-700 pt-6 flex items-center gap-2 text-xl">
            <FaFacebook className="cursor-pointer hover:text-blue-500 transition" />
            <FaTelegram className="cursor-pointer hover:text-sky-400 transition" />
            <RiInstagramFill className="cursor-pointer hover:text-pink-500 transition" />
            <IoLogoWhatsapp className="cursor-pointer hover:text-green-500 transition" />
            <RiShareForwardFill className="cursor-pointer hover:text-gray-300 transition" />
          </div>
        </div>
      ) : (
        <AlertUser />
      )}
    </div>
  );
}
