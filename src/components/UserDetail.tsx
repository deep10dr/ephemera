import { Mail, Phone, User as UserIcon, Clock, Shield } from "lucide-react";
import Image from "next/image";
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
  phone: string;
  name: string;
  provider: string;
  identity_id: string;
}

interface UserDetailsProps {
  user: User;
}

export default function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className="bg-[#1E293B] text-white rounded-2xl shadow-lg w-full md:w-3/4 mx-auto overflow-hidden">
      {/* Cover Photo */}
      <div className="relative">
        <Image
          src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80"
          alt="cover"
          className="w-full h-48 object-cover"
          height={100}
          width={100}
        />
        {/* Profile Avatar */}
        <div className="absolute -bottom-12 left-8">
          <div className="w-28 h-28 rounded-full border-4 border-[#1E293B] overflow-hidden shadow-lg">
            <Image
              src={`https://ui-avatars.com/api/?name=${user.name}k&background=0D8ABC&color=fff`}
              alt="profile"
              className="w-full h-full object-cover"
              height={100}
              unoptimized
              width={100}
            />
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="pt-16 px-8">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-400">{user.provider}</p>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-700 px-8">
        <nav className="flex gap-6">
          <button className="pb-3 border-b-2 border-blue-500 text-blue-400 font-medium">
            About
          </button>
          <button className="pb-3 hover:text-blue-400">Settings</button>
        </nav>
      </div>

      {/* Info Section */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Last sign-in: {new Date(user.last_sign_in_at).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <span>
            Account opened: {new Date(user.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
