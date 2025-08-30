"use client";

import Lottie from "lottie-react";
import loadingData from "../animations/l1.json";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center  z-50">
      <Lottie animationData={loadingData} loop={true} className="w-60 h-60" />
    </div>
  );
}
