"use client";
import loadingData2 from "../animations/Loader-cat.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-white text-black px-4"
    >
      {/* Lottie animation */}
      <Lottie
        animationData={loadingData2}
        loop={true}
        className="w-120 h-120"
      />

      {/* Main loading message */}
      <h2 className="text-2xl md:text-3xl font-semibold mt-4 text-center">
        Loading Your App...
      </h2>

  
      <p className="mt-6 text-gray-700 font-medium animate-pulse">
        Thank you for your patience! 
      </p>
    </div>
  );
}
