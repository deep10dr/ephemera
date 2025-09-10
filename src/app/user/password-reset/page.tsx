"use client";
import { useState, useEffect } from "react";
import supabase from "@/utils/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const router = useRouter();

  function showMessage(type: "error" | "success", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  useEffect(() => {
    async function handle() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("error");
      } else {
        console.log(data);
      }
    }
    handle();
  }, []);
  async function handleUpdatePassword() {
    if (password.length < 6) {
      showMessage("error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (error) {
      showMessage("error", error.message);
    } else {
      showMessage("success", "Password updated! Redirecting...");
      setPassword("");
      setTimeout(() => router.push("/user/login"), 1500); // Redirect to login page
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="bg-[#1E293B]/90 backdrop-blur-md text-white w-72 rounded-2xl p-4 space-y-3 shadow-lg">
        <h2 className="text-center font-semibold">Set a New Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="bg-[#0F172A] p-3 rounded-xl w-full outline-none text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-sky-400 hover:bg-sky-500 px-3 py-2 rounded-xl font-medium w-full"
          disabled={loading}
          onClick={handleUpdatePassword}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
