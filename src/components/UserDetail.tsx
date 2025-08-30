import { Mail, Phone, Clock, Shield, LogOut } from "lucide-react";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill, RiShareForwardFill } from "react-icons/ri";
import { FaTelegram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { removeItem } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { user } from "../utils/types";
interface UserDetailsProps {
  user: user;
}


export default function UserDetails({ user }: UserDetailsProps) {
  const router = useRouter();
  return (
    <div className="bg-[#1E293B] text-white rounded-2xl shadow-lg w-full md:w-2/3 lg:w-1/2 mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-gray-700 overflow-hidden shadow-md">
            <Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=0D8ABC&color=fff&format=png`}
              alt="profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400 capitalize">{user.provider}</p>
          </div>
        </div>

        {/* Right: Logout */}
        <button
          className="flex items-center gap-2 text-sm px-4 py-2 hover:text-red-500 cursor-pointer  rounded-lg shadow-md transition"
          onClick={() => {
            removeItem("user");
            router.refresh();
          }}
        >
          <LogOut className="w-4 h-4 " />
          Logout
        </button>
      </div>

      {/* Professional Info Section */}
      <div className="grid grid-cols-1  gap-3 text-sm">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-400" />
          <span>{user.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-green-400" />
          <span>{user.phone || "Not provided"}</span>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-400" />
          <span>
            Last Sign-in: {new Date(user.last_sign_in_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <span>
            Account Created: {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
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
  );
}
