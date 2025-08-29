"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { setWithExpiry, getWithExpiry } from "@/utils/storage";
import { Mail, User, Phone, Globe, AtSign } from "lucide-react";
import AlertUser from "@/components/AlertUser";
import UserDetails from "@/components/UserDetail";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface User {
  id: string;
  email: string;
  created_at: string; //
  updated_at: string; //
  last_sign_in_at: string;
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
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#0F172A] p-2">
      {user ? (
        //user details
        <UserDetails user={user}  />
      ) : (
        <AlertUser />
      )}
    </div>
  );
}
