"use client";
import supabase from "@/utils/client";
import { useParams } from "next/navigation";
import NavBar from "@/components/navbar";
import { useEffect, useState } from "react";
import Greeting from "@/components/Greeting";
export default function Page() {
  const params = useParams();
  const id: string | undefined = params?.id?.toString();
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    const visitedStr = sessionStorage.getItem("visited");
    const data = visitedStr ? JSON.parse(visitedStr) : null;
    if (data?.visit == false) {
      setVisited(true);
      setTimeout(() => {
        setVisited(false);
      }, 8000);
    }
  }, []);
  return (
    <div className="w-full min-h-screen p-0 m-0 relative">
      <NavBar />
      {visited && (
        <div className=" absolute top-1/2 left-1/2 -translate-1/2">
          <Greeting />
        </div>
      )}
    </div>
  );
}
