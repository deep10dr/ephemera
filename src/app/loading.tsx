"use client";
import Lottie from "lottie-react";
import loadingData from "../animations/l1.json";
import loadingData2 from "../animations/l2.json";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center  z-50">
      <Lottie animationData={loadingData2} loop={true} className="w-120 h-120 invert-100" />
    </div>
  );
}
