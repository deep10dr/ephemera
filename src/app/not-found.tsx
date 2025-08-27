"use client";
import notFoundData from "../animations/404.json";
import Lottie from "lottie-react";
export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col">
      <div className="md:w-150 md:h-140  w-70 h-70">
        <Lottie animationData={notFoundData} loop={true} />
      </div>
    </div>
  );
}
